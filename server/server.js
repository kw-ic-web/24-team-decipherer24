const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

app.use(cors());

let rooms = []; // 방 목록
let userRoomMap = {}; // 사용자와 방 매핑

io.on("connection", (socket) => {
  console.log(`New connection: ${socket.id}`);

  // 방 목록 요청
  socket.on("room_list", () => {
    socket.emit("room_list", rooms);
  });

  // 방 생성 및 입장
  socket.on("room_new", ({ name }, callback) => {
    if (rooms.some((room) => room.name === name)) {
      return callback({ success: false, message: "Room name already exists." });
    }

    const newRoom = { name, players: [socket.id] };
    rooms.push(newRoom);
    userRoomMap[socket.id] = name;
    socket.join(name);

    io.emit("room_list", rooms); // 실시간 방 목록 업데이트
    callback({ success: true, room: newRoom });
  });

  // 방 입장
  socket.on("room_enter", ({ roomName }, callback) => {
    const room = rooms.find((r) => r.name === roomName);

    if (!room) {
      return callback({ success: false, message: "Room not found." });
    }

    if (room.players.length >= 2) {
      return callback({ success: false, message: "Room is full." });
    }

    room.players.push(socket.id);
    userRoomMap[socket.id] = roomName;
    socket.join(roomName);

    io.emit("room_list", rooms); // 실시간 방 목록 업데이트
    io.to(roomName).emit("room_update", room); // 방 내부 업데이트
    callback({ success: true, room });
  });

  // 방 나가기
  socket.on("room_leave", (callback) => {
    const roomName = userRoomMap[socket.id];
    if (!roomName) {
      return callback({ success: false, message: "Not in a room." });
    }

    const room = rooms.find((r) => r.name === roomName);
    if (room) {
      room.players = room.players.filter((player) => player !== socket.id);
      if (room.players.length === 0) {
        rooms = rooms.filter((r) => r.name !== roomName); // 빈 방 삭제
      }
      io.emit("room_list", rooms);
      io.to(roomName).emit("room_update", room);
    }

    socket.leave(roomName);
    delete userRoomMap[socket.id];
    callback({ success: true });
  });

  // 사용자 연결 종료
  socket.on("disconnect", () => {
    const roomName = userRoomMap[socket.id];
    if (roomName) {
      const room = rooms.find((r) => r.name === roomName);
      if (room) {
        room.players = room.players.filter((player) => player !== socket.id);
        if (room.players.length === 0) {
          rooms = rooms.filter((r) => r.name !== roomName);
        }
        io.emit("room_list", rooms);
        io.to(roomName).emit("room_update", room);
      }
      delete userRoomMap[socket.id];
    }
    console.log(`User disconnected: ${socket.id}`);
  });
});

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
