import React, { useState, useEffect } from "react";
import RoomCreateButton from "./RoomCreateButton";
import RoomList from "./RoomList";
import io from "socket.io-client";

  const socket = io("http://localhost:5000", {
    transports: ["websocket", "polling"], // WebSocket을 우선 사용
    withCredentials: true, // 인증 정보 포함
  });

const Room = () => {
  const [roomList, setRoomList] = useState([]);

  useEffect(() => {
    socket.on("room_list", (list) => setRoomList(list));
    socket.emit("room_list");

    return () => {
      socket.off("room_list");
    };
  }, []);

  const handleNewRoom = (name) => {
    // 방 생성 요청
    socket.emit("room_new", name, (response) => {
      if (response.success) {
        // 방 생성 성공 시 해당 방에 입장
        handleEnterRoom(name);
      } else {
        alert(response.message); // 에러 메시지 표시
      }
    });
  };
  
  const handleEnterRoom = (roomName) => {
    socket.emit("room_enter", roomName, (response) => {
      if (response.success) {
        console.log(`Entered room: ${roomName}`);
        // 추가적인 방 입장 처리 로직
      } else {
        alert(response.message);
      }
    });
  };

  return (
    <div>
      <RoomCreateButton onNewRoom={handleNewRoom} />
      <RoomList roomList={roomList} onEnterRoom={handleEnterRoom} />
    </div>
  );
};

export default Room;
