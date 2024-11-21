const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // 클라이언트 URL
    methods: ["GET", "POST"],
    // allowedHeaders: ["Content-Type"],
    credentials: true,
  },
});

app.use(cors({
    origin: "http://localhost:3000", // 허용할 클라이언트 URL
    methods: ["GET", "POST"],
    credentials: true,
  }));

let rooms = []; // 방 목록
let userRoomMap = {}; // 사용자와 방 연결 관리

// RESTful API로 방 목록 반환
app.get("/", (req, res) => {
  res.status(200).json({ rooms });
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // 방 목록 요청 처리
  socket.on("room_list", () => {
    console.log("Sending room list");
    socket.emit("room_list", rooms); // 방 목록 클라이언트로 전송
  });

  // 방 생성 요청 처리
  socket.on("room_new", (roomName) => {
    if (!rooms.includes(roomName)) {
      rooms.push(roomName); // 방 목록에 새로운 방 추가
      console.log("Room created:", roomName);
      io.emit("room_list", rooms); // 모든 클라이언트에 방 목록 갱신
    } else {
      console.log("Room already exists:", roomName);
      socket.emit("error_message", `Room "${roomName}" already exists.`);
    }
  });

  // 방 입장 처리
  socket.on("room_enter", (roomName) => {
    if (rooms.includes(roomName)) {
      socket.join(roomName); // 소켓을 해당 방에 추가
      userRoomMap[socket.id] = roomName; // 사용자-방 매핑
      console.log(`${socket.id} entered room: ${roomName}`);
      socket.emit("room_enter_success", roomName); // 입장 성공 알림
    } else {
      console.log(`Room "${roomName}" does not exist`);
      socket.emit("error_message", `Room "${roomName}" does not exist.`);
    }
  });

  // 방 퇴장 처리
  socket.on("room_leave", () => {
    const roomName = userRoomMap[socket.id];
    if (roomName) {
      socket.leave(roomName); // 소켓을 해당 방에서 제거
      delete userRoomMap[socket.id]; // 매핑 정보 삭제
      console.log(`${socket.id} left room: ${roomName}`);
      socket.emit("room_leave_success", roomName); // 퇴장 성공 알림
    } else {
      console.log(`User ${socket.id} is not in any room.`);
      socket.emit("error_message", "You are not in any room.");
    }
  });

  // 사용자 연결 종료 처리
  socket.on("disconnect", () => {
    const roomName = userRoomMap[socket.id];
    if (roomName) {
      socket.leave(roomName); // 방에서 나가기
      delete userRoomMap[socket.id]; // 사용자-방 매핑 제거
      console.log(`${socket.id} disconnected and left room: ${roomName}`);
    }
    console.log("User disconnected:", socket.id);
  });
});

const PORT = 5000; // 서버 포트

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
