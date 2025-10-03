import './App.css'
import { MainLayout } from './components'
import { GamePage } from './features/game-simulation'
import { ScenarioEditor } from './features/scenario-management'
import { Route, BrowserRouter, Routes } from 'react-router-dom'
import DeviceDetailsPanel from './features/game-simulation/components/DeviceDetailsPanel'
import DeviceLogger from './features/game-simulation/components/DeviceLogger'
import DeviceStatusIndicator from './features/game-simulation/components/DeviceStatusIndicator'


function App() {

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-network-dark ">
        <Routes>
          <Route element={<MainLayout />} >
            <Route path='/' element={<GamePage />} />
            <Route path='/scenario-editor' element={<ScenarioEditor />} />
            <Route path='/device-logs' element={<DeviceLogger />} />
            <Route path='/device-status' element={<DeviceStatusIndicator />} />
            <Route path='/device-details' element={<DeviceDetailsPanel/>} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
