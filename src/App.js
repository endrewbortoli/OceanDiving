import React, { useState, useRef, useEffect } from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import Main from './pages/Main';
import MissionPage from './pages/MissionPage';
import DifficultyPage from './pages/DifficultyPage';
import LastPage from './pages/LastPage';
import InformativePage from './pages/InformativePage';
import './styles/App.css';
import getMissionsByDifficulty from './missions'; // Correct path to import

function App() {
  const missionPageRef = useRef(); // Create a ref for the MissionPage
  const [difficulty, setDifficulty] = useState('FÁCIL'); // Default difficulty
  const [missions, setMissions] = useState(getMissionsByDifficulty(difficulty)); // Get missions based on difficulty

  // UseEffect to get the selected difficulty from localStorage
  useEffect(() => {
    const savedDifficulty = localStorage.getItem('selectedDifficulty') || 'FÁCIL';
    setDifficulty(savedDifficulty);
  }, []);

  // Update missions when difficulty changes
  useEffect(() => {
    setMissions(getMissionsByDifficulty(difficulty));
  }, [difficulty]);

  const concludeMission = (index) => {
    setMissions((prevMissions) => {
      const updatedMissions = [...prevMissions];
      updatedMissions[index].concluded = true; // Set the concluded property to true
      return updatedMissions;
    });
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<DifficultyPage setDifficulty={setDifficulty} />} />
        <Route path="/main" element={<Main missions={missions} />} />
        <Route path="/congratulations" element={<LastPage />} />
        <Route path="/informative" element={<InformativePage />} />
        {missions.map((mission, index) => (
          <Route
            key={mission.index}
            path={`/mission-${mission.index}`}
            element={
              <MissionPage
                ref={missionPageRef} // Pass the ref to MissionPage
                stages={mission.stages.map((stage) => ({
                  ...stage,
                  component: React.cloneElement(stage.component, {
                    setMissionStageIndex: () => missionPageRef.current.setStageIndex(stage.next),
                    onMissionComplete: () => concludeMission(index), // Use the index to identify the mission
                  }),
                }))}
                csvPath={mission.csvPath}
                initialViewState={mission.initialViewState}
                heatmapConfig={mission.heatmapConfig}
                tileLayerConfig={mission.tileLayerConfig}
              />
            }
          />
        ))}
      </Routes>
    </Router>
  );
}

export default App;
