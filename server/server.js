require('dotenv').config();
const express = require("express");
const { Server } = require("socket.io");
const cors = require("cors");
const http= require("http")
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../src/models/User.js');
const authRoutes = require('../src/models/auth.js'); 
const PORT = 21281;

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true,  // 클라이언트와 서버 간의 인증을 허용하려면 true로 설정
  },
});

app.use(express.json());
app.use(express.static('public'));
app.use(cors({
  origin: '*', // 허용할 클라이언트 URL 추가
  methods: ["GET", "POST"],
  credentials: true,
}));
app.use('/api', authRoutes);


mongoose.connect("mongodb://root:1234@localhost:27017/admin", 
  { dbName: "kwic" })
  .then(() => {
      console.log("MongoDB 연결 성공!");
  })
  .catch(err => {
      console.error("MongoDB 연결 실패:", err);
  });


app.get("/", (req, res) => {
  res.status(200).json({ rooms });
});

app.get('/api/check-id', async (req, res) => {
  const userId = req.query.userid; // 프론트엔드에서 보낸 파라미터 이름 'userid'를 사용

  try {
      // 데이터베이스에서 ID 검색
      const user = await User.findOne({ id: userId });
      
      if (user) {
          // ID가 이미 존재하는 경우
          return res.json({ exists: true });
      } else {
          // ID가 사용 가능할 경우
          return res.json({ exists: false });
      }
  } catch (error) {
      console.error('Error checking ID:', error);
      return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});



// 회원가입 API
app.post('/api/register', async (req, res) => {
  try {
    const { id, password } = req.body;

    // 중복 아이디 확인
    const existingUser = await User.findOne({ id });
    if (existingUser) {
      return res.status(400).json({ error: 'ID가 이미 사용 중입니다.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10); // 비밀번호 해싱
    const newUser = new User({ id, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: '회원가입 성공' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '회원가입 중 오류가 발생했습니다.' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { id, password } = req.body;

    // 사용자 찾기
    const user = await User.findOne({ id });
    if (!user) return res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });

    // 비밀번호 비교
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(400).json({ error: '비밀번호가 잘못되었습니다.' });

    // JWT 토큰 발급
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined');
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({ token, user: { id: user._id } });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: '로그인 중 오류가 발생했습니다.' });
  }
});



let rooms = [];
let userRoomMap = {};
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

  // 실시간 채팅
  socket.on("send_message", ({ roomName, message, sender }) => {
    if (roomName && message) {
      const timestamp = new Date().toISOString();
      io.to(roomName).emit("receive_message", {
        sender,
        message,
        timestamp,
      });
    }
  });

  // 클라이언트가 Offer를 보냄
  socket.on("send_offer", ({ roomName, offer, sender }) => {
    io.to(roomName).emit("receive_offer", { offer, sender });
  });

  // 클라이언트가 Answer를 보냄
  socket.on("send_answer", ({ roomName, answer, sender }) => {
    io.to(roomName).emit("receive_answer", { answer, sender });
  });

  // 클라이언트가 ICE candidate를 보냄
  socket.on("send_ice_candidate", ({ roomName, candidate, sender }) => {
    io.to(roomName).emit("receive_ice_candidate", { candidate, sender });
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
    }
    delete userRoomMap[socket.id];
    console.log(`Disconnected: ${socket.id}`);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});



