// Stage1Game.js
import React from 'react';

const Stage1Game = ({ onClose }) => {
  const handleComplete = () => {
    alert('Stage1 게임 완료!');
    onClose();
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>Stage1 게임</h2>
      <p>여기에 Stage1 게임 내용이 들어갑니다.</p>
      <button onClick={handleComplete}>게임 완료</button>
    </div>
  );
};

export default Stage1Game;
