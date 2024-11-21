import React, { useState, useEffect } from 'react';

const Stage1 = () => {
  // 카드 데이터 정의
  const cardData = [
    { id: 1, text: 'ㅅ', width: 100, height: 100 },
    { id: 2, text: 'ㅗ', width: 100, height: 100 },
    { id: 3, text: 'ㄹ', width: 100, height: 100 },
    { id: 4, text: 'ㅣ', width: 100, height: 100 },
    { id: 5, text: 'ㄱ', width: 100, height: 100 },
    { id: 6, text: 'ㅡ', width: 100, height: 100 },
    { id: 7, text: 'ㄹ', width: 100, height: 100 },
    { id: 8, text: 'ㅈ', width: 100, height: 100 },
    { id: 9, text: 'ㅏ', width: 100, height: 100 }
  ];

  // 상태 정의
  const [cards, setCards] = useState(cardData);
  const [message, setMessage] = useState('여기에 단어를 조합하세요');
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState('');

  // 카드 위치 초기화 함수
  const handleReset = () => {
    // 카드 위치 초기화
    setCards(
      cards.map(card => {
        const randomX = Math.random() * (1500 - card.width); // 박스 안에서 랜덤 위치
        const randomY = Math.random() * (800 - card.height);

        return { ...card, left: randomX, top: randomY };
      })
    );
    setMessage('여기에 단어를 조합하세요');
    setAnswer('');
    setFeedback('');
  };

  // 컴포넌트가 마운트될 때 handleReset 실행
  useEffect(() => {
    handleReset();
  }, []); // 빈 배열을 넣으면 마운트될 때 한 번만 실행됩니다.

  const handleDragStart = (e, id) => {
    e.dataTransfer.setData('text', id);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const cardId = e.dataTransfer.getData('text');
    const card = document.getElementById(cardId);

    const dropArea = e.target.getBoundingClientRect();
    const x = e.nativeEvent.offsetX - card.offsetWidth / 2;
    const y = e.nativeEvent.offsetY - card.offsetHeight / 2;

    // 드롭된 카드가 박스를 벗어나지 않도록 제한
    const maxX = dropArea.width - card.offsetWidth;
    const maxY = dropArea.height - card.offsetHeight;

    card.style.left = `${Math.min(Math.max(x, 0), maxX)}px`;
    card.style.top = `${Math.min(Math.max(y, 0), maxY)}px`;

    // 드롭 후 메시지 제거
    setMessage('');
  };

  const handleSubmit = () => {
    const correctAnswer = '소리글자';
    if (answer === correctAnswer) {
      setFeedback('정답입니다! 🎉');
    } else {
      setFeedback('틀렸습니다. 다시 시도하세요.');
    }
  };

  return (
    <div className="stage-container">
      <header>
        <h1>훈민정음 맞추기 게임</h1>
        <p>전통 문화를 느끼며 단어를 맞춰보세요!</p>
      </header>
      <div
        id="drop-area"
        className="drop-area"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        style={{ position: 'relative', width: '1500px', height: '800px', border: '2px dashed #000' }}
      >
        <p>{message}</p>
        {cards.map((card) => (
          <div
            key={card.id}
            className="card"
            id={card.id}
            draggable="true"
            onDragStart={(e) => handleDragStart(e, card.id)}
            style={{
              position: 'absolute',
              left: `${card.left || Math.random() * (500 - card.width)}px`,
              top: `${card.top || Math.random() * (300 - card.height)}px`,
              width: `${card.width}px`,
              height: `${card.height}px`,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              color: 'black',
              fontSize: '50px',
              fontWeight: 'bold',
              textShadow: '1px 1px 3px rgba(0, 0, 0, 0.6)',
              backgroundColor: '#bebebe',
              borderRadius: '5px',
              cursor: 'pointer',
              textAlign: 'center'
            }}
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
        {feedback && <p style={{ color: feedback.includes('정답') ? 'green' : 'red' }}>{feedback}</p>}
      </div>

      <style>
        {`
          .stage-container {
            display: flex;
            flex-direction: column;
            align-items: center;
          }

          .card {
            cursor: pointer;
            border-radius: 5px;
            background-color: #f0f0f0;
            text-align: center;
            display: flex;
            justify-content: center;
            align-items: center;
          }

          .controls {
            margin-top: 20px;
          }

          button {
            margin: 10px;
            padding: 10px 20px;
            cursor: pointer;
          }

          input {
            padding: 5px;
            margin-bottom: 10px;
          }

          .drop-area {
            width: 100%;
            height: 100%;
            position: relative;
            border: 2px dashed #000;
          }
        `}
      </style>
    </div>
  );
};

export default Stage1;
