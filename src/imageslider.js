import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useStage } from './StageContext';

import map1 from './assets/images/map1.png';
import map2 from './assets/images/map4.png';
import map3 from './assets/images/map5.png';

import Stage1 from './game/stage1'; // Ensure the path is correct
import Stage2 from './game/stage2'; // Ensure the path is correct
import Stage3 from './game/stage3'; // Ensure the path is correct

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

const cards = [
  { id: 1, image: image1, label: '백', map: 3 },
  { id: 2, image: image2, label: '성', map: 1 },
  { id: 3, image: image3, label: '을', map: 3 },
  { id: 4, image: image4, label: '가', map: 1 },
  { id: 5, image: image5, label: '르', map: 2 },
  { id: 6, image: image6, label: '치', map: 3 },
  { id: 7, image: image7, label: '는', map: 2 },
  { id: 8, image: image8, label: '바', map: 2 },
  { id: 9, image: image9, label: '른', map: 3 },
  { id: 10, image: image10, label: '소', map: 2 },
  { id: 11, image: image11, label: '리', map: 1 },
];

const getCoords = (index) => {
  const coordsArray = [
    '271,644,399,790',
    '504,504,587,598',
    '1412,772,1557,933',
    '1085,831,1191,940',
    '820,553,992,643',
    '831,680,1051,791',
    '595,840,719,946',
    '838,272,953,352',
    '837,159,1088,224',
    '1233,562,1328,714',
    '306,775,463,990',
  ];
  return coordsArray[index];
};

const ImageSlider = () => {
  const { stageCompleted, setStageCompleted } = useStage();
  const navigate = useNavigate();
  const location = useLocation();

  const [currentIndex, setCurrentIndex] = useState(location.state?.startIndex || 0);
  const [collectedCards, setCollectedCards] = useState([]);
  const [showDashboard, setShowDashboard] = useState(false);
  const [cardPositions, setCardPositions] = useState({});
  const [showStage1, setShowStage1] = useState(false);
  const [showStage2, setShowStage2] = useState(false);
  const [showStage3, setShowStage3] = useState(false);

  const hints = ['훈민정음의 뜻풀이', 'ㅂㅅㅇ ㄱㄹㅊㄴ ㅂㄹ ㅅㄹ'];

  const [inputValue, setInputValue] = useState('');
  const [hintMessage, setHintMessage] = useState('');
  const [hintIndex, setHintIndex] = useState(0);

  useEffect(() => {
    if (location.state?.solved) {
      const { startIndex } = location.state;
      markStageComplete(startIndex);
    }
  }, [location.state]);

  const markStageComplete = (index) => {
    setStageCompleted((prev) => {
      const updated = [...prev];
      updated[index] = true;
      return updated;
    });
  };

  const startGame = () => {
    if (currentIndex === 0) {
      setShowStage1(true); // Show Stage1 for map1
    } else if (currentIndex === 1) {
      setShowStage2(true); // Show Stage2 for map2
    } else if (currentIndex === 2) {
      setShowStage3(true); // Show Stage3 for map3
    } else {
      navigate(`/game/stage${currentIndex + 1}`, { state: { stageIndex: currentIndex } });
    }
  };

  const closeStage1 = () => {
    setShowStage1(false);
    setStageCompleted((prev) => {
      const updated = [...prev];
      updated[0] = true; // Mark Stage1 as complete
      return updated;
    });
  };

  const closeStage2 = () => {
    setShowStage2(false);
    setStageCompleted((prev) => {
      const updated = [...prev];
      updated[1] = true; // Mark Stage2 as complete
      return updated;
    });
  };

  const closeStage3 = () => {
    setShowStage3(false);
    setStageCompleted((prev) => {
      const updated = [...prev];
      updated[2] = true; // Mark Stage3 as complete
      return updated;
    });
  };

  const nextImage = () => {
    if (stageCompleted[currentIndex]) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    } else {
      alert('이전 스테이지를 완료해야 합니다.');
    }
  };

  const prevImage = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prevIndex) => prevIndex - 1);
    }
  };

  const handleAreaClick = (index) => {
    const card = cards[index];
    if (card.map === currentIndex + 1 && !collectedCards.some((c) => c.id === card.id)) {
      setCollectedCards((prev) => [...prev, card]);
    }
  };

  const toggleDashboard = () => {
    setShowDashboard(!showDashboard);
  };

  const handleDragStart = (e, cardId) => {
    e.dataTransfer.setData('cardId', cardId);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const cardId = e.dataTransfer.getData('cardId');
    const dashboardRect = document.getElementById('dashboard').getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - dashboardRect.left - 60, dashboardRect.width - 120));
    const y = Math.max(0, Math.min(e.clientY - dashboardRect.top - 60, dashboardRect.height - 120));

    setCardPositions((prev) => ({
      ...prev,
      [cardId]: { left: x, top: y },
    }));
  };

  const checkAnswer = () => {
    const answer = '백성을 가르치는 바른 소리'; // Define the correct answer
    if (inputValue === answer) {
      alert('정답입니다! 🎉');
    } else {
      alert('틀렸습니다.');
    }
  };

  const provideHint = () => {
    setHintMessage(hints[hintIndex]);
    setHintIndex((prev) => (prev + 1) % hints.length);
  };

  return (
    <div style={{ position: 'relative', textAlign: 'center' }}>
      <p style={{ margin: '10px 0', fontSize: '1.2em', color: '#555' }}>
        이미지를 클릭하여 카드를 찾고 문제를 해결하세요.
      </p>
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <img
          src={images[currentIndex]}
          alt={`Map ${currentIndex + 1}`}
          useMap={`#map-${currentIndex}`}
          style={{ width: '100%', cursor: 'pointer' }}
        />
        <map name={`map-${currentIndex}`}>
          {cards.map(
            (card, index) =>
              card.map === currentIndex + 1 && (
                <area
                  key={card.id}
                  shape="rect"
                  coords={getCoords(index)}
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleAreaClick(index);
                  }}
                />
              )
          )}
        </map>
      </div>
      <button onClick={startGame} style={{ marginTop: '10px', marginBottom: '10px' }}>
        미니 게임 시작
      </button>
      {currentIndex > 0 && (
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

      {currentIndex < images.length - 1 && (
        <button
          onClick={nextImage}
          disabled={!stageCompleted[currentIndex]} // 현재 스테이지 완료 상태를 검사
          style={{
            position: 'absolute',
            top: '50%',
            right: '10px',
            transform: 'translateY(-50%)',
            cursor: stageCompleted[currentIndex] ? 'pointer' : 'not-allowed', // 커서 스타일도 조건에 맞게 수정
          }}
        >
          →
        </button>
      )}


      {currentIndex < images.length - 1 && (
        <button
          onClick={nextImage}
          disabled={!stageCompleted[currentIndex]} // 현재 스테이지 완료 상태를 검사
          style={{
            position: 'absolute',
            top: '50%',
            right: '10px',
            transform: 'translateY(-50%)',
            cursor: stageCompleted[currentIndex] ? 'pointer' : 'not-allowed', // 커서 스타일도 조건에 맞게 수정
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
            overflow: 'auto',
            border: '1px solid #ccc',
            borderRadius: '10px',
          }}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          <h2>대시보드</h2>
          <p>
            수집된 카드: {collectedCards.length} / {cards.length}
          </p>
          {collectedCards.map((card) => (
            <div
              key={card.id}
              style={{
                position: 'absolute',
                left: cardPositions[card.id]?.left || 0,
                top: cardPositions[card.id]?.top || 0,
                width: '100px',
                height: '130px',
              }}
              draggable
              onDragStart={(e) => handleDragStart(e, card.id)}
            >
              <img src={card.image} alt={card.label} style={{ width: '100%', height: '100%' }} />
            </div>
          ))}
          <input
            type="text"
            placeholder="정답 입력"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            style={{ display: 'block', margin: '10px auto', padding: '5px' }}
          />
          <button onClick={checkAnswer}>정답 확인</button>
          <button onClick={provideHint}>힌트 보기</button>
          {hintMessage && <p>힌트: {hintMessage}</p>}
        </div>
      )}
      {showStage1 && (
        <div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'white',
            padding: '20px',
            width: '80%',
            height: '80%',
            overflow: 'auto',
            border: '1px solid #ccc',
            borderRadius: '10px',
          }}
        >
          <Stage1 onClose={closeStage1} />
        </div>
      )}
      {showStage2 && (
        <div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'white',
            padding: '20px',
            width: '80%',
            height: '80%',
            overflow: 'auto',
            border: '1px solid #ccc',
            borderRadius: '10px',
          }}
        >
          <Stage2 onClose={closeStage2} />
        </div>
      )}
      {showStage3 && (
        <div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'white',
            padding: '20px',
            width: '80%',
            height: '80%',
            overflow: 'auto',
            border: '1px solid #ccc',
            borderRadius: '10px',
          }}
        >
          <Stage3 onClose={closeStage3} />
        </div>
      )}
    </div>
  );
};

export default ImageSlider;
