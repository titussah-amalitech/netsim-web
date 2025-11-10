import React from "react";
import { CgDanger } from "react-icons/cg";
import { CiWarning } from "react-icons/ci";
import { SiTicktick } from "react-icons/si";
import { GoStack } from "react-icons/go";

const StatCard = ({ icon: Icon, colorClass, label, value }) => (
  <div className="flex dark:bg-network-surface border dark:border-gray-600 p-4 rounded items-center">
    <Icon size={24} className={`${colorClass} mr-2`} />
    <p className="dark:text-network-light font-bold text-nowrap">
      {label}: {value}
    </p>
  </div>
);

// Displays overall game statistics (device states)
export const GameStats = ({ nodes }) => {
  const offlineCount = nodes.filter(
    (node) => node.data.device.parameters.latencyThreshold > 100
  ).length;

  const highLatencyCount = nodes.filter(
    (node) =>
      node.data.device.parameters.latencyThreshold > 50 &&
      node.data.device.parameters.latencyThreshold <= 100
  ).length;

  const onlineCount = nodes.filter(
    (node) => node.data.device.parameters.latencyThreshold <= 50
  ).length;

  const totalCount = nodes.length;

  return (
    <div className="flex flex-wrap gap-2 ms-auto">
      <StatCard
        icon={CgDanger}
        colorClass="text-red-500"
        label="Offline"
        value={offlineCount}
      />
      <StatCard
        icon={CiWarning}
        colorClass="text-yellow-500"
        label="High Latency"
        value={highLatencyCount}
      />
      <StatCard
        icon={SiTicktick}
        colorClass="text-green-500"
        label="Online"
        value={onlineCount}
      />
      <StatCard
        icon={GoStack}
        colorClass="text-network-primary"
        label="All"
        value={totalCount}
      />
    </div>
  );
};
