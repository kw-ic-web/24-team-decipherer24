import React from "react";

const RoomList = ({ roomList, onEnterRoom }) => {
  return (
    <div>
      <h2>Available Rooms</h2>
      {roomList.length === 0 ? (
        <p>No rooms available. Create one!</p>
      ) : (
        <ul>
          {roomList.map((room, index) => (
            <li key={index}>
              {room}{" "}
              <button onClick={() => onEnterRoom(room)}>Enter</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RoomList;
