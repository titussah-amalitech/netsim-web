import { CgDanger } from "react-icons/cg";
import { CiWarning } from "react-icons/ci";
import { SiTicktick } from "react-icons/si";
import { GoStack } from "react-icons/go";

//  Stat card 
const StatCard = ({ icon: Icon, iconClass, label, value }) => (
  <div className="flex dark:bg-network-surface border dark:border-gray-600 p-4 rounded items-center">
    <Icon size={24} className={`${iconClass} mr-2`} />
    <p className="dark:text-network-light font-bold text-nowrap">
      {label}: {value}
    </p>
  </div>
);

// Summary component
export const GameStats = ({ nodes }) => {
  const offlineCount = nodes.filter(node => !node.data.device.deviceStatus?.online).length;
  const highLatencyCount = nodes.filter(
    node => node.data.device.deviceStatus?.online && node.data.device.deviceStatus.latency > 50
  ).length;

  const onlineCount = nodes.filter(node => node.data.device.deviceStatus?.online).length;
  const totalCount = nodes.length;

  return (
    <div className="flex flex-wrap gap-2 ms-auto">
      <StatCard
        icon={CgDanger}
        iconClass="text-red-500"
        label="Offline"
        value={offlineCount}
      />
      <StatCard
        icon={CiWarning}
        iconClass="text-yellow-500"
        label="High Latency"
        value={highLatencyCount}
      />
      <StatCard
        icon={SiTicktick}
        iconClass="text-green-500"
        label="Online"
        value={onlineCount}
      />
      <StatCard
        icon={GoStack}
        iconClass="text-network-primary"
        label="All"
        value={totalCount}
      />
    </div>
  );
};
