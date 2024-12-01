import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import gameruleImage from "../assets/images/gamerule.png";

const RoomPage = ({ socket }) => {
  const { roomName } = useParams();
  const [room, setRoom] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    socket.emit("room_list");
    socket.on("room_list", (rooms) => {
      const currentRoom = rooms.find((r) => r.name === roomName);
      if (currentRoom) setRoom(currentRoom);
    });

    socket.on("room_update", (updatedRoom) => {
      if (updatedRoom.name === roomName) setRoom(updatedRoom);
    });

    return () => {
      socket.off("room_list");
      socket.off("room_update");
    };
  }, [roomName, socket]);

  const handleLeaveRoom = () => {
    socket.emit("room_leave", (response) => {
      if (response.success) {
        navigate("/room");
      } else {
        alert(response.message || "Failed to leave room.");
      }
    });
  };

  const handleStartGame = () => {
    navigate("/map", { state: { startIndex: 0 } }); // `/map` 경로로 변경
  };

  const isGameStartEnabled = room && room.players.length === 2;

  if (!room) return <div>Loading...</div>;

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <div
        style={{
          flex: 1,
          padding: "20px",
          backgroundColor: "#f0f0f0",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <img
          src={gameruleImage}
          alt="Game Rules"
          style={{
            maxWidth: "85%",
            maxHeight: "85%",
            objectFit: "contain",
          }}
        />
      </div>
      <div style={{ flex: 1, padding: "20px", backgroundColor: "#ffffff" }}>
        <h1>Room: {room.name}</h1>
        <h2>Players:</h2>
        <ul>
          {room.players.map((player, index) => (
            <li key={player}>
              Player {index + 1}: {player}
            </li>
          ))}
        </ul>
        <div style={{ marginTop: "20px" }}>
          <button
            onClick={handleLeaveRoom}
            style={{
              padding: "10px 20px",
              marginRight: "10px",
              backgroundColor: "#ff4d4d",
              color: "#ffffff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Leave Room
          </button>
          <button
            onClick={handleStartGame}
            disabled={!isGameStartEnabled}
            style={{
              padding: "10px 20px",
              backgroundColor: isGameStartEnabled ? "#4CAF50" : "#a5a5a5",
              color: "#ffffff",
              border: "none",
              borderRadius: "5px",
              cursor: isGameStartEnabled ? "pointer" : "not-allowed",
            }}
          >
            {isGameStartEnabled ? "Start Game" : "Waiting for Players"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomPage;
