import React, { useState, useEffect } from 'react';

const Stage1 = ({ onClose }) => {
  // State for answer and feedback
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState('');

  // Card data for drag and drop
  const cardData = [
    { id: 1, text: 'ㅅ', width: 100, height: 100 },
    { id: 2, text: 'ㅗ', width: 100, height: 100 },
    { id: 3, text: 'ㄹ', width: 100, height: 100 },
    { id: 4, text: 'ㅣ', width: 100, height: 100 },
    { id: 5, text: 'ㄱ', width: 100, height: 100 },
    { id: 6, text: 'ㅡ', width: 100, height: 100 },
    { id: 7, text: 'ㄹ', width: 100, height: 100 },
    { id: 8, text: 'ㅈ', width: 100, height: 100 },
    { id: 9, text: 'ㅏ', width: 100, height: 100 },
  ];

  // Initialize card positions randomly
  const [cards, setCards] = useState(
    cardData.map((card) => ({
      ...card,
      left: Math.random() * (800 - card.width),
      top: Math.random() * (400 - card.height),
    }))
  );

  // Reset the cards' positions and answer
  useEffect(() => {
    handleReset();
  }, []);

  const handleReset = () => {
    setCards(
      cards.map((card) => {
        const randomX = Math.random() * (800 - card.width);
        const randomY = Math.random() * (400 - card.height);
        return { ...card, left: randomX, top: randomY };
      })
    );
    setAnswer('');
    setFeedback('');
  };

  const handleDragStart = (e, cardId) => {
    e.dataTransfer.setData('text/plain', cardId);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const cardId = e.dataTransfer.getData('text/plain');
    const cardIndex = cards.findIndex((card) => card.id === Number(cardId));
    const x = e.clientX - e.target.offsetLeft - cards[cardIndex].width / 2;
    const y = e.clientY - e.target.offsetTop - cards[cardIndex].height / 2;

    setCards((prevCards) =>
      prevCards.map((card, index) =>
        index === cardIndex ? { ...card, left: x, top: y } : card
      )
    );
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleSubmit = () => {
    const correctAnswer = '소리글자';
    if (answer === correctAnswer) {
      setFeedback('정답입니다! 🎉');
      setTimeout(() => {
        onClose(); // Navigate back to the dashboard
      }, 1000);
    } else {
      setFeedback('틀렸습니다. 다시 시도하세요.');
    }
  };

  return (
    <div className="stage-container" style={{ padding: '20px' }}>
      <header>
        <h1>훈민정음 맞추기 게임</h1>
        <p>전통 문화를 느끼며 단어를 맞춰보세요!</p>
      </header>

      <div
        className="drop-area"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        style={{
          position: 'relative',
          width: '800px',
          height: '400px',
          border: '2px dashed #000',
          margin: '20px auto',
        }}
      >
        {cards.map((card) => (
          <div
            key={card.id}
            className="card"
            draggable
            onDragStart={(e) => handleDragStart(e, card.id)}
            style={{
              position: 'absolute',
              left: `${card.left}px`,
              top: `${card.top}px`,
              width: `${card.width}px`,
              height: `${card.height}px`,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#bebebe',
              borderRadius: '5px',
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
        <button onClick={onClose} style={{ margin: '5px' }}>
          돌아가기
        </button>
        {feedback && <p>{feedback}</p>}
      </div>
    </div>
  );
};

export default Stage1;
