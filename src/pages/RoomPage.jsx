import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import gameruleImage from "../assets/images/gamerule.png";

const RoomPage = ({ socket }) => {
  const { roomName } = useParams();
  const [room, setRoom] = useState(null);
  const [messages, setMessages] = useState([]); // 채팅 메시지 상태
  const [currentMessage, setCurrentMessage] = useState(""); // 입력 중인 메시지
  const [peerConnections, setPeerConnections] = useState([]); // 상대방 피어 연결
  const [localStream, setLocalStream] = useState(null); // 로컬 스트림
  const navigate = useNavigate();

  useEffect(() => {
    // 1. 방에 입장 시, 음성 연결을 위한 로컬 스트림을 가져옴
    const getLocalStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setLocalStream(stream);
        // 로컬 스트림을 연결된 사용자에게 전송할 수 있도록 할 예정
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

    // 채팅 메시지 수신
    socket.on("receive_message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // 2. 다른 사용자가 들어오면 음성 연결 설정
    socket.on("user_joined", (userId) => {
      console.log("User joined:", userId);
      createPeerConnection(userId);
    });

    socket.on("receive_offer", async (offer, userId) => {
      const peerConnection = createPeerConnection(userId);
      await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);
      socket.emit("send_answer", answer, userId);
    });

    socket.on("receive_answer", (answer, userId) => {
      const peerConnection = peerConnections[userId];
      peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
    });

    socket.on("receive_ice_candidate", (candidate, userId) => {
      const peerConnection = peerConnections[userId];
      peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    });

    return () => {
      socket.off("room_list");
      socket.off("room_update");
      socket.off("receive_message");
      socket.off("user_joined");
      socket.off("receive_offer");
      socket.off("receive_answer");
      socket.off("receive_ice_candidate");
    };
  }, [roomName, socket, peerConnections]);

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
    navigate("/map", { state: { roomName } }); // 방 이름을 Map 페이지로 넘겨줌
  };

  const isGameStartEnabled = room && room.players.length === 2;

  const handleSendMessage = () => {
    if (currentMessage.trim() !== "") {
      socket.emit("send_message", {
        roomName,
        message: currentMessage,
        sender: socket.id, // 메시지 작성자 정보
      });
      setCurrentMessage(""); // 메시지 입력 필드 초기화
    }
  };

  const createPeerConnection = (userId) => {
    const peerConnection = new RTCPeerConnection();
    peerConnection.addEventListener("icecandidate", (event) => {
      if (event.candidate) {
        socket.emit("send_ice_candidate", event.candidate, userId);
      }
    });

    peerConnection.addEventListener("track", (event) => {
      const remoteAudio = document.createElement("audio");
      remoteAudio.srcObject = event.streams[0];
      remoteAudio.play();
    });

    if (localStream) {
      localStream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, localStream);
      });
    }

    setPeerConnections((prev) => ({ ...prev, [userId]: peerConnection }));
    return peerConnection;
  };

  const startCall = (userId) => {
    const peerConnection = createPeerConnection(userId);
    peerConnection.createOffer().then(async (offer) => {
      await peerConnection.setLocalDescription(offer);
      socket.emit("send_offer", offer, userId);
    });
  };

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
        {/* 채팅 UI 추가 */}
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
      flex: 0.8,  // flex 비율을 줄여서 input이 차지하는 공간을 줄임
      padding: "5px",  // padding을 약간 늘려서 텍스트가 더 잘 보이도록 함
      border: "1px solid #ccc",
      borderRadius: "5px",
      marginRight: "5px", // button과의 간격을 위한 margin
      fontSize: "14px",  // 기본 텍스트 크기 조정
    }}
  />
  <button
    onClick={handleSendMessage}
    style={{
      padding: "5px 10px",  // 버튼의 패딩을 줄여서 더 작은 버튼으로 만듬
      backgroundColor: "#4CAF50",
      color: "#ffffff",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
    }}
  >
    Send
  </button>

  <style jsx>{`
    input::placeholder {
      font-size: 13px;  // placeholder 글꼴 크기 조정
      color: #888;  // placeholder 글씨 색상 조정
    }
  `}</style>
</div>
        </div>
      </div>
    </div>
  );
};

export default RoomPage;
