import React, { useState, useCallback, useEffect } from 'react';
import { CiWarning } from "react-icons/ci";
import { CgDanger } from "react-icons/cg";
import { SiTicktick } from "react-icons/si";
import { GoStack } from "react-icons/go";
import ReactFlow, {
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
} from 'reactflow';
import 'reactflow/dist/style.css';
import CountdownTimer from './CountDown';
import { DeviceNode } from '../../../components/common/DeviceNode';
import { TEST_SCENARIO, officeNetworkScenario} from '../constants';
import { Button, Device, Modal } from '../../../components';
import { DEVICE_TYPES } from '../../../constants';
import { useScenario } from '../../scenario-management/hooks/useScenario';
import { useDispatch } from 'react-redux';
import { setSelectedScenario } from '../../scenario-management/store/scenario.slice';
import Form from '../../../components/common/Form';
import { useMemo } from "react";
const nodeTypes = { deviceNode: DeviceNode };

const GameSimulationEnvironment = ({ scenario }) => {
const [deviceToEdit, setDeviceToEdit] = useState(null);
const dispatch = useDispatch();
  // Nodes 
const [currentScenario, setCurrentScenario] = useState(scenario || officeNetworkScenario);
const { updateDevice, } = useScenario()

// helper to create a React Flow node from a device object
const createNodeFromDevice = (device) => ({
  id: device._id,
  type: 'deviceNode',
  position: { x: device.position.x, y: device.position.y },
  data: {
    label: (
      <div
        className={`
          p-2 rounded font-medium text-sm text-white text-center rounded-full
          ${
            device.parameters.pingInterval > 100 || device.parameters.failureProbability > 0.5
            ? "bg-red-500"
            : device.parameters.latencyThreshold > 50
            ? "bg-yellow-400 text-black"
            : "bg-green-500"
          }
        `}
        onClick={() => setDeviceToEdit(device)}
      >
        {device.device.type === 'router' && <DEVICE_TYPES.router.icon size={24} />}
        {device.device.type === 'switch' && <DEVICE_TYPES.switch.icon size={24} />}
        {device.device.type === 'server' && <DEVICE_TYPES.server.icon size={24} />}
        {device.device.type === 'pc' && <DEVICE_TYPES.pc.icon size={24} />}
        {device.device.type === 'firewall' && <DEVICE_TYPES.firewall.icon size={24} />}
        {device.device.type === 'internet' && <DEVICE_TYPES.internet.icon size={24} />}
        {device.device.type === 'cloud Service' && <DEVICE_TYPES.cloud.icon size={24} />}
        {device.device.type === 'database' && <DEVICE_TYPES.database.icon size={24} />}
        {device.device.type === 'accessPoint' && <DEVICE_TYPES.accessPoint.icon size={24} />}
      </div>
    ),
    color: device.parameters.pingInterval > 100 || device.parameters.failureProbability > 0.5
            ? "border-red-500"
            : device.parameters.latencyThreshold > 50
            ? "border-yellow-400 text-black"
            : "border-green-500",
    device,
  },
  sourcePosition: 'right',
  targetPosition: 'left',
  draggable: true,
});

// local nodes state is used purely for ReactFlow interaction (dragging, etc.).
// Keep it in sync with the canonical scenario devices below.
const [nodes, setNodes] = useState(() => currentScenario.devices.map(createNodeFromDevice));

// Whenever the canonical scenario changes (devices updated elsewhere), rebuild nodes
// so the React Flow view reflects the latest device properties.
useEffect(() => {
  setNodes(currentScenario.devices.map(createNodeFromDevice));
}, [currentScenario]);

  // Edges 
  // const edges = 
  //   currentScenario.devices.flatMap((device) =>
  //     device?.connections?.map((targetId) => ({
  //       id: `e${device._id}-${targetId}`,
  //       source: device._id,
  //       target: targetId,
  //       animated: true,
  //       style: {
  //         stroke: nodes.find(n => n.id === device._id)?.data.device.status.online === false ? "#ef4444" :
  //                nodes.find(n => n.id === device._id)?.data.device.status.latency > 50 ? "#eab308" : "#16a34a", 
  //           // !device.status.online
  //           //   ? "#ef4444" // red
  //           //   : device.status.latency > 50
  //           //   ? "#eab308" // yellow
  //           //   : "#16a34a", // green (default)
  //         strokeWidth: 5,
          
  //       },
  //     }))
  //   )


  // Handlers 
  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  // const onEdgesChange = useCallback(
  //   (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
  //   []
  // );

  // const onConnect = useCallback(
  //   (params) => setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: '#16a34a', strokeWidth: 2 } }, eds)),
  //   []
  // );


  // Helper to build the label JSX for a device (keeps logic consistent with
  // initial node creation)
  const buildLabel = (device) => (
    <div
      className={`
        p-2 rounded font-medium text-sm text-white text-center rounded-full
        ${
          device.parameters.pingInterval > 100 || device.parameters.failureProbability > 0.5
            ? "bg-red-500"
            : device.parameters.latencyThreshold > 50
            ? "bg-yellow-400 text-black"
            : "bg-green-500"
        }
      `}
      onClick={() => setDeviceToEdit(device)}
    >
      {console.log('Rendering label for device:', device)}
      {device.device.type === "router" && <DEVICE_TYPES.router.icon size={24} />}
      {device.device.type === "switch" && <DEVICE_TYPES.switch.icon size={24} />}
      {device.device.type === "server" && <DEVICE_TYPES.server.icon size={24} />}
      {device.device.type === "pc" && <DEVICE_TYPES.pc.icon size={24} />}
      {device.device.type === "firewall" && <DEVICE_TYPES.firewall.icon size={24} />}
      {device.device.type === "internet" && <DEVICE_TYPES.internet.icon size={24} />}
      {device.device.type === "cloud Service" && <DEVICE_TYPES.cloud.icon size={24} />}
      {device.device.type === "database" && <DEVICE_TYPES.database.icon size={24} />}
      {device.device.type === "accessPoint" && <DEVICE_TYPES.accessPoint.icon size={24} />}
    </div>
  );

  // Apply updates coming from DeviceProperties. DeviceProperties will call
  // onUpdateDevice(deviceId, updates). We must accept these args so updates
  // are applied correctly and our local `nodes` state is kept in sync.
  const handleApplyDeviceChanges = (deviceId, updates) => {
  if (!deviceId || !updates) return;

  // Update the canonical scenario
  setCurrentScenario((prevScenario) => ({
    ...prevScenario,
    devices: prevScenario.devices.map((dev) =>
      dev._id === deviceId
        ? {
            ...dev,
            ...updates,
            device: { ...dev.device, ...(updates.device || {}) },
            parameters: { ...dev.parameters, ...(updates.parameters || {}) },
            status: { ...dev.status, ...(updates.status || {}) },
          }
        : dev
    ),
  }));

  // Update local nodes - create completely new objects to force re-render
  setNodes((prev) =>
    prev.map((node) => {
      if (node.id !== deviceId) return node;
      
      const updatedDevice = {
        ...node.data.device,
        ...updates,
        parameters: { ...node.data.device.parameters, ...(updates.parameters || {}) },
        status: { ...node.data.device.status, ...(updates.status || {}) },
      };
      
      console.log('Updated Device:', updatedDevice);
      console.log('Updated Device Status:', updatedDevice.status);
      console.log('Updates Applied:', updates);
      
      return {
        ...node,
        data: {
          ...node.data,
          device: updatedDevice,
          label: buildLabel(updatedDevice),
          color: updatedDevice.parameters.latencyThreshold > 100 || updatedDevice.parameters.failureProbability > 0.5
            ? 'border-red-500'
            : updatedDevice.parameters.latencyThreshold > 50
            ? 'border-yellow-400 text-black'
            : 'border-green-500',
        },
      };
    })
  );

  setDeviceToEdit(null);
};


  const edges = useMemo(() => {
    return currentScenario.devices.flatMap((device) =>
      device?.connections?.map((targetId) => ({
        id: `e${device._id}-${targetId}`,
        source: device._id,
        target: targetId,
        animated: true,
        style: {
          stroke:
            nodes.find((n) => n.id === device._id)?.data.device.parameters.latencyThreshold >100 || nodes.find((n) => n.id === device._id)?.data.device.parameters.failureProbability > 0.5
              ? "#ef4444"
              : nodes.find((n) => n.id === device._id)?.data.device.parameters.latencyThreshold > 50
              ? "#eab308"
              : "#16a34a",
          strokeWidth: 5,
        },
      }))
    );
  }, [currentScenario.devices]);


  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-wrap gap-2 ms-auto">
        <div className="flex dark:bg-network-surface border dark:border-gray-600 p-4 rounded items-center">
          <CgDanger size={24} className="text-red-500 mr-2" />
          <p className="dark:text-network-light font-bold text-nowrap">Offline: {nodes.filter(node => !node.data.device.status.online).length}</p>
        </div>
        <div className="flex dark:bg-network-surface border dark:border-gray-600 p-4 rounded items-center">
          <CiWarning size={24} className="text-yellow-500 mr-2" />
          <p className="dark:text-network-light font-bold text-nowrap">High Latency: {nodes.filter(node => node.data.device.status.latency > 50).length}</p>
        </div>
        <div className="flex dark:bg-network-surface border dark:border-gray-600 p-4 rounded items-center">
          <SiTicktick size={24} className="text-green-500 mr-2" />
          <p className="dark:text-network-light font-bold text-nowrap">Online: {nodes.filter(node => node.data.device.status.online && node.data.device.status.latency <= 50).length}</p>
        </div>
        <div className="flex dark:bg-network-surface border dark:border-gray-600 p-4 rounded items-center">
          <GoStack size={24} className="text-network-primary mr-2" />
          <p className="dark:text-network-light font-bold text-nowrap">All: {nodes.length}</p>
        </div>
      </div>

      {/* === React Flow Canvas === */}
      <div className="flex justify-between items-center  border-gray-600 p-4 border bg-network-surface rounded-t mt-2 border-gray-600">
            <p className='text-xl dark:text-network-light font-bold'>Your Score: 500</p>
            
            <CountdownTimer initialTime={300} isRunning={true} className="mb-2 dark:text-network-light" />
      </div>
      <Modal isOpen={deviceToEdit !== null}
             title={"Adjust Device Parameters"}
             onClose={() => setDeviceToEdit(null)}
      >
       {deviceToEdit && <Form
          onSubmit={(e) => {
            e.preventDefault();
            handleApplyDeviceChanges(deviceToEdit._id, {
              parameters: deviceToEdit.parameters,
              status: deviceToEdit.status,
              // Include other properties that might have changed
            }); // calls your simulation apply handler
          }}
          className="space-y-3 mt-2"
        >
          {/* 🔹 Ping Interval Field */}
          <div>
            <label className="block text-sm font-medium text-network-text-darker dark:text-network-text-light mb-1">
              Ping Interval (s)
            </label>
            <input
              type="number"
              value={deviceToEdit.parameters.pingInterval}
              onChange={(e) => setDeviceToEdit(prev => ({
                ...prev,
                parameters: { ...(prev.parameters || {}), pingInterval: Number(e.target.value) }
              }))}
              className="w-full px-3 py-2 border border-network-border-light dark:border-0 dark:bg-network-gray-light
                        rounded text-network-text-darker dark:text-network-text-light focus:outline-none
                        focus:ring-2 focus:ring-blue-400"
              min="1"
            />
          </div>

          {/* 🔹 Latency */}
          <div>
            <label className="block text-sm font-medium text-network-text-darker dark:text-network-text-light mb-1">
              Latency (ms)
            </label>
            <input
              type="number"
              value={deviceToEdit.parameters.latencyThreshold}
              onChange={(e) => setDeviceToEdit(prev => ({
                ...prev,
                parameters: { ...(prev.parameters || {}), latencyThreshold: Number(e.target.value) }
              }))}
              className="w-full px-3 py-2 border border-network-border-light dark:border-0 dark:bg-network-gray-light
                        rounded text-network-text-darker dark:text-network-text-light focus:outline-none
                        focus:ring-2 focus:ring-blue-400"
              min="0"
            />
          </div>

          {/* 🔹 Failure Probability */}
          <div>
            <label className="block text-sm font-medium text-network-text-darker dark:text-network-text-light mb-1">
              Failure Probability (%)
            </label>
            <input
              type="number"
              value={(deviceToEdit.parameters.failureProbability || 0) * 100}
              onChange={(e) => setDeviceToEdit(prev => ({
                ...prev,
                parameters: { ...(prev.parameters || {}), failureProbability: Number(e.target.value) / 100 }
              }))}
              className="w-full px-3 py-2 border border-network-border-light dark:border-0 dark:bg-network-gray-light
                        rounded text-network-text-darker dark:text-network-text-light focus:outline-none
                        focus:ring-2 focus:ring-blue-400"
              min="0"
              max="100"
            />
          </div>

          {/* 🔹 Device Status (read-only) */}
          <div>
            <label className="block text-sm font-medium text-network-text-darker dark:text-network-text-light mb-1">
              Status
            </label>
            <div
              className={`px-3 py-2 border border-network-border-light dark:border-0 dark:bg-network-gray-light
                          rounded text-network-text-darker dark:text-network-text-light ${
                            deviceToEdit.status?.online ? 'text-network-success' : 'text-network-error'
                          }`}
            >
              {deviceToEdit.status?.online ? 'Online' : 'Offline'}
            </div>
          </div>

          {/* 🔹 Submit Button */}
          <Button
            type="submit"
            variant=""
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-network-success
                      hover:bg-network-success/80 text-white rounded-lg transition-colors cursor-pointer"
          >
            Apply
          </Button>
        </Form>}
      </Modal>
      <div className="h-[600px]  border-t-0 w-full border border-gray-600  rounded-b bg-network-surface">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          // onEdgesChange={onEdgesChange}
          // onConnect={onConnect}
          nodeTypes={nodeTypes}
          nodesDraggable
          fitView

        >
          <Background  />
        </ReactFlow>
      </div>
    </div>
  );
};

export default GameSimulationEnvironment;
