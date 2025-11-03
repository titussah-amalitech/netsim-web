import React from "react";
import { Handle, Position } from "reactflow";

export const DeviceNode = ({ data }) => {
  return (
    <div className={`bg-network-light dark:bg-network-surface border ${data.color} text-center rounded-full p-2 shadow-md`}>
      {/* this is your node content */}
      <div className="font-medium text-sm text-gray-800 dark:text-network-light rounded-full">
        {data.label || "Device"}
      </div>

      {/*  Add handles to enable dragging connections */}
      <Handle
        type="target"
        position={Position.Left}
        className="!bg-blue-500 w-3 h-3"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!bg-green-500 w-3 h-3"
      />
    </div>
  );
};
