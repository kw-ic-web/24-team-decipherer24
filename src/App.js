import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { StageProvider } from "./StageContext"; // StageProvider 추가
import Login from "./pages/Login";
import Register from "./pages/Register";
import Room from "./pages/Room";
import RoomPage from "./pages/RoomPage";
import ImageSlider from "./imageslider"; // `/map` 경로에 연결될 컴포넌트
import Stage1 from "./game/stage1"; // 스테이지 1 컴포넌트
import Stage2 from "./game/stage2"; // 스테이지 2 컴포넌트
import Stage3 from "./game/stage3"; // 스테이지 3 컴포넌트

const App = ({ socket }) => {
  return (
    <StageProvider>
      <Router>
        <Routes>
          {/* 사용자 인증 관련 라우트 */}
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* 채팅 및 비디오 관련 라우트 */}
          <Route path="/room" element={<Room socket={socket} />} />
          <Route path="/room/:roomName" element={<RoomPage socket={socket} />} />

          {/* 게임 관련 라우트 */}
          <Route path="/map" element={<ImageSlider />} /> {/* 경로를 `/map`으로 설정 */}
          <Route path="/game/stage1" element={<Stage1 />} />
          <Route path="/game/stage2" element={<Stage2 />} />
          <Route path="/game/stage3" element={<Stage3 />} />
        </Routes>
      </Router>
    </StageProvider>
  );
};

export default App;
