import React, { useState } from 'react';

// 이미지 import
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
import mapImage from './assets/images/stage4/map_image.png';

// 카드 데이터
const cards = [
    { id: 1, image: image1, label: '백' },
    { id: 2, image: image2, label: '성' },
    { id: 3, image: image3, label: '을' },
    { id: 4, image: image4, label: '가' },
    { id: 5, image: image5, label: '르' },
    { id: 6, image: image6, label: '치' },
    { id: 7, image: image7, label: '는' },
    { id: 8, image: image8, label: '바' },
    { id: 9, image: image9, label: '른' },
    { id: 10, image: image10, label: '소' },
    { id: 11, image: image11, label: '리' }
];

function App() {
    const [collectedCards, setCollectedCards] = useState([]);
    const [showDashboard, setShowDashboard] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [isSolved, setIsSolved] = useState(false);
    const [cardPositions, setCardPositions] = useState({});
    const [hintIndex, setHintIndex] = useState(0);
    const [hintMessage, setHintMessage] = useState('');

    const handleAreaClick = (card) => {
        if (!collectedCards.some(c => c.id === card.id)) {
            setCollectedCards(prevCards => [...prevCards, card]);
        }
    };

    const toggleDashboard = () => {
        if (collectedCards.length === cards.length) {
            setShowDashboard(!showDashboard);
        }
    };

    const handleInputChange = (e) => setInputValue(e.target.value);

    const checkAnswer = () => {
        const answer = "백성을 가르치는 바른 소리";
        if (inputValue === answer) {
            setIsSolved(true);
            setShowDashboard(false);
        } else {
            alert("틀렸습니다.");
            setInputValue('');
        }
    };

    const provideHint = () => {
        const hints = ["훈민정음의 뜻풀이", "ㅂㅅㅇ ㄱㄹㅊㄴ ㅂㄹ ㅅㄹ"];
        setHintMessage(hints[hintIndex] || "");
        setHintIndex((hintIndex + 1) % hints.length);
    };

    const handleDragStart = (e, cardId) => e.dataTransfer.setData('cardId', cardId);

    const handleDrop = (e) => {
        e.preventDefault();
        const cardId = e.dataTransfer.getData('cardId');
        const dashboardRect = document.getElementById('dashboard').getBoundingClientRect();
        const x = Math.max(0, Math.min(e.clientX - dashboardRect.left - 60, dashboardRect.width - 120));
        const y = Math.max(0, Math.min(e.clientY - dashboardRect.top - 120, dashboardRect.height - 400));

        setCardPositions(prev => ({ ...prev, [cardId]: { left: x, top: y } }));
    };

    return (
        <div className="App">
            <h1>이미지 맵 클릭하여 카드 보기</h1>
            <div className="image-container">
                <img src={mapImage} alt="Map" useMap="#image-map" />
                <map name="image-map">
                    {cards.map((card, index) => (
                        <area key={card.id} shape="rect" coords={getCoords(index)} alt={`단어 ${index + 1}`} onClick={() => handleAreaClick(card)} href="#" />
                    ))}
                </map>
            </div>
            <div className="dashboard">
                <h2>카드 대시보드</h2>
                <p>모은 카드 개수: {collectedCards.length}/11</p>
                {collectedCards.length === cards.length && <button onClick={toggleDashboard}>카드 대시보드 열기</button>}
            </div>

            {showDashboard && (
                <div className="modal" id="dashboard" onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}>
                    <p style={{ fontWeight: 'bold' }}>
                        한글의 첫 이름으로 세종대왕이 창제한 문자의 명칭이자
                        훈민정음의 창제 원리와 사용법 등을 해설해 놓은 책의
                        제목을 나타내는 단어의 뜻을 풀어써라.
                    </p>
                    <div className="card-container">
                        {collectedCards.map(card => (
                            <div key={card.id} id={card.id} className="card" draggable onDragStart={(e) => handleDragStart(e, card.id)} style={{ left: cardPositions[card.id]?.left, top: cardPositions[card.id]?.top }}>
                                <img src={card.image} alt={card.label} />
                            </div>
                        ))}
                    </div>
                    <div className="input-section" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <button onClick={provideHint}>힌트</button>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', flexGrow: 1 }}>
                            <input type="text" value={inputValue} onChange={handleInputChange} placeholder="정답을 입력하세요" style={{ width: '40%', marginRight: '5px' }} />
                            <button onClick={checkAnswer} style={{ padding: '5px' }}>정답</button>
                        </div>
                    </div>
                    {hintMessage && <p>힌트: {hintMessage}</p>}
                    {isSolved && <p>문제풀이완료!</p>}
                </div>
            )}
        </div>
    );
}

const getCoords = (index) => [
    "130,472,169,507", "353,424,384,460", "950,657,1033,706", "1090,475,1197,545", "780,222,816,275",
    "1129,121,1236,173", "264,60,296,104", "307,32,474,117", "960,390,1022,454", "1037,117,1075,202", "50,102,164,204"
][index];

export default App;
