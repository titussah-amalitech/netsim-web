import './App.css'
import { MainLayout } from './components'
import { GamePage } from './features/game-simulation'
import { ScenarioEditor } from './features/scenario-management'
import { Route, BrowserRouter, Routes } from 'react-router-dom'

import { Leaderboard } from './features/leaderboard/views/Leaderboard'
import { useEffect } from 'react'
import { seedDummyData } from './seed'


function App() {

  // TODO: REMOVE THIS LATER
  // For testing only
  useEffect(() => {
    let hasSeeded = false;
    if (!hasSeeded) {
      seedDummyData();
      hasSeeded = true;
    }
  }, []);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-network-dark ">
        <Routes>
          <Route element={<MainLayout />} >
            <Route path='/' element={<GamePage />} />
            <Route path='/scenario-editor' element={<ScenarioEditor />} />
            <Route path='/leaderboard' element={<Leaderboard />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
