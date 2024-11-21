// App.js (React 클라이언트 코드)
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Home from './pages/Home.jsx';
import GamePage from './pages/GamePage.jsx'; // 'Room'을 'GamePage'로 변경

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/room" element={<GamePage />} /> {/* Room -> GamePage */}
      </Routes>
    </Router>
  );
};

export default App;
