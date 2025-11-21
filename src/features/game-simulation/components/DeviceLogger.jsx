import {  useMemo, useState } from 'react'
import { Dropdown } from '../../../components/common/Dropdown'
import { DeviceLogCard } from '../components/DeviceLogCard'

const DeviceLogger = ({ logs = [] }) => {
  const severityArray = ["All Severity", "High", "Medium", "Low"]
  const [selectedSeverity, setSelectedSeverity] = useState(severityArray[0])
  const [query, setQuery] = useState('')

  const filteredBySeverity = logs.filter(
    log => selectedSeverity === "All Severity" || log.indication === selectedSeverity
  )

  const filteredLogs = useMemo(() => {
    if (!query) return filteredBySeverity
    const lowerQuery = query.toLowerCase()
    return filteredBySeverity.filter(
      log =>
        log.device.toLowerCase().includes(lowerQuery) ||
        log.message.toLowerCase().includes(lowerQuery) ||
        log.indication.toLowerCase().includes(lowerQuery)
    )
  }, [query, filteredBySeverity])

  const renderLogs = () => {
    if (!filteredLogs.length) {
      return (
        <div className="text-center py-6">
          <span className="dark:text-network-text-light font-bold">
            {query
              ? `No logs match your search: "${query}"`
              : `No ${selectedSeverity} logs`}
          </span>
        </div>
      );
    }

    return filteredLogs.map((log, index) => (
      <DeviceLogCard
        key={`${log.time}-${index}`}
        device={log.device}
        message={log.message}
        indication={log.indication}
        time={log.time}
        date={log.date}
      />
    ))
  }

  return (
    <div className="h-full rounded-lg bg-network-lighter dark:bg-network-surface border border-network-border-light dark:border-network-border shadow-sm p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4 w-full">
          <Dropdown
            options={severityArray}
            selected={selectedSeverity}
            onChange={setSelectedSeverity}
            labelStyle='py'
            className="w-full border border-network-border-light dark:border-network-border rounded p-2 text-sm"
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
      <div className="overflow-auto max-h-full md:max-h-[50vh] custom-scrollbar">
        {renderLogs()}
      </div>

      <p className="text-center text-sm my-2 text-network-text-dark dark:text-network-text mt-5">
        Showing {filteredLogs.length} of {logs.length} log entries
      </p>
    </div>
  )
}

export default DeviceLogger