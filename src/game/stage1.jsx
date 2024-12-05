import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Stage1 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { stageIndex } = location.state;

  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [draggingCard, setDraggingCard] = useState(null); // 드래그 중인 카드 ID
  const [offset, setOffset] = useState({ x: 0, y: 0 }); // 드래그 시작 위치와 마우스 간 거리
  const [hint, setHint] = useState('');
  const [hint1Used, setHint1Used] = useState(false);
  const [hint2Used, setHint2Used] = useState(false);

  const cardData = [
    { id: 1, text: 'ㅅ', width: 100, height: 100, left: 100, top: 100 },
    { id: 2, text: 'ㅗ', width: 100, height: 100, left: 300, top: 100 },
    { id: 3, text: 'ㄹ', width: 100, height: 100, left: 500, top: 100 },
    { id: 4, text: 'ㅣ', width: 100, height: 100, left: 700, top: 100 },
    { id: 5, text: 'ㄱ', width: 100, height: 100, left: 900, top: 100 },
    { id: 6, text: 'ㅡ', width: 100, height: 100, left: 1100, top: 100 },
    { id: 7, text: 'ㄹ', width: 100, height: 100, left: 1300, top: 100 },
    { id: 8, text: 'ㅈ', width: 100, height: 100, left: 1500, top: 100 },
    { id: 9, text: 'ㅏ', width: 100, height: 100, left: 1700, top: 100 },
  ];

  const [cards, setCards] = useState(cardData);

  useEffect(() => {
    handleReset();
  }, []);

  const handleReset = () => {
    setCards(
      cards.map((card) => {
        const randomX = Math.random() * (1500 - card.width);
        const randomY = Math.random() * (800 - card.height);

        return { ...card, left: randomX, top: randomY };
      })
    );
    setAnswer('');
    setFeedback('');
    setHint('');
    setHint1Used(false);
    setHint2Used(false);
  };

  const handleSubmit = () => {
    const correctAnswer = '소리글자';
    if (answer === correctAnswer) {
      setFeedback('정답입니다! 🎉');
      setTimeout(() => {
        navigate('/map', { state: { startIndex: 0, solved: true } });
      }, 1000);
    } else {
      setFeedback('틀렸습니다. 다시 시도하세요.');
    }
  };

  const handleHint = (hintNumber) => {
    if (hintNumber === 1) {
      setHint('음성에 대응하는 문자를 가리키는 말');
      setHint1Used(true);
    } else if (hintNumber === 2) {
      setHint('초성: ㅅㄹㄱㅈ');
      setHint2Used(true);
    } else if (hintNumber === 3) {
      setHint('소리글자');
    }
  };

  const handleCloseHint = () => {
    setHint('');
  };

  const handleGoBack = () => {
    navigate('/map');
  };

  // 드래그 시작
  const handleMouseDown = (e, cardId) => {
    const card = cards.find((c) => c.id === cardId);
    if (card) {
      setDraggingCard(cardId);
      setOffset({ x: e.clientX - card.left, y: e.clientY - card.top });
    }
  };

  // 드래그 중
  const handleMouseMove = (e) => {
    if (draggingCard) {
      setCards((prevCards) =>
        prevCards.map((card) =>
          card.id === draggingCard
            ? {
                ...card,
                left: Math.min(
                  Math.max(0, e.clientX - offset.x), // x 경계
                  1500 - card.width // 최대 x
                ),
                top: Math.min(
                  Math.max(0, e.clientY - offset.y), // y 경계
                  800 - card.height // 최대 y
                ),
              }
            : card
        )
      );
    }
  };

  // 드래그 종료
  const handleMouseUp = () => {
    setDraggingCard(null);
  };

  return (
    <div 
      className="stage-container"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <header>
        <h1>훈민정음 맞추기 게임</h1>
        <p>전통 문화를 느끼며 단어를 맞춰보세요!</p>
      </header>
      <div
        className="drop-area"
        style={{
          position: 'relative',
          width: '1500px',
          height: '800px',
          border: '2px dashed #000',
          backgroundImage: 'url(/images/stage1.png)',
          backgroundSize: 'cover', // 이미지를 영역에 맞게 조정
          backgroundPosition: 'center', // 이미지를 중앙에 배치
        }}
      >
        {cards.map((card) => (
          <div
            key={card.id}
            className="card"
            style={{
              position: 'absolute',
              left: `${card.left}px`,
              top: `${card.top}px`,
              width: `${card.width}px`,
              height: `${card.height}px`,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#ffe9b9c5',
              borderRadius: '20px',
              cursor: 'pointer',
              fontSize: '24px',
              fontWeight: 'bold',
            }}
            onMouseDown={(e) => handleMouseDown(e, card.id)}
          >
            {card.text}
          </div>
        ))}
      </div>

      <div className="controls">
        <input
          type="text"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="정답을 입력하세요"
        />
        <button onClick={handleSubmit}>제출</button>
        <button onClick={handleReset}>리셋</button>
        <button onClick={handleGoBack}>돌아가기</button>
        <button onClick={() => handleHint(1)}>힌트1</button>
        <button
          onClick={() => handleHint(2)}
          disabled={!hint1Used}
          style={{
            backgroundColor: hint1Used ? '#007bff' : '#ccc',
            cursor: hint1Used ? 'pointer' : 'not-allowed',
          }}
        >
          힌트2
        </button>
        <button
          onClick={() => handleHint(3)}
          disabled={!hint2Used}
          style={{
            backgroundColor: hint2Used ? '#28a745' : '#ccc',
            cursor: hint2Used ? 'pointer' : 'not-allowed',
          }}
        >
          정답
        </button>
        {feedback && <p>{feedback}</p>}
      </div>

      {hint && (
        <div
          className="hint-modal"
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '400px',
            backgroundColor: 'white',
            padding: '20px',
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
            borderRadius: '8px',
            zIndex: 1000,
          }}
        >
          <p>{hint}</p>
          <button
            onClick={handleCloseHint}
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              background: 'transparent',
              border: 'none',
              fontSize: '18px',
              cursor: 'pointer',
            }}
          >
            ❌
          </button>
        </div>
      )}
    </div>
  );
};

export default Stage1;
