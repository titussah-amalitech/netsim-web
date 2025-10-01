import { DEVICE_TYPES } from "../../constants";

export const Device = ({ type, isSelected, size = 'w-20 h-20' }) => {
   const device = DEVICE_TYPES[type];
   if (!device) return null;

   const Icon = device.icon;

   return (
      <div className="flex flex-col items-center space-y-2">
         {/* Active circular indicator container */}
         <div
            className={`${size} flex items-center justify-center rounded-full shadow-lg`}
            style={{ backgroundColor: device.bgColor, color: device.color }}
         >
            <Icon size={36} />
         </div>

         {/* Device name */}
         {!isSelected && <span className="text-sm font-semibold text-network-text-darker dark:text-gray-300">{device.name}</span>}
      </div>
   );
};