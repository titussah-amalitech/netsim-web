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
import { TEST_SCENARIO } from '../constants';
const nodeTypes = { deviceNode: DeviceNode };

const GameSimulationEnvironment = () => {

  // === Nodes ===
const [nodes, setNodes] = useState(
  TEST_SCENARIO.devices.map((device) => ({
      id: device.id, // use "id" instead of "_id"
      type: "deviceNode", // custom ReactFlow node type
      position: { x: device.location.x, y: device.location.y },
      data: {
        label: (
          <div
            className={`
              p-2 rounded font-medium text-sm text-white text-center rounded-full
              ${
                device.status === "red"
                  ? "bg-red-500"
                  : device.status === "yellow"
                  ? "bg-yellow-400 text-black"
                  : "bg-green-500"
              }
            `}
          >
            {<  device.icon  size={24}/>}
          </div>
        ),
        device, // pass the entire device object for later logic (optional)
      },
      sourcePosition: "right",
      targetPosition: "left",
      draggable: true,
    }))
  );

  // === Edges ===
  const [edges, setEdges] = useState(
    TEST_SCENARIO.devices.flatMap((device) =>
      device.connections.map((targetId) => ({
        id: `e${device.id}-${targetId}`,
        source: device.id,
        target: targetId,
        animated: true,
        style: {
          stroke:
            device.status === "red"
              ? "#ef4444" // red
              : device.status === "yellow"
              ? "#eab308" // yellow
              : "#16a34a", // green (default)
          strokeWidth: 2,
        },
      }))
    )
  );

  // === Handlers ===
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
          <p className="dark:text-network-light font-bold text-nowrap">Offline: {nodes.filter(dev => dev.data.device.status === "red").length}</p>
        </div>
        <div className="flex dark:bg-network-surface border dark:border-gray-600 p-4 rounded items-center">
          <CiWarning size={24} className="text-yellow-500 mr-2" />
          <p className="dark:text-network-light font-bold text-nowrap">High Latency: {nodes.filter(dev => dev.data.device.status === "yellow").length}</p>
        </div>
        <div className="flex dark:bg-network-surface border dark:border-gray-600 p-4 rounded items-center">
          <SiTicktick size={24} className="text-green-500 mr-2" />
          <p className="dark:text-network-light font-bold text-nowrap">Online: {nodes.filter(dev => dev.data.device.status === "green").length}</p>
        </div>
        <div className="flex dark:bg-network-surface border dark:border-gray-600 p-4 rounded items-center">
          <GoStack size={24} className="text-network-primary mr-2" />
          <p className="dark:text-network-light font-bold text-nowrap">All: {nodes.length}</p>
        </div>
      </div>

      {/* === React Flow Canvas === */}
      <div className="flex justify-between items-center  border-gray-600 p-4 border bg-network-surface rounded-t mt-2 border-gray-600">
            <p className='text-xl dark:text-network-light font-bold'>Your Score: 500</p>
            <CountdownTimer initialTime={300} isRunning={true} className="mb-2 dark:text-network-light"/>
        </div>
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
