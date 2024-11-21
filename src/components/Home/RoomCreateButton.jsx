import React from "react";

const RoomCreateButton = ({ onNewRoom }) => {
  const handleNewRoom = (event) => {
    event.preventDefault();
    const name = event.target.roomname.value.trim();
    event.target.roomname.value = "";
    if (name.length > 0) onNewRoom(name);
  };

  return (
    <form onSubmit={handleNewRoom}>
      <input type="text" name="roomname" placeholder="방 이름을 입력하세요" />
      <button type="submit">방 만들기</button>
    </form>
  );
};

export default RoomCreateButton;
