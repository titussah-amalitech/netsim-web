import { DIFFICULTY_OPTIONS } from '../../../constants';

export const ScenarioProperties = ({
   scenario,
   onUpdateProperty,
   onUpdateMetadata
}) => {
   return (
      <div className="bg-gray-800 rounded-lg p-4">
         <h2 className="text-lg font-semibold mb-4">Scenario Properties</h2>

         <div className="space-y-3">
            <input
               type="text"
               placeholder="Scenario Name"
               value={scenario.name}
               onChange={(e) => onUpdateProperty('name', e.target.value)}
               className="w-full bg-gray-700 rounded p-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />

            <textarea
               placeholder="Description"
               value={scenario.metadata.description}
               onChange={(e) => onUpdateMetadata('description', e.target.value)}
               className="w-full bg-gray-700 rounded p-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
               rows={3}
            />

            <select
               value={scenario.difficulty}
               onChange={(e) => onUpdateProperty('difficulty', e.target.value)}
               className="w-full bg-gray-700 rounded p-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
               aria-label='Select difficulty level'
            >
               {DIFFICULTY_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                     {option.label}
                  </option>
               ))}
            </select>

            <input
               type="number"
               placeholder="Time Limit (seconds)"
               value={scenario.timeLimit}
               onChange={(e) => onUpdateProperty('timeLimit', parseInt(e.target.value) || 0)}
               className="w-full bg-gray-700 rounded p-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
         </div>
      </div>
   );
};
