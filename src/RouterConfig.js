import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ImageSlider from './imageslider';
import Stage1 from './Stage1';

const RouterConfig = () => {
  return (
    <Router>
      <Routes>
        <Route path="/map1" element={<ImageSlider />} />
        <Route path="/game/stage1" element={<Stage1 />} />
      </Routes>
    </Router>
  );
};

export default RouterConfig;
