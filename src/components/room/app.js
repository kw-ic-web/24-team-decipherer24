import express from "express";
import path from "path";
import { Server } from "socket.io";
import http from "http";
import fs from "fs";cd 
import jwt from "jsonwebtoken";

const app = express();
const port = 3000;
const __dirname = path.resolve();
const httpServer = http.createServer(app);
const wsServer = new Server(httpServer);
const JWT_SECRET = "your_secret_key";

let publicRoom = [];

// 토큰 생성 함수
function generateToken(id) {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: "1h" });
}

// 토큰 검증 함수
function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

function getJoinedRoomName(socket) {
  return Array.from(socket.rooms)[1];
}

function getPublicRoom(name) {
  return publicRoom.find((room) => room.name === name);
}

function emitPlayerChange(room) {
  wsServer.in(room.name).emit("player_change", {
    blackPlayerName: room.blackPlayerName,
    whitePlayerName: room.whitePlayerName,
    isGameReady: room.blackPlayerName && room.whitePlayerName,
  });
  updateRoomList();
}

function updateRoomList() {
  wsServer.sockets.emit("room_list", publicRoom);
}

function enterRoom(socket, name) {
  const room = getPublicRoom(name);
  if (!room) {
    socket.emit("error", "정상적인 방이 아닙니다.");
    return;
  }

  if (room.blackPlayer && room.whitePlayer) {
    socket.emit("error", "방이 가득 찼습니다.");
    return;
  }

  socket.join(name);
  socket.emit("room_enter", room);
  wsServer.to(name).emit("message", `${socket.id} 님이 입장하셨습니다.`);
  updateRoomList();
}

function leaveRoom(socket) {
  const name = getJoinedRoomName(socket);
  if (!name) return;

  const room = getPublicRoom(name);
  if (!room) return;

  if (room.blackPlayer === socket.id) {
    room.blackPlayer = "";
    room.blackPlayerName = "";
  } else if (room.whitePlayer === socket.id) {
    room.whitePlayer = "";
    room.whitePlayerName = "";
  }

  if (wsServer.sockets.adapter.rooms.get(name)?.size === 1) {
    publicRoom = publicRoom.filter((r) => r.name !== name);
    updateRoomList();
  } else {
    emitPlayerChange(room);
  }

  socket.leave(name);
}

wsServer.on("connection", (socket) => {
  socket.emit("room_list", publicRoom); // 연결 시 방 목록 보내기

  socket.onAny((event) => console.log(`Socket event: ${event}`));

  socket.on("room_list", () => socket.emit("room_list", publicRoom));

  socket.on("room_new", (name) => {
    const token = socket.handshake.auth.token;
    const userData = verifyToken(token);
    if (token && !userData) {
      socket.emit("error", "토큰이 유효하지 않습니다.");
      return;
    }

    if (socket.rooms.size > 1 || !name) {
      socket.emit("error", "방 생성에 실패했습니다.");
      return;
    }

    const roomInfo = {
      name,
      blackPlayer: "",
      blackPlayerName: "",
      whitePlayer: "",
      whitePlayerName: "",
    };

    publicRoom.push(roomInfo);
    updateRoomList();
    enterRoom(socket, name);
  });

  socket.on("room_enter", (name) => {
    enterRoom(socket, name);
  });

  socket.on("room_leave", () => {
    leaveRoom(socket);
    socket.emit("room_leave");
  });

  socket.on("player_change", ({ color, token, playerName }) => {
    const userData = verifyToken(token);
    if (token && !userData) {
      socket.emit("error", "토큰이 유효하지 않습니다.");
      return;
    }

    const roomName = getJoinedRoomName(socket);
    const room = getPublicRoom(roomName);
    if (!room) return;

    if (color === "black" && !room.blackPlayer) {
      room.blackPlayer = socket.id;
      room.blackPlayerName = playerName;
    } else if (color === "white" && !room.whitePlayer) {
      room.whitePlayer = socket.id;
      room.whitePlayerName = playerName;
    } else {
      socket.emit("error", "선택할 수 없습니다.");
      return;
    }
    emitPlayerChange(room);
  });

  socket.on("disconnecting", () => leaveRoom(socket));
});

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  fs.readFile(path.join(__dirname, "public/index.html"), "utf8", (err, html) => {
    if (err) {
      res.status(500).send("Error loading index.html");
    } else {
      res.send(html);
    }
  });
});

httpServer.listen(port, () => console.log(`Server running on http://localhost:${port}`));
