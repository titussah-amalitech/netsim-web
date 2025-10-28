import { useState } from 'react';
import { Button } from '../../../components';
import { Edit3, Trash2 } from 'lucide-react';
import { DEVICE_TYPES } from '../../../constants';
import { Dropdown } from '../../../components/common/Dropdown';

export const DeviceProperties = ({
   device,
   onUpdateDevice,
   onDeleteDevice,
   isEditingMode = false,
   isSimulation = false,
}) => {
   const [isEditing, setIsEditing] = useState(isEditingMode);
   const [pingInterval, setPingInterval] = useState(device.parameters?.pingInterval || 30)
   // Form state for editing device properties
   const [formData, setFormData] = useState(() => {
      const currentDeviceConfig = DEVICE_TYPES[device.device?.type || device.type];
      return {
         name: device.device?.name || device.name || currentDeviceConfig?.name || '',
         type: device.device?.type || device.type || 'router',
         pingInterval: device.parameters?.pingInterval || 30,
         latencyThreshold: device.parameters?.latencyThreshold || 100,
         failureProbability: device.parameters?.failureProbability || 0,
         problemType: device.parameters?.problemType || 'high_latency'
      };
   });

   // Helper function to save changes and exit editing mode
   const handleSaveChanges = () => {
      // Get the new device type config to update the name
      const newDeviceConfig = DEVICE_TYPES[formData.type];
      const updatedName = formData.name.trim() || newDeviceConfig?.name || formData.type;

      onUpdateDevice(device._id, {
         device: {
            ...device.device,
            name: updatedName,
            type: formData.type
         },
         parameters: {
            ...device.parameters,
            pingInterval: formData.pingInterval,
            latencyThreshold: formData.latencyThreshold,
            failureProbability: formData.failureProbability,
            problemType: formData.problemType
         }
      });
      setIsEditing(false);
   };

   // Helper function to start editing mode
   const handleStartEdit = () => {
      const currentDeviceConfig = DEVICE_TYPES[device.device?.type || device.type];

      setIsEditing(true);
      setFormData({
         name: device.device?.name || device.name || currentDeviceConfig?.name || '',
         type: device.device?.type || device.type || 'router',
         pingInterval: device.parameters?.pingInterval || 30,
         latencyThreshold: device.parameters?.latencyThreshold || 100,
         failureProbability: device.parameters?.failureProbability || 0,
         problemType: device.parameters?.problemType || 'high_latency'
      });
   };

   // Helper function to cancel editing and revert changes
   const handleCancel = () => {
      setIsEditing(false);
      setFormData({
         name: device.device?.name || device.name || '',
         type: device.device?.type || device.type || 'router',
         latencyThreshold: device.parameters?.latencyThreshold || 100,
         failureProbability: device.parameters?.failureProbability || 0,
         problemType: device.parameters?.problemType || 'high_latency'
      });
   };

   const deviceType = device.device?.type || device.type;
   const deviceConfig = DEVICE_TYPES[deviceType];

   // If device type is unknown, do not render properties
   if (!deviceConfig) return null;

   const Icon = deviceConfig.icon;

   // Device type options for dropdown
   const deviceTypeOptions = Object.entries(DEVICE_TYPES).map(([key, config]) => ({
      value: key,
      label: config.name,
      icon: config.icon
   }));

   // Problem type options
   const problemTypeOptions = [
      { value: 'none', label: 'None' },
      { value: 'high_latency', label: 'High Latency' },
      { value: 'packet_drops', label: 'Packet Drops' },
      { value: 'offline', label: 'Offline' }
   ];

   // Find selected options for dropdowns
   const selectedDeviceType = deviceTypeOptions.find(opt => opt.value === formData.type);
   const selectedProblemType = problemTypeOptions.find(opt => opt.value === formData.problemType);

   return (
      <div className="bg-network-lighter border border-network-border-light dark:border dark:border-network-border dark:bg-network-surface rounded-lg p-4 h-fit">
         <h3 className="flex justify-center text-lg font-semibold mb-4 text-network-text-darker dark:text-network-text-light">
            Device Properties
         </h3>

         <div className="space-y-4">
            {/* Device Name */}
            <div>
               <label className="block text-sm font-medium text-network-text-darker dark:text-network-text-light mb-2">
                  Device Name
               </label>
               {isEditing ? (
                  <input
                     type="text"
                     value={formData.name}
                     onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                     className="w-full px-3 py-2 border border-network-border-light dark:border-0 dark:bg-network-gray-light rounded text-network-text-darker dark:text-network-text-light focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
               ) : (
                  <div className="px-3 py-2 border border-network-border-light dark:border-0 dark:bg-network-gray-light rounded text-network-text-darker dark:text-network-text-light">
                     {device.device?.name || device.name}
                  </div>
               )}
            </div>

            {/* Device Type */}
            <div>
               <label className="block text-sm font-medium text-network-text-darker dark:text-network-text-light mb-2">
                  Device Type
               </label>
               {isEditing && !isSimulation ? (
                  <Dropdown
                     selected={selectedDeviceType}
                     options={deviceTypeOptions}
                     onChange={(value) => {
                        const newDeviceConfig = DEVICE_TYPES[value];
                        setFormData({
                           ...formData,
                           type: value,
                           name: newDeviceConfig?.name || value
                        });
                     }}
                     className="w-full"
                     renderSelected={(option) => (
                        <div className="flex items-center gap-2">
                           <option.icon size={20} className="text-blue-400" />
                           <span className="capitalize font-medium">{option.label}</span>
                        </div>
                     )}
                     renderOption={(option) => (
                        <div className="flex items-center gap-2">
                           <option.icon size={20} className="text-blue-400" />
                           <span className="capitalize">{option.label}</span>
                        </div>
                     )}
                  />
               ) : (
                  <div className="flex items-center gap-2 px-3 py-2 border border-network-border-light dark:border-0 dark:bg-network-gray-light rounded text-network-text-darker dark:text-network-text-light">
                     <Icon size={20} className="text-blue-400" />
                     <span className="capitalize font-medium">{deviceType}</span>
                     <span className="ml-auto text-xs text-gray-400">
                        {deviceConfig.name}
                     </span>
                  </div>
               )}
            </div>

            {/* Position */}
            <div>
               <label className="block text-sm font-medium text-network-text-darker dark:text-network-text-light mb-2">
                  Position
               </label>
               <div className="grid grid-cols-2 gap-2">
                  <div className="px-3 py-2 border border-network-border-light dark:border-0 dark:bg-network-gray-light rounded text-network-text-darker dark:text-network-text-light">
                     <span className="text-gray-400 text-xs">X: </span>
                     <span className="font-mono">{device.position.x}px</span>
                  </div>
                  <div className="px-3 py-2 border border-network-border-light dark:border-0 dark:bg-network-gray-light rounded text-network-text-darker dark:text-network-text-light">
                     <span className="text-gray-400 text-xs">Y: </span>
                     <span className="font-mono">{device.position.y}px</span>
                  </div>
               </div>
            </div>

            {/* Parameters */}
            <div>
               <label className="block text-sm font-medium text-network-text-darker dark:text-network-text-light mb-2">
                  Parameters
               </label>
               <div className="space-y-2">
                  {/* Ping Interval - Read Only */}
                  <div className="ps-3 border border-network-border-light dark:border-0 dark:bg-network-gray-light rounded text-network-text-darker dark:text-network-text-light">
                     <div className="flex justify-between items-center">
                        <span className="text-sm text-nowrap my-1">Ping Interval:</span>
                        {!isSimulation ? (<span className="text-blue-400 font-mono">
                           {device.parameters?.pingInterval || 30}s
                        </span>) : (
                           <input type="text" 
                           value={pingInterval}
                           onChange={(e) => setPingInterval(e.target.value)}
                           className='w-full h-full px-4 py-2 text-right border border-network-border-light dark:border-0 dark:bg-network-gray-light rounded text-network-text-darker dark:text-network-text-light focus:outline-none focus:ring-2 focus:ring-blue-400'
                           />
                        )}
                     </div>
                  </div>

                  {/* Latency Threshold */}
                  {isEditing ? (
                     <div>
                        <div className="flex justify-between items-center mb-1 px-1">
                           <span className="text-sm text-network-text-darker dark:text-network-text-light">Latency Threshold:</span>
                        </div>
                        <input
                           type="number"
                           value={formData.latencyThreshold}
                           onChange={(e) => setFormData({ ...formData, latencyThreshold: Number(e.target.value) })}
                           className="w-full px-3 py-2 border border-network-border-light dark:border-0 dark:bg-network-gray-light rounded text-network-text-darker dark:text-network-text-light focus:outline-none focus:ring-2 focus:ring-blue-400"
                           min="0"
                        />
                     </div>
                  ) : (
                     <div className="flex justify-between items-center px-3 border border-network-border-light dark:border-0 dark:bg-network-gray-light rounded p-2 text-network-text-darker dark:text-network-text-light">
                        <span className="text-sm">Latency Threshold:</span>
                        <span className="text-yellow-400 font-mono">
                           {device.parameters?.latencyThreshold || 100}ms
                        </span>
                     </div>
                  )}

                  {/* Failure Probability */}
                  {isEditing ? (
                     <div>
                        <div className="flex justify-between items-center mb-1 px-1">
                           <span className="text-sm text-network-text-darker dark:text-network-text-light">Failure Probability:</span>
                        </div>
                        <input
                           type="number"
                           value={formData.failureProbability}
                           onChange={(e) => setFormData({ ...formData, failureProbability: Number(e.target.value) })}
                           className="w-full px-3 py-2 border border-network-border-light dark:border-0 dark:bg-network-gray-light rounded text-network-text-darker dark:text-network-text-light focus:outline-none focus:ring-2 focus:ring-blue-400"
                           min="0"
                           max="100"
                        />
                     </div>
                  ) : (
                     <div className="flex justify-between items-center px-3 border border-network-border-light dark:border-0 dark:bg-network-gray-light rounded p-2 text-network-text-darker dark:text-network-text-light">
                        <span className="text-sm">Failure Probability:</span>
                        <span className="text-orange-400 font-mono">
                           {device.parameters?.failureProbability || 0}%
                        </span>
                     </div>
                  )}

                  {/* Problem Type */}
                  {!isSimulation && (isEditing ? (
                     <Dropdown
                        label="Problem Type"
                        selected={selectedProblemType}
                        options={problemTypeOptions}
                        onChange={(value) => setFormData({ ...formData, problemType: value })}
                        className="w-full"
                        renderSelected={(option) => (<span className="text-sm">{option.label}</span>)}
                        renderOption={(option) => (<span className="text-sm">{option.label}</span>)}
                     />
                  ) : (
                     <div className="flex justify-between items-center px-3 border border-network-border-light dark:border-0 dark:bg-network-gray-light rounded p-2 text-network-text-darker dark:text-network-text-light">
                        <span className="text-sm">Problem Type:</span>
                        <span className="text-purple-400">{selectedProblemType?.label}</span>
                     </div>
                  ))}

                  {/* Status - Read Only */}
                  <div className="px-3 py-2 border border-network-border-light dark:border-0 dark:bg-network-gray-light rounded text-network-text-darker dark:text-network-text-light">
                     <div className="flex justify-between items-center">
                        <span className="text-sm">Status:</span>
                        <span className={`${device.status?.online ? 'text-network-success' : 'text-network-error'}`}>
                           {device.status?.online ? 'Online' : 'Offline'}
                        </span>
                     </div>
                  </div>
               </div>
            </div>

            {/* Action Buttons */}
            {isEditing ? (
               <div className="flex gap-2">
                  <Button
                     variant=""
                     onClick={handleSaveChanges}
                     className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-network-success hover:bg-network-success/80 text-white rounded-lg transition-colors cursor-pointer"
                     title="Save device properties changes"
                  >
                     {isSimulation ? "Apply" : "Save"}
                  </Button>
                  {!isSimulation && <button
                     variant=""
                     onClick={handleCancel}
                     className="px-3 py-2 bg-network-gray-light hover:bg-network-gray-light/70 text-white rounded-lg transition-colors cursor-pointer"
                     title='Cancel editing device properties'
                  >
                     Cancel
                  </button>}
               </div>
            ) : (
               <>
                  <Button
                     variant=""
                     onClick={handleStartEdit}
                     className="w-full flex items-center justify-center gap-2 px-3 py-2 border border-network-border-light dark:border-0 dark:bg-network-gray-light rounded-lg transition-colors text-network-text-darker dark:text-network-text-light hover:bg-gray-100 dark:hover:bg-network-border cursor-pointer"
                     title="Edit device properties"
                  >
                     <Edit3 size={16} />
                     Edit Properties
                  </Button>

                  <Button
                     variant=""
                     onClick={() => onDeleteDevice(device._id)}
                     className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-red-400 hover:bg-red-500 text-white rounded-lg transition-colors cursor-pointer"
                     title="Delete device from scenario"
                  >
                     <Trash2 size={16} />
                     Delete Device
                  </Button>
               </>
            )}
         </div>
      </div>
   );
};