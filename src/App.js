import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { StageProvider } from './StageContext'; // StageProvider 추가
import ImageSlider from './imageslider';
import Stage1 from './game/stage1'; // 스테이지 1 컴포넌트
import Stage2 from './game/stage2'; // 스테이지 2 컴포넌트
import Stage3 from './game/stage3'; // 스테이지 3 컴포넌트


const App = () => {
  return (
    <StageProvider> {/* StageProvider로 모든 라우트를 감쌈 */}
      <Router>
        <Routes>
          <Route path="/" element={<ImageSlider />} />
          <Route path="/game/stage1" element={<Stage1 />} />
          <Route path="/game/stage2" element={<Stage2 />} />
          <Route path="/game/stage3" element={<Stage3 />} />
        </Routes>
      </Router>
    </StageProvider>
  );
};

export default App;
