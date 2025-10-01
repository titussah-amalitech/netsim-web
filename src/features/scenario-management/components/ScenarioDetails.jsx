/**  Component for scenario details */
export const ScenarioDetails = ({ scenario, title }) => (
   <div className="mb-6 p-4 bg-network-surface-light border-network-border-light dark:bg-gray-800 rounded-lg border dark:border-network-gray-light shadow-sm">
      <h3 className="text-lg font-semibold text-network-text-darker dark:text-white mb-2">{title}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-network-text-dark dark:text-gray-300 text-sm">
         <div>
            <span className="font-medium text-network-text-darker dark:text-network-text-light">Name:</span> {scenario.name || "N/A"}
         </div>
         <div>
            <span className="font-medium text-network-text-darker dark:text-network-text-light">Devices:</span>{" "}
            {scenario.devices?.length || 0}
         </div>
         <div>
            <span className="font-medium text-network-text-darker dark:text-network-text-light">Time Limit:</span>{" "}
            {scenario.timeLimit || 0} mins
         </div>
         <div>
            <span className="font-medium text-network-text-darker dark:text-network-text-light">Difficulty:</span>{" "}
            {scenario.difficulty || "N/A"}
         </div>
      </div>
   </div>
)