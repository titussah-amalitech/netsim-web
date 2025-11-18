import './App.css'
import { MainLayout } from './components'
import { ScenarioEditor, ScenarioLibrary } from './features/scenario-management'
import { Route, BrowserRouter, Routes } from 'react-router-dom'
import { Leaderboard } from './features/leaderboard/views/Leaderboard'

import { GameHub } from './features/game-simulation/views/GameHub'
import { GlobalAuthWrapper } from './components/GlobalAuthWrapper'
import { Toaster } from 'react-hot-toast'
import { PlayersLeaderboard } from './features/leaderboard/views/PlayersLeaderBoard';

function App() {
  return (
    <BrowserRouter>
      <GlobalAuthWrapper>
        <div className="min-h-screen bg-network-dark ">
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<GameHub />} />
              <Route path="/scenario-editor" element={<ScenarioEditor />} />
              <Route path="/scenario-library" element={<ScenarioLibrary />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/players-leaderboard" element={<PlayersLeaderboard />} />
            </Route>
          </Routes>
        </div>
        <Toaster position="top-right" reverseOrder={false} />
      </GlobalAuthWrapper>
    </BrowserRouter>
  );
}

export default App
