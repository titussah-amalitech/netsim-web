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
// Define nodeTypes outside of render so the object identity is stable across
// renders — React Flow warns when nodeTypes/edgeTypes are recreated each render.
const nodeTypes = { deviceNode: DeviceNode };

const GameSimulationEnvironment = () => {

  // === Nodes ===
  const [nodes, setNodes] = useState([
    {
      id: '1',
      type: 'deviceNode',
      position: { x: 50, y: 100 },
      data: { label: <div className="p-2 rounded">Router 1</div> },
      sourcePosition: 'right',
    },
    {
      id: '2',
      type: 'deviceNode',
      position: { x: 350, y: 100 },
      data: { label: <div className="p-2 rounded" onClick={() => console.log("clicked")}>Router 2</div> },
      targetPosition: 'left',
      sourcePosition: 'right',
    },
    {
      id: '3',
      type: 'deviceNode',
      position: { x: 600, y: 100 },
      data: { label: <div className="p-2 rounded">Router 3</div> },
      targetPosition: 'left',
    },
  ]);

  // === Edges ===
  const [edges, setEdges] = useState([
    { id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: '#16a34a', strokeWidth: 2 } },
    { id: 'e2-3', source: '2', target: '3', animated: true, style: { stroke: '#16a34a', strokeWidth: 2 } },
  ]);

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
          <p className="dark:text-network-light font-bold text-nowrap">Offline: 0</p>
        </div>
        <div className="flex dark:bg-network-surface border dark:border-gray-600 p-4 rounded items-center">
          <CiWarning size={24} className="text-yellow-500 mr-2" />
          <p className="dark:text-network-light font-bold text-nowrap">High Latency: 0</p>
        </div>
        <div className="flex dark:bg-network-surface border dark:border-gray-600 p-4 rounded items-center">
          <SiTicktick size={24} className="text-green-500 mr-2" />
          <p className="dark:text-network-light font-bold text-nowrap">Online: 3</p>
        </div>
        <div className="flex dark:bg-network-surface border dark:border-gray-600 p-4 rounded items-center">
          <GoStack size={24} className="text-network-primary mr-2" />
          <p className="dark:text-network-light font-bold text-nowrap">All: 3</p>
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
