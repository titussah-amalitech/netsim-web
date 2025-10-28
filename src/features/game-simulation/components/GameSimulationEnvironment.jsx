import React, { useState, useCallback } from 'react';
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
import { Device, Modal } from '../../../components';
import { DEVICE_TYPES } from '../../../constants';
import { DeviceProperties } from '../../scenario-management/components';
const nodeTypes = { deviceNode: DeviceNode };

const GameSimulationEnvironment = ({ scenario }) => {
const [deviceToEdit, setDeviceToEdit] = useState(null);
  // Nodes 
  const currentScenario = scenario || officeNetworkScenario;
const [nodes, setNodes] = useState(
  currentScenario.devices.map((device) => ({
      id: device._id, // use "id" instead of "_id"
      type: "deviceNode", // custom ReactFlow node type
      position: { x: device.position.x, y: device.position.y },
      data: {
        label: (
          <div
            className={`
              p-2 rounded font-medium text-sm text-white text-center rounded-full
              ${
                !device.status.online
                  ? "bg-red-500"
                  : device.status.latency > 50
                  ? "bg-yellow-400 text-black"
                  : "bg-green-500"
              }
            `}
            onClick={() => setDeviceToEdit(device)}
          >
            {device.device.type === "router" && <DEVICE_TYPES.router.icon  size={24}/>}
            {device.device.type === "switch" && <DEVICE_TYPES.switch.icon  size={24}/>}
            {device.device.type === "server" && <DEVICE_TYPES.server.icon  size={24}/>}
            {device.device.type === "pc" && <DEVICE_TYPES.pc.icon  size={24}/>}
            {device.device.type === "firewall" && <DEVICE_TYPES.firewall.icon  size={24}/>}
            {device.device.type === "internet" && <DEVICE_TYPES.internet.icon  size={24}/>}
            {device.device.type === "cloud Service" && <DEVICE_TYPES.cloud.icon  size={24}/>}
            {device.device.type === "database" && <DEVICE_TYPES.database.icon  size={24}/>}
            {device.device.type === "accessPoint" && <DEVICE_TYPES.accessPoint.icon  size={24}/>}
            
          </div>
        ),
        color: !device.status.online ? "border-red-500": device.status.latency > 50 ? "border-yellow-400 text-black" : "border-green-500",
        device, // pass the entire device object for later logic (optional)
      },
      sourcePosition: "right",
      targetPosition: "left",
      draggable: true,
    }))
  );

  // Edges 
  const [edges, setEdges] = useState(
    currentScenario.devices.flatMap((device) =>
      device?.connections.map((targetId) => ({
        id: `e${device._id}-${targetId}`,
        source: device._id,
        target: targetId,
        animated: true,
        style: {
          stroke:
            !device.status.online
              ? "#ef4444" // red
              : device.status.latency > 50
              ? "#eab308" // yellow
              : "#16a34a", // green (default)
          strokeWidth: 2,
        },
      }))
    )
  );

  // Handlers 
  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: '#16a34a', strokeWidth: 2 } }, eds)),
    []
  );

  

  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-wrap gap-2 ms-auto">
        <div className="flex dark:bg-network-surface border dark:border-gray-600 p-4 rounded items-center">
          <CgDanger size={24} className="text-red-500 mr-2" />
          <p className="dark:text-network-light font-bold text-nowrap">Offline: {nodes.filter(dev => !dev.data.device.status.online).length}</p>
        </div>
        <div className="flex dark:bg-network-surface border dark:border-gray-600 p-4 rounded items-center">
          <CiWarning size={24} className="text-yellow-500 mr-2" />
          <p className="dark:text-network-light font-bold text-nowrap">High Latency: {nodes.filter(dev => dev.data.device.status.latency > 50).length}</p>
        </div>
        <div className="flex dark:bg-network-surface border dark:border-gray-600 p-4 rounded items-center">
          <SiTicktick size={24} className="text-green-500 mr-2" />
          <p className="dark:text-network-light font-bold text-nowrap">Online: {nodes.filter(dev => dev.data.device.status.online && dev.data.device.status.latency <= 50).length}</p>
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
        <DeviceProperties device={deviceToEdit} isEditingMode={true} isSimulation={true}/>
      </Modal>
      <div className="h-[600px]  border-t-0 w-full border border-gray-600  rounded-b bg-network-surface">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
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
