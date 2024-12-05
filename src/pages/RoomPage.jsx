import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import gameruleImage from "../assets/images/gamerule.png";
import ImageSlider from "../imageslider"; // Import your image slider component

const RoomPage = ({ socket }) => {
  const { roomName } = useParams();
  const [room, setRoom] = useState(null);
  const [messages, setMessages] = useState([]); // Chat messages
  const [currentMessage, setCurrentMessage] = useState(""); // Message input
  const [peerConnections, setPeerConnections] = useState([]);
  const [localStream, setLocalStream] = useState(null);
  const [isGameStarted, setIsGameStarted] = useState(false); // Track game start
  const navigate = useNavigate();

  useEffect(() => {
    const getLocalStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setLocalStream(stream);
      } catch (err) {
        console.error("Error accessing media devices.", err);
      }
    };

    getLocalStream();

    socket.emit("room_list");
    socket.on("room_list", (rooms) => {
      const currentRoom = rooms.find((r) => r.name === roomName);
      if (currentRoom) setRoom(currentRoom);
    });

    socket.on("room_update", (updatedRoom) => {
      if (updatedRoom.name === roomName) setRoom(updatedRoom);
    });

    socket.on("receive_message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off("room_list");
      socket.off("room_update");
      socket.off("receive_message");
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
    setIsGameStarted(true); // Trigger the map slider
  };

  const handleSendMessage = () => {
    if (currentMessage.trim() !== "") {
      socket.emit("send_message", {
        roomName,
        message: currentMessage,
        sender: socket.id,
      });
      setCurrentMessage("");
    }
  };

  const isGameStartEnabled = room && room.players.length === 2;

  if (!room) return <div>Loading...</div>;

  return (
    <div style={{ display: "flex", height: "100vh", width: "100vw" }}>
      <div
        style={{
          flex: 5,
          padding: "20px",
          backgroundColor: "#dcdcdc",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {!isGameStarted ? (
          <img
            src={gameruleImage}
            alt="Game Rules"
            style={{
              maxWidth: "85%",
              maxHeight: "85%",
              objectFit: "contain",
            }}
          />
        ) : (
          <ImageSlider /> // Replace this with your actual map slider component
        )}
      </div>
      <div style={{ flex: 1, padding: "10px", backgroundColor: "#ffffff" }}>
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
              padding: "10px 10px",
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
              padding: "10px 10px",
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
        <div style={{ marginTop: "20px" }}>
          <h2>Chat</h2>
          <div
            style={{
              height: "200px",
              overflowY: "scroll",
              border: "1px solid #ccc",
              padding: "10px",
              borderRadius: "5px",
              backgroundColor: "#f9f9f9",
            }}
          >
            {messages.map((msg, index) => (
              <div key={index} style={{ fontSize: "13px" }}>
                <strong>{msg.sender}:</strong> {msg.message}
              </div>
            ))}
          </div>
          <div style={{ marginTop: "10px", display: "flex" }}>
            <input
              type="text"
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              placeholder="Type your message..."
              style={{
                flex: 0.8,
                padding: "5px",
                border: "1px solid #ccc",
                borderRadius: "5px",
                marginRight: "5px",
                fontSize: "14px",
              }}
            />
            <button
              onClick={handleSendMessage}
              style={{
                padding: "5px 10px",
                backgroundColor: "#4CAF50",
                color: "#ffffff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomPage;
