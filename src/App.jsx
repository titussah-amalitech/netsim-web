import './App.css'
import { useEffect, useState } from 'react'
import DeviceStatusIndicator from '../components/DeviceStatusIndicator.jsx'
import DeviceLogger from '../components/DeviceLogger.jsx'
import DeviceDetailsPanel from '../components/DeviceDetailsPanel.jsx'
import { colors } from './assets/colorBank.js'
import { MdOutlineToggleOn, MdOutlineToggleOff } from "react-icons/md";

const App = () => {
  const now = new Date()
  const [theme, setTheme] = useState(false)
  const colorMode = theme ? colors.dark : colors.light
  
  const toggleTheme = () => {

    setTheme(prev => !prev)

  };
  useEffect(() => {
    // document.documentElement.style.setProperty("--primary-color", colorMode.primary);
    document.documentElement.style.setProperty("--background-color", colorMode.background);
  }, [colorMode]);
  const deviceStatus = [
    {
      device: 'Database server',
      message: 'Database Server: High latency: 38ms, Packet loss: 4%',
      time: now.toLocaleTimeString(),
      indication: 'High'
    },
    {
      device: 'Workstation 1',
      message: 'Workstation 1: Performance degraded',
      time: now.toLocaleTimeString(),
      indication: 'Medium'
    },
    {
      device: 'Web Server',
      message: 'Device Workstation 2 status changed from critical to online',
      time: now.toLocaleTimeString(),
      indication: 'Low'
    }
  ]
  const [newDeviceStatus, setNewDeviceStatus] = useState([])
  const [selectedSeverity, setSelectedSeverity] = useState('All Severity')
  const [allAlerts, setAllAlerts] = useState([])

  const refereshStatus = () => {
    const randomStatus = Math.floor(Math.random() * 3)
    const device = deviceStatus[randomStatus]
    setNewDeviceStatus(prevState => [device, ...prevState])
    setAllAlerts(prevState => [device, ...prevState])
  }

  useEffect(() => {
    const intervalId = setInterval(refereshStatus, 1000 * 30)

    return () => clearInterval(intervalId)
  }, [])

  const renderLogs = () => {
    return (
      filteredBySeverity.length ?
        filteredBySeverity.map((device, index) => <DeviceLogger
              device={device.device}
              message={device.message}
              indication={device.indication}
              time={now.toLocaleTimeString()}
              date={now.toLocaleDateString()}
              colorMode={colorMode}
              key={index}
        />) : selectedSeverity === 'All Severity' ? newDeviceStatus.map((device, index) => <DeviceLogger
              device={device.device}
              message={device.message}
              indication={device.indication}
              time={now.toLocaleTimeString()}
              date={now.toLocaleDateString()}
              colorMode={colorMode}
              key={index}
        />) : <span className='text-red-400 font-bold'>No {selectedSeverity} Logs </span>
    )
  }

  const dismissAlert = (index) => {
    setAllAlerts(prevState => [
      ...prevState.slice(0, index),
      ...prevState.slice(index + 1)
    ])
  }

  const cearAllAlerts = () => {
    setAllAlerts([])
  }

  const filteredBySeverity = newDeviceStatus.filter(device => device.indication === selectedSeverity)
  return (
    <div className='app mb-8 w-full'>
      <button className='my-8' style={{color: colorMode.text}} onClick={toggleTheme}>{theme ? <MdOutlineToggleOn size={48} /> : <MdOutlineToggleOff size={48}/>}</button>
      <div className="alerts-container p-8 rounded-3xl max-w-180 " style={{backgroundColor: colorMode.gray}}>
        <div className="flex justify-between">
          <p className="active-alerts text-3xl font-bold" style={{color: colorMode.text}}>Active Alerts</p>
          <div className="flex mt-2">
            <div className="dimming-alert h-3 w-3 rounded-full mt-2 me-2"></div>
            <p className='text-xl' style={{color: colorMode.text}}>{allAlerts.length} active</p>
          </div>
        </div>
        <div className="system-logs max-h-100 overflow-auto">
          {allAlerts.map((dev, index)=> <DeviceStatusIndicator key={index} device={dev.device}
            message={dev.message}
            time={dev.time}
            indication={dev.indication}
            dismiss={dismissAlert}
            colorMode={colorMode}
            index={index}
          />)}
        </div>
        <hr className='mt-8'style={{color: colorMode.text}}/>
        <button className='clear-all-alerts w-full border rounded-xl my-4 py-2 text-xl' style={{color: colorMode.text, borderColor: colorMode.text}} onClick={cearAllAlerts}>Clear All Alerts</button>
      </div>
      <div className="logs-container p-8 rounded-3xl mt-8 max-w-180 " style={{backgroundColor: colorMode.gray}}>
        <div className="flex justify-between">
          <p className="active-alerts text-3xl font-bold mt-1" style={{color: colorMode.text}}>System Logs</p>
          <div className="flex mt-2">
            <p className='text-xl mt-1' style={{color: colorMode.text}}>{selectedSeverity === 'All Severity' ? newDeviceStatus.length : filteredBySeverity.length} entries</p>
          </div> 
        </div>
        <div className="logs-search flex justify-between my-3">
          <input type="text" placeholder='Search logs...' className='p-3 rounded-sm text-xl w-2/3' style={{color: colorMode.text}}/>
          <select name="severity" id="severity" 
                  className='p-3 rounded-sm text-xl'
                  value={selectedSeverity}
                  onChange={(e) => setSelectedSeverity(e.target.value)}
                  style={{color: colorMode.text}}
          >
            <option value="All Severity" className='text-gray-800'>All Severity</option>
            <option value="High" className='text-gray-800'>High</option>
            <option value="Medium" className='text-gray-800'>Medium</option>
            <option value="Low" className='text-gray-800'>Low</option>
          </select>
        </div>
        <div className="system-logs max-h-100 overflow-auto">
          {
            renderLogs()
          }
        </div>
        <hr className='mt-4' style={{color: colorMode.text}}/>
        <p className="text-center text-sm my-2" style={{color: colorMode.text}}>Showing {selectedSeverity === 'All Severity' ? newDeviceStatus.length : filteredBySeverity.length} of {newDeviceStatus.length} log entries</p>
      </div>
      <div className="device-details mt-8 ">
        <DeviceDetailsPanel device={"Database Server"} 
          message={"Device Database Server status changed from online to offline"} 
          date={now.toLocaleDateString()}
          time={now.toLocaleTimeString()}
          indication={deviceStatus[Math.floor(Math.random() * 3)].indication}
          colorMode={colorMode}
        />
      </div>
    </div>
  )
}

export default App

