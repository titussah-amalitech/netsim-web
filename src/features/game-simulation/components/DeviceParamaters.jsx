import { Button } from '../../../components';
import Form from '../../../components/common/Form';

export const DeviceParamaters = ({ deviceToEdit, applyChanges, setDeviceToEdit }) => {
   return (
      <Form
         onSubmit={(e) => {
            e.preventDefault();
            applyChanges(deviceToEdit?._id, {
               parameters: deviceToEdit?.parameters,
               deviceStatus: deviceToEdit?.status,
            });
         }}
         className="space-y-3 mt-2"
      >
         <div>
            <label className="block text-sm font-medium text-network-text-darker dark:text-network-text-light mb-1">
               Device
            </label>
            <div
               className={"px-3 py-2 border border-network-border-light dark:border-0 dark:bg-network-gray-light rounded"}
            >
               {deviceToEdit?.device.name}
            </div>
         </div>
         <div>
            <label className="block text-sm font-medium text-network-text-darker dark:text-network-text-light mb-1">
               Ping Interval (s)
            </label>
            <input
               type="number"
               value={deviceToEdit?.parameters.pingInterval}
               onChange={(e) => setDeviceToEdit(prev => ({
                  ...prev,
                  parameters: { ...(prev.parameters || {}), pingInterval: Number(e.target.value) }
               }))}
               className="w-full px-3 py-2 border border-network-border-light dark:border-0 dark:bg-network-gray-light rounded text-network-text-darker dark:text-network-text-light focus:outline-none focus:ring-2 focus:ring-blue-400"
               min="1"
            />
         </div>

         <div>
            <label className="block text-sm font-medium text-network-text-darker dark:text-network-text-light mb-1">
               Latency (ms)
            </label>
            <input
               type="number"
               value={deviceToEdit?.parameters.latencyThreshold || 30}
               onChange={(e) => setDeviceToEdit(prev => ({
                  ...prev,
                  parameters: { ...(prev.parameters || {}), latencyThreshold: Number(e.target.value) }
               }))}
               className="w-full px-3 py-2 border border-network-border-light dark:border-0 dark:bg-network-gray-light rounded text-network-text-darker dark:text-network-text-light focus:outline-none focus:ring-2 focus:ring-blue-400"
               min="0"
            />
         </div>

         <div>
            <label className="block text-sm font-medium text-network-text-darker dark:text-network-text-light mb-1">
               Failure Probability (%)
            </label>
            <input
               type="number"
               value={(deviceToEdit?.parameters.failureProbability || 0) * 100}
               onChange={(e) => setDeviceToEdit(prev => ({
                  ...prev,
                  parameters: { ...(prev.parameters || {}), failureProbability: Number(e.target.value) / 100 }
               }))}
               className="w-full px-3 py-2 border border-network-border-light dark:border-0 dark:bg-network-gray-light rounded text-network-text-darker dark:text-network-text-light focus:outline-none focus:ring-2 focus:ring-blue-400"
               min="0"
               max="100"
            />
         </div>

         <div>
            <label className="block text-sm font-medium text-network-text-darker dark:text-network-text-light mb-1">
               Status
            </label>
            <div
               className={`px-3 py-2 border border-network-border-light dark:border-0 dark:bg-network-gray-light   rounded  ${deviceToEdit?.parameters.latencyThreshold <= 100 ? 'text-network-success' : 'text-network-error'
                  }`}
            >
               {deviceToEdit?.parameters.latencyThreshold <= 100 ? 'Online' : 'Offline'}
            </div>
         </div>

         <Button
            type="submit"
            variant=""
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-network-success hover:bg-network-success/80 text-white rounded-lg transition-colors cursor-pointer"
         >
            Apply
         </Button>
      </Form>
   )
}
