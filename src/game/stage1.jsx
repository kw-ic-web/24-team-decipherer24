import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Stage1 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { stageIndex } = location.state; // stageIndex 가져오기

  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState('');

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

  const [cards, setCards] = useState(cardData);

  useEffect(() => {
    handleReset(); // 컴포넌트가 렌더링될 때 카드 초기화
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
  };

  const handleSubmit = () => {
    const correctAnswer = "소리글자";
    if (answer === correctAnswer) {
      setFeedback("정답입니다! 🎉");
      setTimeout(() => {
        navigate("/map", { state: { startIndex: 0, solved: true } }); // stage1 완료 후 map1로
      }, 1000);
    } else {
      setFeedback("틀렸습니다. 다시 시도하세요.");
    }
  };
  
  const handleGoBack = () => {
    navigate("/map"); // `/map`으로 돌아가기
  };  
    
  return (
    <div className="stage-container">
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
              backgroundColor: '#bebebe',
              borderRadius: '5px',
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
        <button onClick={handleGoBack}>돌아가기</button> {/* 돌아가기 버튼 추가 */}
        {feedback && <p>{feedback}</p>}
      </div>
    </div>
  );
};

export default Stage1;
