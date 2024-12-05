import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './stage3.css';

const Stage3 = () => {
  const [answer, setAnswer] = useState('');
  const [message, setMessage] = useState('');
  const [hintVisible, setHintVisible] = useState(false);
  const [hintMessage, setHintMessage] = useState([]);
  const [clickCount, setClickCount] = useState(0);
  const audioRef = useRef(null);
  const [flyingObjectStyle, setFlyingObjectStyle] = useState({});
  const navigate = useNavigate();
  const [isSolved, setIsSolved] = useState(false);

  useEffect(() => {
    const moveObject = () => {
      const randomX = Math.random() * (window.innerWidth - 100);
      const randomY = Math.random() * (window.innerHeight - 100);
      setFlyingObjectStyle({
        position: 'absolute',
        top: `${randomY}px`,
        left: `${randomX}px`,
        transition: 'top 1s linear, left 1s linear',
      });

      setTimeout(moveObject, 3000);
    };

    moveObject();
  }, []);

  const handleInputChange = (e) => {
    setAnswer(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (answer === "아리랑") {
      setMessage("정답입니다!");
      setTimeout(() => navigate("/map", { state: { startIndex: 2, solved: true } }), 1000); // 항상 Map3으로 이동
    } else {
      setMessage("틀렸습니다. 다시 시도해 보세요.");
    }
  };

  const handleBackToMap = () => {
    navigate("/map", { state: { startIndex: 2 } }); // 항상 Map3으로 이동
  };

  const playSound = (soundFile) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    audioRef.current = new Audio(soundFile);
    audioRef.current.play();
  };

  const handleCatchHint = () => {
    setClickCount((prevCount) => prevCount + 1);
    if (clickCount === 0) {
      setHintMessage(['직접 연주해보자!', '1=중 2=임 3=무 4=황 5=태']);
    } else if (clickCount === 1) {
      setHintMessage(['정선 ooo, 밀양 ooo']);
    }
    setHintVisible(true);
  };

  const closeHint = () => {
    setHintVisible(false);
  };

  return (
    <div className="app-container">
      <h1>노래 제목을 맞춰라!</h1>
      <h2>단소 악보를 보고 정답을 입력하세요!</h2>

      <div className="image-container">
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <img src="/images/stage3/dansoo.png" alt="단소" className="image" />
          <div className="button-container">
            <button onClick={() => playSound('/sounds/중.m4a')}>1</button>
            <button onClick={() => playSound('/sounds/임.m4a')}>2</button>
            <button onClick={() => playSound('/sounds/무.m4a')}>3</button>
            <button onClick={() => playSound('/sounds/황.m4a')}>4</button>
            <button onClick={() => playSound('/sounds/태.m4a')}>5</button>
          </div>
        </div>
        <img src="/images/stage3/ak.png" alt="단소 악보" className="image" />
      </div>

      <div
        className="flying-object"
        style={flyingObjectStyle}
        onClick={handleCatchHint}
      >
        <span role="img" aria-label="돋보기" style={{ fontSize: '80px' }}>
          🔍
        </span>
      </div>

      {hintVisible && (
        <div className="hint-popup">
          {hintMessage.map((text, index) => (
            <p key={index}>{text}</p>
          ))}
          <button onClick={closeHint}>닫기</button>
        </div>
      )}

      {/* Form Section */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={answer}
          onChange={handleInputChange}
          placeholder="정답을 입력하세요"
          required
        />
        <button type="submit">확인</button>
      </form>

      {message && <h3>{message}</h3>}

      {/* Back Button Positioned Below */}
      <div className="back-button-container">
        <button className="stage3btn" onClick={handleBackToMap}>돌아가기</button>
      </div>

      <div className="bubble-container">
        <img
          src="/images/stage3/king.jpg"
          alt="세종대왕"
          style={{ width: '100px', height: 'auto' }}
        />
        <div className="bubble">
          <p>풍악을 울려라</p>
        </div>
      </div>
    </div>
  );
};

export default Stage3;
