import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useStage } from './StageContext';

import map1 from './assets/images/map1.webp';
import map2 from './assets/images/map4.webp';
import map3 from './assets/images/map5.webp';

import image1 from './assets/images/stage4/백.png';
import image2 from './assets/images/stage4/성.png';
import image3 from './assets/images/stage4/을.png';
import image4 from './assets/images/stage4/가.png';
import image5 from './assets/images/stage4/르.png';
import image6 from './assets/images/stage4/치.png';
import image7 from './assets/images/stage4/는.png';
import image8 from './assets/images/stage4/바.png';
import image9 from './assets/images/stage4/른.png';
import image10 from './assets/images/stage4/소.png';
import image11 from './assets/images/stage4/리.png';

const images = [map1, map2, map3];

const centerCoords = [
  [730, 400, 830, 500], // Center coordinates for map1
  [730, 400, 830, 500], // Center coordinates for map2
  [730, 400, 830, 500], // Center coordinates for map3
];

const cards = [
  [
    { id: 1, label: '백', image: image1 },
    { id: 2, label: '성', image: image2 },
    { id: 3, label: '을', image: image3 },
  ],
  [
    { id: 4, label: '가', image: image4 },
    { id: 5, label: '르', image: image5 },
    { id: 6, label: '치', image: image6 },
    { id: 7, label: '는', image: image7 },
  ],
  [
    { id: 8, label: '바', image: image8 },
    { id: 9, label: '른', image: image9 },
    { id: 10, label: '소', image: image10 },
    { id: 11, label: '리', image: image11 },
  ],
];

const mapCoords = [
  ['500,750,600,850', '420,420,520,520', '1020,700,1120,800'],
  ['720,600,820,700', '320,420,420,520', '1050,500,1150,600', '520,700,620,800'],
  ['560,500,660,600', '730,100,830,200', '1050,550,1150,650', '650,730,750,830'],
];

const ImageSlider = () => {
  const { stageCompleted, setStageCompleted } = useStage(); // Context 사용
  const navigate = useNavigate();
  const location = useLocation();

  const [currentIndex, setCurrentIndex] = useState(location.state?.startIndex || 0);
  const [collectedCards, setCollectedCards] = useState([]);
  const [showDashboard, setShowDashboard] = useState(false);
  const [cardPositions, setCardPositions] = useState({});
  const [inputValue, setInputValue] = useState('');
  const [hintIndex, setHintIndex] = useState(0);
  const [hintMessage, setHintMessage] = useState('');
  const [isSolved, setIsSolved] = useState(false);

  useEffect(() => {
    if (location.state?.solved) {
      const { stageIndex } = location.state;
      markStageComplete(stageIndex);
    }
  }, [location.state]);

  const markStageComplete = (index) => {
    setStageCompleted((prev) => {
      const updated = [...prev];
      updated[index] = true;
      return updated;
    });
  };

  const nextImage = () => {
    if (currentIndex < 2) {
      if (stageCompleted[currentIndex] || (currentIndex === 2 && location.state?.solved)) {
        setCurrentIndex((prevIndex) => prevIndex + 1);
      } else {
        alert('현재 스테이지를 완료해야 다음으로 이동할 수 있습니다.');
      }
    }
  };

  const prevImage = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prevIndex) => prevIndex - 1);
    }
  };

  const handleCenterClick = (e) => {
    const [x1, y1, x2, y2] = centerCoords[currentIndex];
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left; // x-coordinate relative to the image
    const y = e.clientY - rect.top; // y-coordinate relative to the image

    // Check if the click falls within the center area
    if (x >= x1 && x <= x2 && y >= y1 && y <= y2) {
      if (currentIndex === 0) {
        navigate('/game/stage1', { state: { stageIndex: 0 } });
      } else if (currentIndex === 1) {
        navigate('/game/stage2', { state: { stageIndex: 1 } });
      } else if (currentIndex === 2) {
        navigate('/game/stage3', { state: { stageIndex: 2 } });
      }
    }
  };

  const handleAreaClick = (cardIndex) => {
    const card = cards[currentIndex][cardIndex];
    if (!collectedCards.some((c) => c.id === card.id)) {
      setCollectedCards((prev) => [...prev, card]);
    }
  };

  const toggleDashboard = () => {
    setShowDashboard(!showDashboard);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const checkAnswer = () => {
    const answer = '백성을 가르치는 바른 소리';
    if (inputValue === answer) {
      setIsSolved(true);
      setShowDashboard(false);
    } else {
      alert('틀렸습니다.');
      setInputValue('');
    }
  };

  const provideHint = () => {
    const hints = ['훈민정음의 뜻풀이', 'ㅂㅅㅇ ㄱㄹㅊㄴ ㅂㄹ ㅅㄹ'];
    setHintMessage(hints[hintIndex] || '');
    setHintIndex((hintIndex + 1) % hints.length);
  };

  const handleDragStart = (e, cardId) => {
    e.dataTransfer.setData('cardId', cardId);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const cardId = e.dataTransfer.getData('cardId');
    const dashboardRect = document.getElementById('dashboard').getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - dashboardRect.left - 60, dashboardRect.width - 120));
    const y = Math.max(0, Math.min(e.clientY - dashboardRect.top - 120, dashboardRect.height - 400));

    setCardPositions((prev) => ({
      ...prev,
      [cardId]: { left: x, top: y },
    }));
  };

  return (
    <div style={{ position: 'relative', textAlign: 'center' }}>
      <p style={{ margin: '10px 0', fontSize: '1.2em', color: '#555' }}>
        이미지의 중앙을 클릭하면 스테이지 {currentIndex + 1}으로 이동합니다!
      </p>
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <img
          src={images[currentIndex]}
          alt={`Map ${currentIndex + 1}`}
          useMap={`#map-${currentIndex}`}
          style={{ width: '100%', height: 'auto', cursor: 'pointer' }}
          onClick={handleCenterClick}
        />
        <map name={`map-${currentIndex}`}>
          {mapCoords[currentIndex].map((coord, index) => (
            <area
              key={index}
              shape="rect"
              coords={coord}
              alt={`Area ${index + 1}`}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleAreaClick(index);
              }}
            />
          ))}
        </map>
      </div>
      {currentIndex !== 0 && (
        <button
          onClick={prevImage}
          style={{
            position: 'absolute',
            top: '50%',
            left: '10px',
            transform: 'translateY(-50%)',
            cursor: 'pointer',
          }}
        >
          ←
        </button>
      )}
      {currentIndex !== 2 && (
        <button
          onClick={nextImage}
          disabled={!stageCompleted[currentIndex]}
          style={{
            position: 'absolute',
            top: '50%',
            right: '10px',
            transform: 'translateY(-50%)',
            cursor: stageCompleted[currentIndex] ? 'pointer' : 'not-allowed',
          }}
        >
          →
        </button>
      )}
      <button onClick={toggleDashboard} style={{ marginTop: '20px' }}>
        {showDashboard ? '대시보드 닫기' : '대시보드 열기'}
      </button>

      {showDashboard && (
        <div
          id="dashboard"
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'white',
            padding: '20px',
            width: '80%',
            height: '80%',
            overflowY: 'scroll',
            border: '1px solid black',
            borderRadius: '10px',
            zIndex: 1000,
          }}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          <h2>수집된 카드</h2>
          <p>모은 카드 개수: {collectedCards.length} / 11</p>
          <div className="card-container" style={{ position: 'relative', height: '600px' }}>
            {collectedCards.map((card) => (
              <div
                key={card.id}
                id={card.id}
                className="card"
                draggable
                onDragStart={(e) => handleDragStart(e, card.id)}
                style={{
                  position: 'absolute',
                  left: cardPositions[card.id]?.left || 0,
                  top: cardPositions[card.id]?.top || 0,
                  width: '100px',
                  height: '130px',
                  cursor: 'grab',
                }}
              >
                <img
                  src={card.image}
                  alt={card.label}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </div>
            ))}
          </div>
          {collectedCards.length === 11 && (
            <div style={{ marginTop: '20px' }}>
              <button onClick={provideHint}>힌트</button>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                <input
                  type="text"
                  value={inputValue}
                  onChange={handleInputChange}
                  placeholder="정답을 입력하세요"
                  style={{ width: '70%' }}
                />
                <button onClick={checkAnswer}>정답</button>
              </div>
              {hintMessage && <p>힌트: {hintMessage}</p>}
              {isSolved && <p style={{ color: 'green', fontWeight: 'bold' }}>정답입니다! 🎉</p>}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageSlider;
