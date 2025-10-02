import React, { useState } from 'react';
import { Check, Edit3, Trash2 } from 'lucide-react';
import { DEVICE_TYPES } from '../../../constants';
import { Button } from '../../../components';

export const DeviceProperties = ({
   device,
   onUpdateDevice,
   onDeleteDevice
}) => {
   const [isEditingName, setIsEditingName] = useState(false);
   const [tempName, setTempName] = useState(device.device?.name || device.name || '');

   const handleSaveName = () => {
      if (!tempName.trim()) return;

      onUpdateDevice(device._id, {
         device: {
            ...device.device,
            name: tempName.trim()
         }
      });
      setIsEditingName(false);
   };

   const handleStartEdit = () => {
      setIsEditingName(true);
      setTempName(device.device?.name || device.name || '');
   };

   const deviceType = device.device?.type || device.type;
   const deviceConfig = DEVICE_TYPES[deviceType];

   if (!deviceConfig) return null;

   const Icon = deviceConfig.icon;

   return (
      <div className="bg-network-lighter border border-network-border-light dark:bordr dark:border-network-border dark:bg-network-surface rounded-lg p-4 h-fit">
         <h3 className="text-lg font-semibold mb-4 text-network-text-darker dark:text-network-text-light">
            Selected Device Properties
         </h3>

         <div className="space-y-4">
            {/* Device Name */}
            <div>
               <label className="block text-sm font-medium text-network-text-darker dark:text-network-text-light mb-2">
                  Device Name
               </label>
               {isEditingName ? (
                  <div className="flex gap-2">
                     <input
                        type="text"
                        value={tempName}
                        onChange={(e) => setTempName(e.target.value)}
                        className="flex-1 px-3 py-2 border border-network-border-light dark:border-0 dark:bg-network-gray-light rounded p-2 text-network-text-darker dark:text-network-text-light focus:outline-none focus:ring-2 focus:ring-blue-400"
                        onKeyPress={(e) => e.key === 'Enter' && handleSaveName()}
                        onBlur={handleSaveName}
                        autoFocus
                     />
                     <Button
                        title="Save name"
                        variant='success'
                        onClick={handleSaveName}
                        className="px-3 py-2 rounded-lg transition-colors"
                     >
                        <Check size={16} />
                     </Button>
                  </div>
               ) : (
                  <div className="flex items-center gap-2">
                     <span className="flex-1 px-3 border border-network-border-light dark:border-0 dark:bg-network-gray-light rounded p-2 text-network-text-darker dark:text-network-text-light">
                        {device.device?.name || device.name}
                     </span>
                     <Button
                        variant=''
                        onClick={handleStartEdit}
                        className="px-3 py-2 rounded-lg transition-colors border border-network-border-light dark:border-0 dark:bg-network-gray-light rounded p-2 text-network-text-darker dark:text-network-text-light outline-none focus:ring-0"
                        title="Edit name"
                     >
                        <Edit3 size={16} />
                     </Button>
                  </div>
               )}
            </div>

            {/* Device Type */}
            <div>
               <label className="block text-sm font-medium text-network-text-darker dark:text-network-text-light mb-2">
                  Device Type
               </label>
               <div className="flex items-center gap-2 px-3 border border-network-border-light dark:border-0 dark:bg-network-gray-light rounded p-2 text-network-text-darker dark:text-network-text-light">
                  <Icon size={20} className="text-blue-400" />
                  <span className="capitalize font-medium">{deviceType}</span>
                  <span className="ml-auto text-xs text-gray-400">
                     {deviceConfig.name}
                  </span>
               </div>
            </div>

            {/* Position */}
            <div>
               <label className="block text-sm font-medium text-network-text-darker dark:text-network-text-light mb-2">
                  Position
               </label>
               <div className="grid grid-cols-2 gap-2">
                  <div className="px-3 border border-network-border-light dark:border-0 dark:bg-network-gray-light rounded p-2 text-network-text-darker dark:text-network-text-light">
                     <span className="text-gray-400 text-xs">X: </span>
                     <span className="font-mono">{device.position.x}px</span>
                  </div>
                  <div className="px-3 border border-network-border-light dark:border-0 dark:bg-network-gray-light rounded p-2 text-network-text-darker dark:text-network-text-light">
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
                  <div className="flex justify-between items-center px-3 border border-network-border-light dark:border-0 dark:bg-network-gray-light rounded p-2 text-network-text-darker dark:text-network-text-light">
                     <span className="text-sm">Ping Interval:</span>
                     <span className="text-blue-400 font-mono">
                        {device.parameters?.pingInterval || 30}s
                     </span>
                  </div>
                  <div className="flex justify-between items-center px-3 border border-network-border-light dark:border-0 dark:bg-network-gray-light rounded p-2 text-network-text-darker dark:text-network-text-light">
                     <span className="text-sm">Latency Threshold:</span>
                     <span className="text-yellow-400 font-mono">
                        {device.parameters?.latencyThreshold || 100}ms
                     </span>
                  </div>
                  <div className="flex justify-between items-center px-3 border border-network-border-light dark:border-0 dark:bg-network-gray-light rounded p-2 text-network-text-darker dark:text-network-text-light">
                     <span className="text-sm">Status:</span>
                     <span className={`font-medium ${device.status?.online ? 'text-green-400' : 'text-red-400'
                        }`}>
                        {device.status?.online ? 'Online' : 'Offline'}
                     </span>
                  </div>
               </div>
            </div>

            {/* Delete Button */}
            <button
               onClick={() => onDeleteDevice(device._id)}
               className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-red-400 hover:bg-red-500 rounded-lg transition-colors cursor-pointer"
            >
               <Trash2 size={16} />
               Delete Device
            </button>
         </div>
      </div>
   );
};
