import { Move } from 'lucide-react';
import { Device } from '../../../components/common/Device';
import { DEVICE_TYPES } from '../../../constants';
import { Button } from '../../../components';

export const ToolPalette = ({ devices = [], selectedTool, onToolSelect }) => {
  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <h2 className="text-lg font-semibold mb-4">Devices</h2>

      <div className="grid grid-cols-2 gap-3">
        {/* Select Tool */}
        <button
          variant=''
          aria-label="Select Tool"
          onClick={() => onToolSelect("select")}
          className={`p-3 rounded-lg flex items-center justify-center gap-2 transition-colors ${selectedTool === "select"
            ? 'bg-blue-600 hover:bg-blue-700'
            : 'bg-gray-700 hover:bg-gray-600'
            }`}
        >
          <Move size={18} />
          Select
        </button>

        {/* Server Devices */}
        {devices.map((device) => {
          const config = DEVICE_TYPES[device.type];
          if (!config) return null;

          return (
            <button
              key={device._id}
              onClick={() => onToolSelect(device)}
              className={`p-3 rounded-lg flex items-center justify-center transition-colors ${selectedTool._id === device._id
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-gray-700 hover:bg-gray-600'
                }`}
              aria-label={device.name || config.name}
            >
              <div
                style={{
                  transform: 'scale(0.5)',
                  transformOrigin: 'center',
                }}
              >
                <Device
                  type={device.type}
                  isSelected={true}
                  size="w-10 h-10"
                  showLabel={false}
                />
              </div>
              <span className="text-sm mr-2">{device.name || config.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
