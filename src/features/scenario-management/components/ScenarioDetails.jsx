/**  Component for scenario details */
export const ScenarioDetails = ({ scenario, title }) => (
   <div className="mb-6 p-4 bg-gray-800 rounded-lg border border-gray-700 shadow-sm">
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-300 text-sm">
         <div>
            <span className="font-medium">Name:</span> {scenario.name || "N/A"}
         </div>
         <div>
            <span className="font-medium">Devices:</span>{" "}
            {scenario.devices?.length || 0}
         </div>
         <div>
            <span className="font-medium">Time Limit:</span>{" "}
            {scenario.timeLimit || 0} mins
         </div>
         <div>
            <span className="font-medium">Difficulty:</span>{" "}
            {scenario.difficulty || "N/A"}
         </div>
      </div>
   </div>
)
