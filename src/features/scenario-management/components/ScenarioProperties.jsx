import { Dropdown } from '../../../components/common/Dropdown';
import { DIFFICULTY_OPTIONS } from '../../../constants';

export const ScenarioProperties = ({
   scenario,
   onUpdateProperty,
   onUpdateMetadata
}) => {
   return (
      <div className="bg-network-lighter border border-network-border-light dark:bordr dark:border-network-border dark:bg-network-surface rounded-lg p-4">
         <h2 className="text-lg font-semibold mb-4 text-network-text-darker dark:text-network-text-light">Scenario Properties</h2>

         <div className="space-y-3">
            <input
               type="text"
               placeholder="Scenario Name"
               value={scenario.name}
               onChange={(e) => onUpdateProperty('name', e.target.value)}
               className="w-full border border-network-border-light dark:border-0 dark:bg-network-gray-light rounded p-2 text-network-text-darker dark:text-network-text-light placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />

            <textarea
               placeholder="Description"
               value={scenario.metadata.description}
               onChange={(e) => onUpdateMetadata('description', e.target.value)}
               className="w-full border border-network-border-light dark:border-0 dark:bg-network-gray-light rounded p-2 text-network-text-darker dark:text-network-text-light placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
               rows={3}
            />

            <Dropdown
               label="Difficulty"
               selected={scenario.difficulty}
               options={DIFFICULTY_OPTIONS}
               onChange={(value) => onUpdateProperty("difficulty", value)}
               placeholder="Select difficulty level"
               className="w-full bg-white"
            />

            <input
               type="number"
               placeholder="Time Limit (seconds)"
               value={scenario.timeLimit}
               onChange={(e) => onUpdateProperty('timeLimit', parseInt(e.target.value))}
               className="w-full border border-network-border-light dark:border-0 dark:bg-network-gray-light rounded p-2 text-network-text-darker dark:text-network-text-light placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
         </div>
      </div>
   );
};
