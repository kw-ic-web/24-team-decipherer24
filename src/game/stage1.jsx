import React, { useState, useEffect } from 'react';

const Stage1 = ({ onClose }) => {
  // State for answer, feedback, hints, and drag
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [hint, setHint] = useState('');
  const [hint1Used, setHint1Used] = useState(false);
  const [hint2Used, setHint2Used] = useState(false);
  const [draggingCard, setDraggingCard] = useState(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  // Card data for drag and drop
  const cardData = [
    { id: 1, text: 'ㅅ', width: 80, height: 80 },
    { id: 2, text: 'ㅗ', width: 80, height: 80 },
    { id: 3, text: 'ㄹ', width: 80, height: 80 },
    { id: 4, text: 'ㅣ', width: 80, height: 80 },
    { id: 5, text: 'ㄱ', width: 80, height: 80 },
    { id: 6, text: 'ㅡ', width: 80, height: 80 },
    { id: 7, text: 'ㄹ', width: 80, height: 80 },
    { id: 8, text: 'ㅈ', width: 80, height: 80 },
    { id: 9, text: 'ㅏ',  width: 80, height: 80},
  ];

  // Initialize card positions randomly
  const [cards, setCards] = useState(
    cardData.map((card) => ({
      ...card,
      left: Math.random() * (800 - card.width),
      top: Math.random() * (400 - card.height),
    }))
  );

  useEffect(() => {
    handleReset();
  }, []);

  const handleReset = () => {
    setCards(
      cardData.map((card) => ({
        ...card,
        left: Math.random() * (800 - card.width),
        top: Math.random() * (400 - card.height),
      }))
    );
    setAnswer('');
    setFeedback('');
    setHint('');
    setHint1Used(false);
    setHint2Used(false);
  };

  const handleHint = (hintLevel) => {
    if (hintLevel === 1) {
      setHint('음성에 대응하는 문자를 가리키는 말');
      setHint1Used(true);
    } else if (hintLevel === 2 && hint1Used) {
      setHint('초성: ㅅㄹㄱㅈ');
      setHint2Used(true);
    } else if (hintLevel === 3 && hint2Used) {
      setHint('정답은 "소리글자"입니다.');
    }
  };

  const handleCloseHint = () => {
    setHint('');
  };

  const handleSubmit = () => {
    const correctAnswer = '소리글자';
    if (answer === correctAnswer) {
      setFeedback('정답입니다! 🎉');
      setTimeout(() => {
        onClose();
      }, 1000);
    } else {
      setFeedback('틀렸습니다. 다시 시도하세요.');
    }
  };

  const handleMouseDown = (e, cardId) => {
    const card = cards.find((c) => c.id === cardId);
    if (card) {
      setDraggingCard(cardId);
      setOffset({ x: e.clientX - card.left, y: e.clientY - card.top });
    }
  };

  const handleMouseMove = (e) => {
    if (draggingCard) {
      setCards((prevCards) =>
        prevCards.map((card) =>
          card.id === draggingCard
            ? {
                ...card,
                left: Math.min(
                  Math.max(0, e.clientX - offset.x),
                  1500 - card.width
                ),
                top: Math.min(
                  Math.max(0, e.clientY - offset.y),
                  800 - card.height
                ),
              }
            : card
        )
      );
    }
  };

  const handleMouseUp = () => {
    setDraggingCard(null);
  };

  return (
    <div
      className="stage-container"
      style={{
        padding: '20px',
        userSelect: 'none',
        cursor: draggingCard ? 'grabbing' : 'default',
      }}
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
          width: '1200px',
          height: '480px',
          border: '2px dashed #000',
          margin: '20px auto',
          backgroundImage: 'url(/images/stage1.png)',
          backgroundSize: 'cover', // 이미지를 영역에 맞게 조정
          backgroundPosition: 'center', // 이미지를 중앙에 배치
        }}
      >
        {cards.map((card) => (
          <div
            key={card.id}
            className="card"
            onMouseDown={(e) => handleMouseDown(e, card.id)}
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
          >
            {card.text}
          </div>
        ))}
      </div>

      <div className="controls" style={{ textAlign: 'center' }}>
        <input
          type="text"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="정답을 입력하세요"
          style={{
            display: 'block',
            margin: '10px auto',
            padding: '5px',
            width: '200px',
          }}
        />
        <button onClick={handleSubmit} style={{ margin: '5px' }}>
          제출
        </button>
        <button onClick={handleReset} style={{ margin: '5px' }}>
          리셋
        </button>
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
            height: '50px',
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

