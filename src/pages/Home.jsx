import React, { useState } from 'react';
import Stage1 from '../game/stage1';  // Stage1 컴포넌트
import Stage2 from '../game/stage2';  // Stage2 컴포넌트
import Stage3 from '../game/stage3';  // Stage3 컴포넌트
import Stage4 from '../game/stage4';  // Stage4 컴포넌트
import '../App.css';

const Home = () => {
  const [currentStage, setCurrentStage] = useState(null);  // 현재 열려있는 스테이지 상태

  // 스테이지 토글 함수
    const handleStageToggle = (stage) => {
        setCurrentStage(currentStage === stage ? null : stage);  // 이미 열려있는 스테이지를 닫기
    };

    return (
        <div className="App">
        <div className="stage-buttons">
            <button onClick={() => handleStageToggle('stage1')}>
            {currentStage === 'stage1' ? 'Stage 1 닫기' : 'Stage 1 열기'}
            </button>
            <button onClick={() => handleStageToggle('stage2')}>
            {currentStage === 'stage2' ? 'Stage 2 닫기' : 'Stage 2 열기'}
            </button>
            <button onClick={() => handleStageToggle('stage3')}>
            {currentStage === 'stage3' ? 'Stage 3 닫기' : 'Stage 3 열기'}
            </button>
            <button onClick={() => handleStageToggle('stage4')}>
            {currentStage === 'stage4' ? 'Stage 4 닫기' : 'Stage 4 열기'}
            </button>
        </div>

        <div className="stage-content" style={{ width: '800px', height: '600px' }}>
            {/* 버튼에 해당하는 컴포넌트를 표시 */}
            {currentStage === 'stage1' && <Stage1 />}
            {currentStage === 'stage2' && <Stage2 />}
            {currentStage === 'stage3' && <Stage3 />}
            {currentStage === 'stage4' && <Stage4 />}
        </div>
        </div>
    );
};

export default Home;