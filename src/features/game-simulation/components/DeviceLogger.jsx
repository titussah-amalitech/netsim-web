import { useEffect, useMemo, useState } from 'react'
import { Dropdown } from '../../../components/common/Dropdown'
import { DeviceLogCard } from '../components/DeviceLogCard'

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
  
 
  const refreshStatus = () => {
    const randomStatus = Math.floor(Math.random() * 3)
    const device = deviceStatus[randomStatus]
    setNewDeviceStatus(prev => [device, ...prev])
  }

  useEffect(() => {
    const intervalId = setInterval(refreshStatus, 1000 * 30)
    return () => clearInterval(intervalId)
  }, [])

  const filteredBySeverity = newDeviceStatus.filter(
    device => device.indication === selectedSeverity
  )

  const [query, setQuery] = useState('')
  const logs = selectedSeverity === "All Severity" ? newDeviceStatus : filteredBySeverity
  const filteredLogs = useMemo(() => {
    if (!query) return logs
    const lowerQuery = query.toLowerCase()
    return logs.filter(
      log =>
        log.device.toLowerCase().includes(lowerQuery) ||
        log.message.toLowerCase().includes(lowerQuery) ||
        log.indication.toLowerCase().includes(lowerQuery)
    )
  }, [query, logs])

  const renderLogs = () => {
    if (!filteredLogs.length) {
      return (
        <div className="text-center py-6">
          <span className="text-red-400 font-bold">
            {query ? `No logs match your search: "${query}"` : `No ${selectedSeverity} logs`}
          </span>
        </div>
      )
    }

    return filteredLogs.map((device, index) => (
      <DeviceLogCard
        device={device.device}
        message={device.message}
        indication={device.indication}
        time={now.toLocaleTimeString()}
        date={now.toLocaleDateString()}
        key={index}
      />
    ))
  }

  return (
    <div className="rounded-lg bg-network-lighter dark:bg-network-surface border border-network-border-light dark:border-network-border shadow-sm p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <p className="text-2xl font-bold text-network-text-darker dark:text-network-lighter">
          System Logs
        </p>
        <div className="flex items-center gap-4">
          <p className="text-lg text-network-text-dark dark:text-gray-400">
            {logs.length} entries
          </p>
          <Dropdown
            options={severityArray}
            selected={selectedSeverity}
            onChange={setSelectedSeverity}
            className="border border-network-border-light dark:border-network-border rounded p-2 text-sm"
          />
        </div>
      </div>

      {/* Search */}
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Search logs..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="w-full p-2 rounded border border-network-border-light dark:border-network-border bg-network-surface-light dark:bg-network-surface text-network-text-dark dark:text-network-text"
        />
      </div>

      {/* Logs */}
      <div className="overflow-auto max-h-[60vh]">
        {renderLogs()}
      </div>

      <p className="text-center text-sm my-2 text-network-text-dark dark:text-network-text mt-5">
        Showing {filteredLogs.length} of {logs.length} log entries
      </p>
    </div>
  )
}

export default DeviceLogger
