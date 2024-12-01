import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStage } from '../StageContext'; // StageContext 추가
import '../App.css';
import './stage2.css';

import piece1 from '../assets/images/stage2/1.jpg';
import piece2 from '../assets/images/stage2/2.jpg';
import piece3 from '../assets/images/stage2/3.jpg';
import piece4 from '../assets/images/stage2/4.jpg';
import piece5 from '../assets/images/stage2/5.jpg';
import piece6 from '../assets/images/stage2/6.jpg';
import piece7 from '../assets/images/stage2/7.jpg';
import piece8 from '../assets/images/stage2/8.jpg';
import problemImage from '../assets/images/stage2/9.jpg';

const originalPositions = [
  { id: 'piece5', image: piece5, parent: null },
  { id: 'piece6', image: piece6, parent: null },
  { id: 'piece1', image: piece1, parent: null },
  { id: 'piece2', image: piece2, parent: null },
  { id: 'piece7', image: piece7, parent: null },
  { id: 'piece4', image: piece4, parent: null },
  { id: 'piece3', image: piece3, parent: null },
  { id: 'piece8', image: piece8, parent: null },
];

const Stage2 = () => {
  const navigate = useNavigate();
  const { stageCompleted, setStageCompleted } = useStage(); // useStage 추가

  const [pieces, setPieces] = useState(originalPositions);
  const [message, setMessage] = useState('');
  const [hintUsed, setHintUsed] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);
  const [draggedPiece, setDraggedPiece] = useState(null);
  const [dropData, setDropData] = useState({
    drop1: [],
    drop2: [],
    drop3: [],
    drop4: [],
  });

  const correctPairs = {
    drop1: ['piece1', 'piece8'],
    drop2: ['piece3', 'piece7'],
    drop3: ['piece2', 'piece6'],
    drop4: ['piece4', 'piece5'],
  };

  useEffect(() => {
    const initialDropData = {};
    Object.keys(correctPairs).forEach((zoneId) => {
      initialDropData[zoneId] = [];
    });
    setDropData(initialDropData);
  }, []);

  const handleDragStart = (e, id) => {
    setDraggedPiece(id);
    e.dataTransfer.setData('text', id);
  };

  const checkIfAllZonesFilled = (updatedDropData) => {
    const allZonesFilled = Object.values(updatedDropData).every((zone) => zone.length === 2);
    setIsSubmitEnabled(allZonesFilled);
  };

  const handleDrop = (e, zoneId) => {
    e.preventDefault();
    if (dropData[zoneId] && dropData[zoneId].length < 2 && !dropData[zoneId].includes(draggedPiece)) {
      const updatedDropData = {
        ...dropData,
        [zoneId]: [...dropData[zoneId], draggedPiece],
      };
      setDropData(updatedDropData);
      const updatedPieces = pieces.map((piece) =>
        piece.id === draggedPiece ? { ...piece, parent: zoneId } : piece
      );
      setPieces(updatedPieces);
      checkIfAllZonesFilled(updatedDropData);
    }
  };

  const handleReset = () => {
    setDropData({ drop1: [], drop2: [], drop3: [], drop4: [] });
    setMessage('');
    setSubmitAttempted(false);
    setHintUsed(false);
    setShowHint(false);
    setPieces(originalPositions);
  };

  const handleSubmit = () => {
    if (!isSubmitEnabled) {
      setMessage('모든 조각을 놓은 후에 정답을 확인할 수 있습니다.');
      setTimeout(() => setMessage(''), 2000);
      return;
    }

    let isCorrect = true;
    for (let zoneId in dropData) {
      const droppedPieces = dropData[zoneId];
      if (
        !correctPairs[zoneId] ||
        droppedPieces.length !== 2 ||
        !correctPairs[zoneId].every((piece) => droppedPieces.includes(piece))
      ) {
        isCorrect = false;
        break;
      }
    }

    setSubmitAttempted(true);
    if (isCorrect) {
      setMessage('정답입니다! 🎉');
      setStageCompleted((prev) => {
        const updated = [...prev];
        updated[1] = true; // Stage 2 완료
        return updated;
      });

      setTimeout(() => {
        navigate('/', { state: { startIndex: 1, solved: true } });
      }, 1000);
    } else {
      setMessage('틀렸습니다. 다시 시도하세요.');
    }
  };

  const handleHint = () => {
    if (!submitAttempted) {
      setMessage('먼저 정답 확인을 해주세요.');
    } else if (!hintUsed && !showHint) {
      setShowHint(true);
      setMessage('힌트를 사용하였습니다.');
      setHintUsed(true);
    } else if (showHint) {
      setShowHint(false);
      setMessage('');
    } else {
      setMessage('힌트는 한 번만 사용할 수 있습니다.');
    }

    setTimeout(() => setMessage(''), 2000);
  };

  const handleGoBack = () => {
    navigate('/', { state: { startIndex: 1 } }); // Stage 2로 돌아가기
  };

  return (
    <div>
      <h3>왕의 휘장을 맞춰보세요!</h3>
      <p>각 휘장의 두 조각을 짝 맞추고, 4개의 완성된 휘장을 순서대로 나열하세요.</p>

      <div className="problem">
        <h2>문제</h2>
        <img src={problemImage} alt="문제 이미지" className="problem-image" />
      </div>

      <div className="game-container">
        <div className="pieces">
          {pieces.filter((piece) => piece.parent === null).map((piece) => (
            <div
              key={piece.id}
              className="piece"
              draggable="true"
              onDragStart={(e) => handleDragStart(e, piece.id)}
              style={{ backgroundImage: `url(${piece.image})` }}
            ></div>
          ))}
        </div>

        <div className="drop-zone-container">
          {Object.keys(correctPairs).map((zoneId, index) => (
            <div
              key={index}
              className="drop-zone"
              onDrop={(e) => handleDrop(e, zoneId)}
              onDragOver={(e) => e.preventDefault()}
            >
              {dropData[zoneId].map((pieceId, i) => (
                <div
                  key={i}
                  className="dropped-piece"
                  style={{
                    backgroundImage: `url(${pieces.find((p) => p.id === pieceId)?.image})`,
                  }}
                ></div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="button-container">
        <button onClick={handleSubmit}>정답 확인</button>
        <button onClick={handleHint}>힌트</button>
        <button onClick={handleReset}>다시하기</button>
        <button onClick={handleGoBack}>돌아가기</button>
      </div>

      {message && <p id="message">{message}</p>}
      {showHint && (
        <div id="hintContainer" className="hint-container">
          <p id="hintMessage">힌트: 나라의 말이 '중국'과 달라 문자와 서로 통하지 아니하니...</p>
        </div>
      )}
    </div>
  );
};

export default Stage2;
