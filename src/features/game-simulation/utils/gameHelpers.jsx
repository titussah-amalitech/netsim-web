import React from 'react';
import { DEVICE_TYPES } from '../../../constants';

/**
 * Creates a ReactFlow node from a device object
 */
export const createNodeFromDevice = (device, setDeviceToEdit) => ({
  id: device._id,
  type: 'deviceNode',
  position: { x: device.position.x, y: device.position.y },
  data: {
    label: buildDeviceLabel(device, setDeviceToEdit),
    color: getDeviceColor(device.parameters.latencyThreshold),
    device,
  },
  sourcePosition: 'right',
  targetPosition: 'left',
  draggable: true,
});

/**
 * Builds the label JSX for a device node
 */
export const buildDeviceLabel = (device, setDeviceToEdit) => (
  <div
    className={`
      p-2 font-medium text-sm text-white text-center rounded-full
      ${getDeviceBackgroundColor(device.parameters.latencyThreshold)}
    `}
    onClick={() => setDeviceToEdit(device)}
  >
    {renderDeviceIcon(device.device.type)}
  </div>
);

/**
 * Renders the appropriate icon for a device type
 */
export const renderDeviceIcon = (deviceType) => {
  const iconMap = {
    router: DEVICE_TYPES.router.icon,
    switch: DEVICE_TYPES.switch.icon,
    server: DEVICE_TYPES.server.icon,
    pc: DEVICE_TYPES.pc.icon,
    firewall: DEVICE_TYPES.firewall.icon,
    internet: DEVICE_TYPES.internet.icon,
    'cloud Service': DEVICE_TYPES.cloud.icon,
    database: DEVICE_TYPES.database.icon,
    accessPoint: DEVICE_TYPES.accessPoint.icon,
  };

  const IconComponent = iconMap[deviceType];
  return IconComponent ? <IconComponent size={24} /> : null;
};

/**
 * Gets the border color class based on latency threshold
 */
export const getDeviceColor = (latencyThreshold) => {
  if (latencyThreshold > 100) return 'border-red-500';
  if (latencyThreshold > 50 && latencyThreshold <= 100) return 'border-yellow-400 text-black';
  return 'border-green-500';
};

/**
 * Gets the background color class based on latency threshold
 */
export const getDeviceBackgroundColor = (latencyThreshold) => {
  if (latencyThreshold > 100) return 'bg-red-500';
  if (latencyThreshold > 50 && latencyThreshold <= 100) return 'bg-yellow-400 text-black';
  return 'bg-green-500';
};

/**
 * Generates edges for the ReactFlow diagram based on device connections
 */
export const generateEdges = (devices, nodes) => {
  return devices.flatMap((device) =>
    device?.connections?.map((targetId) => ({
      id: `e${device._id}-${targetId}`,
      source: device._id,
      target: targetId,
      animated: true,
      style: {
        stroke: getEdgeColor(
          nodes.find((n) => n.id === device._id)?.data.device.parameters.latencyThreshold
        ),
        strokeWidth: 5,
      },
    }))
  );
};

/**
 * Gets the edge color based on latency threshold
 */
const getEdgeColor = (latencyThreshold) => {
  if (latencyThreshold > 100) return '#ef4444';
  if (latencyThreshold > 50 && latencyThreshold <= 100) return '#eab308';
  return '#16a34a';
};

/**
 * Triggers a random issue on a random device
 */
export const createRandomIssue = (devices) => {
  if (!devices || devices.length === 0) return null;

  const randomIndex = Math.floor(Math.random() * devices.length);
  const randomDevice = devices[randomIndex];
  const newLatency = randomDevice.parameters.latencyThreshold + Math.floor(Math.random() * 100 + 50);

  const updatedDevice = {
    ...randomDevice,
    parameters: {
      ...randomDevice.parameters,
      latencyThreshold: newLatency,
    },
    deviceStatus: {
      online: newLatency > 50 ? false : true,
      latency: newLatency,
      ...randomDevice.deviceStatus,
    },
  };

  return {
    updatedDevice,
    newLatency,
    deviceId: randomDevice._id,
  };
};

/**
 * Updates a device node with new properties
 */
export const updateDeviceNode = (node, deviceId, updatedDevice, buildLabelFn) => {
  if (node.id !== deviceId) return node;

  return {
    ...node,
    data: {
      ...node.data,
      device: updatedDevice,
      label: buildLabelFn(updatedDevice),
      color: getDeviceColor(updatedDevice.parameters.latencyThreshold),
    },
  };
};