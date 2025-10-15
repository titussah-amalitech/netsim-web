import { useEffect, useState } from 'react'
import { useTheme } from '../../../hooks/useTheme'
import { Dropdown } from '../../../components/common/Dropdown'

const DeviceLogger = () => {
  const now = new Date()

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
  const severityArray = ["All Severity", "High", "Medium", "Low"]
  const [selectedSeverity, setSelectedSeverity] = useState(severityArray[0])
  

  
  const { theme } = useTheme()
  const isDarkMode = theme === 'dark'

  const refereshStatus = () => {
    const randomStatus = Math.floor(Math.random() * 3)
    const device = deviceStatus[randomStatus]
    setNewDeviceStatus(prevState => [device, ...prevState])
  }

  useEffect(() => {
    const intervalId = setInterval(refereshStatus, 1000 * 30)
    return () => clearInterval(intervalId)
  }, [])

  const filteredBySeverity = newDeviceStatus.filter(
    device => device.indication === selectedSeverity
  )

  const DeviceLogs = ({ device, message, time, indication, date }) => {
    let indColor
    if (indication === 'High') {
      indColor = 'var(--color-network-error)'
    } else if (indication === 'Medium') {
      indColor = 'var(--color-network-warning)'
    } else {
      indColor = 'var(--color-network-success)'
    }

    return (
      <div
        className="log rounded-xl flex p-4 my-4 w-full"
        style={{
          backgroundColor: isDarkMode
            ? 'var(--color-network-surface)'
            : 'var(--color-network-surface-light)'
        }}
      >
        <div
          className="me-4 h-5 w-5 rounded-full mt-1"
          style={{ backgroundColor: indColor }}
        ></div>
        <div className="w-3/4">
          <div className="flex">
            <p
              className="font-extrabold mt-1"
              style={{
                color: isDarkMode
                  ? 'var(--color-network-text-light)'
                  : 'var(--color-network-text-darker)'
              }}
            >
              {device}
            </p>
            <p
              className="indicator text-white ms-5 rounded-sm font-bold px-2"
              style={{ backgroundColor: indColor }}
            >
              {indication}
            </p>
          </div>
          <p
            className="text-xs mt-2"
            style={{
              color: isDarkMode
                ? 'var(--color-network-text)'
                : 'var(--color-network-text-dark)'
            }}
          >
            {message}
          </p>
          <p
            className="text-xs mt-1"
            style={{
              color: isDarkMode
                ? 'var(--color-network-text)'
                : 'var(--color-network-text-dark)'
            }}
          >
            {date}, {time}
          </p>
        </div>
      </div>
    )
  }

  const renderLogs = () => {
    return filteredBySeverity.length ? (
      filteredBySeverity.map((device, index) => (
        <DeviceLogs
          device={device.device}
          message={device.message}
          indication={device.indication}
          time={now.toLocaleTimeString()}
          date={now.toLocaleDateString()}
          key={index}
        />
      ))
    ) : selectedSeverity === 'All Severity' ? (
      newDeviceStatus.map((device, index) => (
        <DeviceLogs
          device={device.device}
          message={device.message}
          indication={device.indication}
          time={now.toLocaleTimeString()}
          date={now.toLocaleDateString()}
          key={index}
        />
      ))
    ) : (
      <span className="text-red-400 font-bold">
        No {selectedSeverity} Logs
      </span>
    )
  }

  return (
    <div
      className="logs-container p-8 rounded-3xl mt-8 max-w-180"
      style={{
        backgroundColor: isDarkMode
          ? 'var(--color-network-gray-light)'
          : 'var(--color-network-light)'
      }}
    >
      <div className="flex justify-between">
        <p
          className="active-alerts text-3xl font-bold mt-1"
          style={{
            color: isDarkMode
              ? 'var(--color-network-text-light)'
              : 'var(--color-network-text-darker)'
          }}
        >
          System Logs
        </p>
        <div className="flex mt-2">
          <p
            className="text-xl mt-1"
            style={{
              color: isDarkMode
                ? 'var(--color-network-text)'
                : 'var(--color-network-text-dark)'
            }}
          >
            {selectedSeverity === 'All Severity'
              ? newDeviceStatus.length
              : filteredBySeverity.length}{' '}
            entries
          </p>
        </div>
      </div>

      <div className="logs-search flex justify-between my-3 space-x-2">
        <input
          type="text"
          placeholder="Search logs..."
          className="px-3 py-3 border rounded-sm text-lg w-2/3 max-h-[fit-content]"
          style={{
            color: isDarkMode
              ? 'var(--color-network-text)'
              : 'var(--color-network-text-dark)',
          }}
        />
        <Dropdown 
          options={severityArray}
          selected={selectedSeverity}
          onChange={setSelectedSeverity}
          className="border border-gray-400 rounded-sm text-lg max-h-[fit-content] cursor-pointer max-w-50 "
        />
      </div>

      <div className="system-logs max-h-100 overflow-auto">
        {newDeviceStatus.length ? renderLogs() : 
          <div className="flex flex-1 justify-center items-center">
                <span className="text-xl text-yellow-500">No Sytem Logs!</span>
          </div>
        }
      </div>
      <hr
        className="mt-4"
        style={{
          borderColor: isDarkMode
            ? "var(--color-network-border-light)"
            : "var(--color-network-border)",
        }}
      />
      <p
        className="text-center text-sm my-2"
        style={{
          color: isDarkMode
            ? 'var(--color-network-text)'
            : 'var(--color-network-text-dark)'
        }}
      >
        Showing{' '}
        {selectedSeverity === 'All Severity'
          ? newDeviceStatus.length
          : filteredBySeverity.length}{' '}
        of {newDeviceStatus.length} log entries
      </p>
    </div>
  )
}

export default DeviceLogger
