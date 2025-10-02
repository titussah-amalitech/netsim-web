import './App.css'
import { MainLayout } from './components'
import { GamePage } from './features/game-simulation'
import { ScenarioEditor } from './features/scenario-management'
import { Route, BrowserRouter, Routes } from 'react-router-dom'

function App() {

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-network-dark ">
        <Routes>
          <Route element={<MainLayout />} >
            <Route path='/' element={<GamePage />} />
            <Route path='/scenario-editor' element={<ScenarioEditor />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
