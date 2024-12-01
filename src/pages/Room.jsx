import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import roomImage from "../assets/images/room.png"; // room.png 경로로 변경

const Container = styled.div`
  display: flex;
  height: 100vh; /* 전체 화면 높이 */
`;

const LeftPanel = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center; /* 수직 중앙 정렬 */
  justify-content: flex-start; /* 위쪽 정렬 */
  width: 50%; /* 왼쪽 패널 너비 */
  border-right: 1px solid #ccc; /* 오른쪽 경계선 */
  padding: 10px; /* 패딩 줄임 */
  margin-top: 50px; /* 방 생성 영역 전체 내려주기 */
`;

const RightPanel = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center; /* 수직 중앙 정렬 */
  justify-content: center; /* 수평 중앙 정렬 */
  width: 50%; /* 오른쪽 패널 너비 */
  padding: 10px; /* 패딩 줄임 */
`;

const Title = styled.h1`
  margin-bottom: 15px; /* 제목과 아래 요소 간 간격 */
`;

const Input = styled.input`
  padding: 8px;
  margin-bottom: 10px; /* 입력란과 버튼 간 간격 */
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 200px; /* 입력란 너비 설정 */
`;

const Button = styled.button`
  padding: 8px 16px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 15px; /* 버튼과 위 요소 사이 간격 */
  &:hover {
    background-color: #0056b3;
  }
`;

const List = styled.ul`
  list-style-type: none; /* 기본 리스트 스타일 제거 */
  padding: 0; /* 패딩 제거 */
  margin-top: 15px; /* 리스트와 위 요소 간 간격 */
  width: 100%; /* 리스트 너비 설정 */
  text-align: center; /* 리스트 항목 가운데 정렬 */
`;

const Image = styled.img`
  width: 60%; /* 이미지 너비 설정 (60%로 조정) */
  margin-top: 30px; /* 이미지와 위 요소 간 간격 */
`;

const SpeechBubble = styled.div`
  position: relative;
  background-color: #f1f1f1;
  border: 2px solid #007bff;
  padding: 8px 18px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  font-size: 1rem;
  font-weight: bold;
  color: #007bff;
  z-index: 10; /* 말풍선이 다른 요소 위에 나타나도록 설정 */
  margin-top: 10px; /* 말풍선과 위 요소 간 간격 */
`;

const LeftSection = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-grow: 0; /* 자동 크기 조절을 하지 않음 */
  margin-bottom: 30px; /* 각 구역 사이에 30px 간격 추가 */
`;

const MiddleSection = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 0; /* 자동 크기 조절을 하지 않음 */
  margin-bottom: 30px; /* 각 구역 사이에 30px 간격 추가 */
`;

const BottomSection = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-grow: 1; /* 나머지 공간을 채움 */
`;

const Room = ({ socket }) => {
  const [rooms, setRooms] = useState([]);
  const [roomName, setRoomName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const updateRooms = (updatedRooms) => setRooms(updatedRooms);

    socket.on("room_list", updateRooms);
    socket.emit("room_list");

    return () => socket.off("room_list", updateRooms);
  }, [socket]);

  const handleCreateRoom = () => {
    if (!roomName.trim()) {
      alert("Room name cannot be empty!");
      return;
    }
    socket.emit("room_new", { name: roomName }, (response) => {
      if (response.success) {
        navigate(`/room/${roomName}`);
      } else {
        alert(response.message || "Failed to create room.");
      }
    });
    setRoomName(""); // 입력 필드 초기화
  };

  const handleEnterRoom = (roomName) => {
    socket.emit("room_enter", { roomName }, (response) => {
      if (response.success) {
        navigate(`/room/${roomName}`);
      } else {
        alert(response.message || "Failed to enter room.");
      }
    });
  };

  return (
    <Container>
      <LeftPanel>
        {/* 방 생성 섹션 */}
        <LeftSection>
          <div>
            <Title>방 생성</Title>
            <Input
              type="text"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              placeholder="방 이름 입력"
            />
            <Button onClick={handleCreateRoom}>방 생성</Button>
          </div>
        </LeftSection>

        {/* 말풍선 섹션 */}
        <MiddleSection>
          <SpeechBubble>들어오너라~</SpeechBubble>
        </MiddleSection>

        {/* 이미지 섹션 */}
        <BottomSection>
          <Image src={roomImage} alt="방 생성 이미지" /> {/* room.png 이미지 사용 */}
        </BottomSection>
      </LeftPanel>

      <RightPanel>
        <Title>방 목록</Title>
        {rooms.length === 0 ? (
          <p>현재 참여가능한 방이 없습니다! 새로 생성하세요!</p>
        ) : (
          <List>
            {rooms.map((room, index) => (
              <li key={index}>
                <span>
                  <strong>{room.name}</strong> ({room.players.length}/2)
                </span>
                <button
                  onClick={() => handleEnterRoom(room.name)}
                  disabled={room.players.length >= 2}
                >
                  {room.players.length >= 2 ? "만원" : "참가"}
                </button>
              </li>
            ))}
          </List>
        )}
      </RightPanel>
    </Container>
  );
};

export default Room;
