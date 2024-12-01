import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Room from "./pages/Room";
import RoomPage from "./pages/RoomPage";

const App = ({ socket }) => (
  <Router>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/room" element={<Room socket={socket} />} />
      <Route path="/room/:roomName" element={<RoomPage socket={socket} />} />
    </Routes>
  </Router>
);

export default App;
