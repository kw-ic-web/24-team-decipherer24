import React, { useState, useEffect } from 'react';
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

const App = () => {
    const [pieces, setPieces] = useState(originalPositions);  
    const [message, setMessage] = useState("");  
    const [hintUsed, setHintUsed] = useState(false);  
    const [showHint, setShowHint] = useState(false);  
    const [submitAttempted, setSubmitAttempted] = useState(false);  
    const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);
    

    const [draggedPiece, setDraggedPiece] = useState(null);
    const [dropData, setDropData] = useState({
        drop1: [],
        drop2: [],
        drop3: [],
        drop4: []
    });

    useEffect(() => {
        const initialDropData = {};
        Object.keys(correctPairs).forEach(zoneId => {
            initialDropData[zoneId] = [];
        });
        setDropData(initialDropData);
    }, []);

    const correctPairs = {
        drop1: ['piece1', 'piece8'],
        drop2: ['piece3', 'piece7'],
        drop3: ['piece2', 'piece6'],
        drop4: ['piece4', 'piece5']
    };
    
    const handleDragStart = (e, id) => {
        setDraggedPiece(id);
        e.dataTransfer.setData("text", id);
    };

    const checkIfAllZonesFilled = (updatedDropData) => {
        const allZonesFilled = Object.values(updatedDropData).every(zone => zone.length === 2);
        setIsSubmitEnabled(allZonesFilled);
    };

    const handleDrop = (e, zoneId) => {
        e.preventDefault();
    
        if (dropData[zoneId] && dropData[zoneId].length < 2 && !dropData[zoneId].includes(draggedPiece)) {
            const updatedDropData = {
                ...dropData,
                [zoneId]: [...dropData[zoneId], draggedPiece]
            };
            setDropData(updatedDropData);
    
            const updatedPieces = pieces.map(piece => 
                piece.id === draggedPiece 
                    ? { ...piece, parent: zoneId } 
                    : piece
            );
            setPieces(updatedPieces);
    
            checkIfAllZonesFilled(updatedDropData);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();  
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
            setMessage("모든 조각을 놓은 후에 정답을 확인할 수 있습니다.");
            
            setTimeout(() => {
                setMessage("");
            }, 2000);
    
            return;
        }
    
        let isCorrect = true;
    
        for (let zoneId in dropData) {
            const droppedPieces = dropData[zoneId];
            if (
                correctPairs[zoneId] &&
                (droppedPieces.length !== 2 || !correctPairs[zoneId].every(piece => droppedPieces.includes(piece)))
            ) {
                isCorrect = false;
                break;
            }
        }
        setSubmitAttempted(true);
        if (isCorrect) {
            setMessage('정답입니다!');
        } else {
            setMessage('틀렸습니다. 다시 시도하세요.');
            setHintUsed(false);
        }

        setTimeout(() => {
            setMessage('');
        }, 2000)
    };
    
    const handleHint = () => {
        if (!submitAttempted) {
            setMessage("먼저 정답 확인을 해주세요.");  
        } else if (!hintUsed && !showHint) {
            setShowHint(true);
            setMessage('힌트를 사용하였습니다.');
        } else if (showHint) {
            setShowHint(false);
            setMessage('');
        } else {
            setMessage("힌트는 한 번만 사용할 수 있습니다.");
        }

        setTimeout(() => {
            setMessage('');
        }, 2000)
    
        if (!hintUsed && showHint) {
            setHintUsed(true);  
        }
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
                {pieces.filter(piece => piece.parent === null).map(piece => (
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
                            {dropData[zoneId] && dropData[zoneId].map((pieceId, i) => (
                                <div
                                    key={i}
                                    className="dropped-piece"
                                    style={{
                                        backgroundImage: `url(${pieces.find(p => p.id === pieceId)?.image})`
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
            </div>
    
            {message && <p id="message">{message}</p>}
    
            {showHint && (
                <div id="hintContainer" className="hint-container">
                    <p id="hintMessage">
                        힌트: 나라의 말이 '중국'과 달라 문자와 서로 통하지 아니하니,<br />
                        이런 까닭으로 어리석은 백성이 이르고자 할 바가 있어도 마침내 '제 뜻을 능히 펴지 못할 사람'이 많으니라.<br />
                        내가 이를 위하여 가엾이 여겨 새로 '스물여덟' 자를 만드노니,<br />
                        사람마다 하여금 '쉬이 익혀 날로 씀에 편하게 하고자' 할 따름이니라.
                    </p>
                </div>
            )}
        </div>
    );
}

export default App;