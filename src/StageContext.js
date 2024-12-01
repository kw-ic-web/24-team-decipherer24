import React, { createContext, useContext, useState } from 'react';

const StageContext = createContext();

export const StageProvider = ({ children }) => {
  const [stageCompleted, setStageCompleted] = useState([false, false, false]);

  return (
    <StageContext.Provider value={{ stageCompleted, setStageCompleted }}>
      {children}
    </StageContext.Provider>
  );
};

export const useStage = () => useContext(StageContext);