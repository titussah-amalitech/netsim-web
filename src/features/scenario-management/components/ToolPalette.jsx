import { Move } from 'lucide-react';
import { Device } from '../../../components/common/Device';
import { DEVICE_TYPES } from '../../../constants';
import { Button } from '../../../components';

export const ToolPalette = ({ devices = [], selectedTool, onToolSelect }) => {
  return (
    <div className="bg-network-lighter border border-network-border-light dark:bordr dark:border-network-border dark:bg-network-surface rounded-lg p-4">
      <h2 className="text-lg font-semibold mb-4 text-network-text-darker dark:text-network-text-light">Devices</h2>

      <div className="grid grid-cols-2 gap-3">
        {/* Select Tool */}
        <Button
          variant=''
          title="Select Tool"
          onClick={() => onToolSelect("select")}
          className={`p-3 rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer ${selectedTool === "select"
            ? 'bg-network-primary dark:bg-blue-600 hover:bg-blue-700'
            : 'bg-network-lighter border border-network-border-light dark:border-0 dark:bg-network-gray-light dark:bg-network-gray-light dark:hover:bg-gray-600 text-network-text-darker dark:text-network-text-light'
            }`}
        >
          <Move size={18} />
          Select
        </Button>

        {/* Server Devices */}
        {devices.map((device) => {
          const config = DEVICE_TYPES[device.type];
          if (!config) return null;

          return (
            <Button
              variant=''
              key={device._id}
              onClick={() => onToolSelect(device)}
              className={`p-3 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${selectedTool._id === device._id
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-network-lighter border border-network-border-light dark:border-0 dark:bg-network-gray-light dark:bg-network-gray-light dark:hover:bg-gray-600 text-network-text-darker dark:text-network-text-light'
                }`}
              title={device.name || config.name}
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
            </Button>
          );
        })}
      </div>
    </div>
  );
};
