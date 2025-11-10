import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { CiWarning } from "react-icons/ci";
import { CgDanger } from "react-icons/cg";
import { SiTicktick } from "react-icons/si";
import { GoStack } from "react-icons/go";
import ReactFlow, {
  Background,
  applyNodeChanges,
} from 'reactflow';
import 'reactflow/dist/style.css';
import CountdownTimer from './CountDown';
import { DeviceNode } from '../../../components/common/DeviceNode';
import { officeNetworkScenario } from '../constants';
import { Modal } from '../../../components';
import { DEVICE_TYPES } from '../../../constants';
import { showRealTimeAlert } from './RealTimeAlerts';
import { scoreService } from '../services/score.service';
import { useSelector } from 'react-redux';
import { useAlertSound } from '../hooks/useAlertSound';
import { DeviceParamaters } from './DeviceParamaters';
import { GameStats } from './GameStats';
import DeviceLogger from './DeviceLogger';

const nodeTypes = { deviceNode: DeviceNode };

const GameSimulationEnvironment = ({ scenario }) => {
  const [deviceToEdit, setDeviceToEdit] = useState(null);
  const [activeIssue, setActiveIssue] = useState(null);
  const [issueResolved, setIssueResolved] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [gamePaused, setGamePaused] = useState(false);
  const timeoutRef = useRef(null); // FIXED: Use ref instead of state
  const [score, setScore] = useState(0);
  const [currentScenario, setCurrentScenario] = useState(scenario ? {...scenario} : {...officeNetworkScenario});
  const { currentUser } = useSelector((state) => state.users);
  const { playSound } = useAlertSound(false);
  const [showLogs, setShowLogs] = useState(false);
  const [systemLogs, setSystemLogs] = useState([]);

  // Track which devices have already been alerted
  const alertedDevices = useRef(new Set());

  // Helper function to add a log entry (with duplication guard)
  const addLogEntry = useCallback((device, message, indication) => {
    if (!device) return;

    const now = new Date();
    const newLog = {
      device: device.device.name,
      message,
      time: now.toLocaleTimeString(),
      date: now.toLocaleDateString(),
      indication
    };

    setSystemLogs(prev => {
      // Avoid identical consecutive messages for same device
      const last = prev[0];
      if (last && last.device === newLog.device && last.message === newLog.message) {
        return prev;
      }
      return [newLog, ...prev];
    });
  }, []);


  useEffect(() => {
    if (!currentUser || !currentScenario) return;

    const existingGame = scoreService.getCurrentGame();
    if (!existingGame) {
      scoreService.initializeGame(
        currentScenario?.id || currentScenario?._id,
        currentUser?._id || currentUser?.id,
        currentScenario.name
      );
    }
  }, [currentUser, currentScenario]);

  const createNodeFromDevice = useCallback((device) => ({
    id: device._id,
    type: 'deviceNode',
    position: { x: device.position.x, y: device.position.y },
    data: {
      label: (
        <div
          className={`
            p-2 rounded font-medium text-sm text-white text-center rounded-full
            ${
              !device.deviceStatus.online 
              ? "bg-red-500"
              : device.deviceStatus.latency > 50 
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
      color: !device.deviceStatus.online 
              ? "border-red-500"
              : device.deviceStatus.latency > 50
              ? "border-yellow-400 text-black"
              : "border-green-500",
      device,
    },
    sourcePosition: 'right',
    targetPosition: 'left',
    draggable: true,
  }), []);

  const [nodes, setNodes] = useState(() => currentScenario.devices.map(createNodeFromDevice));

  useEffect(() => {
    setNodes(currentScenario.devices.map(createNodeFromDevice));
  }, [currentScenario, createNodeFromDevice]); 

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const buildLabel = useCallback((device) => (
    <div
      className={`
        p-2 rounded font-medium text-sm text-white text-center rounded-full
        ${
          !device.deviceStatus.online
            ? "bg-red-500"
            : device.deviceStatus.latency > 50 
            ? "bg-yellow-400 text-black"
            : "bg-green-500"
        }
      `}
      onClick={() => setDeviceToEdit(device)}
    >
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
  ), []);

  const handleIssueFix = useCallback((deviceId) => {
    const result = scoreService.recordIssueFix(deviceId);
    if (result) setScore(result.totalScore);
    setIssueResolved(true);
    setActiveIssue(null);
    
    // Schedule next issue after fix
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => triggerRandomIssue(), 30000);
  }, []);

  const handleOncomplete = () => {
    const existingGame = scoreService.getCurrentGame();
    if(existingGame) scoreService.endGame(currentUser?.name);
    
    // FIXED: Clear timeout on game over
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    setCurrentScenario(scenario ? {...scenario} : {...officeNetworkScenario});
    setGameOver(true);
    setGamePaused(false);
    setActiveIssue(null);
    setIssueResolved(false);
  };

  const handleGamePaused = (isPaused) => {
    console.log("Game Paused:", isPaused);
    setGamePaused(isPaused);
  };

  const handleApplyDeviceChanges = (deviceId, updates) => {
    if (!deviceId || !updates) return;

    setCurrentScenario((prevScenario) => {
      if (!prevScenario.devices || prevScenario.devices.length === 0) return prevScenario;

      return {
        ...prevScenario,
        devices: prevScenario.devices.map(d =>
          d._id === deviceId? {
            ...d,
            parameters: {
              ...d.parameters,
              pingInterval: updates.parameters.pingInterval,
              failureProbability: updates.parameters.failureProbability
            },
            deviceStatus: {
              ...d.deviceStatus,
              online: updates.parameters.pingInterval > 30 || updates.deviceStatus.latency > 100 || updates.parameters.failureProbability > 0.5 ? false : true,
              latency: updates.deviceStatus.latency
            }
          } : d
        ),
      };
    });

    setNodes((prev) =>
      prev.map((node) => {
        if (node.id !== deviceId) return node;
        
        const updatedDevice = {
          ...node.data.device,
          ...updates,
          parameters: { ...node.data.device.parameters, ...(updates.parameters || {}) },
          deviceStatus: { ...node.data.device.deviceStatus, 
            online: updates.parameters.pingInterval > 30 || updates.parameters.failureProbability > 50 || updates.deviceStatus.latency > 100 ? false : true,
            latency: updates.deviceStatus.latency
          },
        };
        
        const updatedNode = {
          ...node,
          data: {
            ...node.data,
            device: updatedDevice,
            label: buildLabel(updatedDevice),
            color: !updatedDevice.deviceStatus.online 
              ? 'border-red-500'
              : updatedDevice.deviceStatus.latency > 50
              ? 'border-yellow-400 text-black'
              : 'border-green-500',
          },
        };
        return updatedNode;
      })
    );

    if (deviceToEdit.parameters.pingInterval <= 30 && deviceToEdit.parameters.failureProbability <= 0.5 && deviceToEdit.deviceStatus.latency <= 50) {
      handleIssueFix(deviceId);
      const fixedDevice = currentScenario.devices.find(d => d._id === deviceId);
      if (fixedDevice) {
        addLogEntry(
          fixedDevice,
          `${fixedDevice.device.name}: Issue resolved - status changed to online`,
          'Low'
        );
      }
    }
    setDeviceToEdit(null);
  };

  const edges = useMemo(() => {
    return currentScenario.devices.flatMap((device) =>
      device?.connections?.map((targetId) => (({
        id: `e${device._id}-${targetId}`,
        source: device._id,
        target: targetId,
        animated: true,
        style: {
          stroke:
            !nodes.find((n) => n.id === device._id)?.data.device.deviceStatus.online
              ? "#ef4444"
              : nodes.find((n) => n.id === device._id)?.data.device.deviceStatus.latency > 50
              ? "#eab308"
              : "#16a34a",
          strokeWidth: 5,
        },
      })))
    );
  }, [currentScenario.devices, nodes]);

  const triggerRandomIssue = useCallback(() => {
    if(gameOver || gamePaused || activeIssue) return;

    const randomIndex = Math.floor(Math.random() * currentScenario.devices.length);
    const randomDevice = currentScenario.devices[randomIndex];
    const newLatency = Math.floor(Math.random() * 150);
    const newPing = Math.floor(Math.random() * 100);
    const newProbability = Math.random().toFixed(1);

    const updatedDevice = {
      ...randomDevice,
      deviceStatus: {
        ...randomDevice.deviceStatus,
        online: newLatency > 100 || newPing > 30 || newProbability > 0.5 ? false : true,
        latency: newLatency,
      },
      parameters: {
        ...randomDevice.parameters,
        pingInterval: newPing,
        failureProbability: newProbability
      },
    };
    
    setActiveIssue(updatedDevice._id);
    setTimeout(() => scoreService.recordIssueStart(randomDevice?._id || randomDevice?.id, newLatency > 100 || newProbability > 0.5 || newPing > 30 ? "red" : "yellow"), 1000);
    setIssueResolved(false);
    
    if(!updatedDevice.deviceStatus.online || updatedDevice.deviceStatus.latency > 50){
      !updatedDevice.deviceStatus.online ? showRealTimeAlert(updatedDevice, `${updatedDevice.device.name} is offline!`, 'red')
                          : showRealTimeAlert(updatedDevice, `${updatedDevice.device.name} is experiencing high latency!`, 'yellow');
      playSound(!updatedDevice.deviceStatus.online  ? "red" : "yellow");
    }

    setCurrentScenario(prevScenario => {
      if (!prevScenario.devices || prevScenario.devices.length === 0) return prevScenario;
      
      return {
        ...prevScenario,
        devices: prevScenario.devices.map(d =>
          d._id === randomDevice._id ? updatedDevice : d
        ),
      };
    });
  }, [gameOver, gamePaused, playSound, activeIssue, currentScenario.devices]);

  // Clear timeout when paused
  useEffect(() => {
    if (gamePaused && timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, [gamePaused]);

  // Initial issue trigger
  useEffect(() => {
    if (!activeIssue && !gameOver && !gamePaused) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => triggerRandomIssue(), 10000);
    }
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [activeIssue, gameOver, gamePaused, triggerRandomIssue]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-wrap gap-2 ms-auto">
        <div className="flex dark:bg-network-surface border dark:border-gray-600 p-4 rounded items-center">
          <CgDanger size={24} className="text-red-500 mr-2" />
          <p className="dark:text-network-light font-bold text-nowrap">Offline: {nodes.filter(node =>  !node.data.device.deviceStatus.online ).length}</p>
        </div>
        <div className="flex dark:bg-network-surface border dark:border-gray-600 p-4 rounded items-center">
          <CiWarning size={24} className="text-yellow-500 mr-2" />
          <p className="dark:text-network-light font-bold text-nowrap">High Latency: {nodes.filter(node => node.data.device.deviceStatus.online && node.data.device.deviceStatus.latency > 50).length}</p>
        </div>
        <div className="flex dark:bg-network-surface border dark:border-gray-600 p-4 rounded items-center">
          <SiTicktick size={24} className="text-green-500 mr-2" />
          <p className="dark:text-network-light font-bold text-nowrap">Online: {nodes.filter(node => node.data.device.deviceStatus.online).length}</p>
        </div>
        <div className="flex dark:bg-network-surface border dark:border-gray-600 p-4 rounded items-center">
          <GoStack size={24} className="text-network-primary mr-2" />
          <p className="dark:text-network-light font-bold text-nowrap">All: {nodes.length}</p>
        </div>
      </div>

      <div className="flex justify-between items-center border-gray-600 p-4 border bg-network-light dark:bg-network-surface rounded-t mt-2 border-gray-600">
        <p className='text-xl dark:text-network-light font-bold'>{!gameOver ? `Score: ${score}` : ""}</p>
        
        <CountdownTimer 
          initialTime={currentScenario.timeLimit} 
          isRunning={true} 
          scenario={scenario || officeNetworkScenario} 
          onComplete={handleOncomplete} 
          handleGamePaused={handleGamePaused}
          gameOver={gameOver}
          className="mb-2 dark:text-network-light"
        />
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
              deviceStatus: deviceToEdit.deviceStatus,
            }); 
          }}
          className="space-y-3 mt-2"
        >
          <div>
            <label className="block text-sm font-medium text-network-text-darker dark:text-network-text-light mb-1">
              Device
            </label>
            <div className={"px-3 py-2 border border-network-border-light dark:border-0 dark:bg-network-gray-light rounded"}>
              {deviceToEdit.device.name}
            </div>
          </div>

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

          <div>
            <label className="block text-sm font-medium text-network-text-darker dark:text-network-text-light mb-1">
              Latency (ms)
            </label>
            <input
              type="number"
              value={deviceToEdit.deviceStatus.latency}
              onChange={(e) => setDeviceToEdit(prev => ({
                ...prev,
                deviceStatus: { ...(prev.deviceStatus || {}), latency: Number(e.target.value) }
              }))}
              className="w-full px-3 py-2 border border-network-border-light dark:border-0 dark:bg-network-gray-light
                        rounded text-network-text-darker dark:text-network-text-light focus:outline-none
                        focus:ring-2 focus:ring-blue-400"
              min="0"
            />
          </div>

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

          <div>
            <label className="block text-sm font-medium text-network-text-darker dark:text-network-text-light mb-1">
              Status
            </label>
            <div className={`px-3 py-2 border border-network-border-light dark:border-0 dark:bg-network-gray-light
                          rounded ${deviceToEdit.deviceStatus.online  ? 'text-network-success' : 'text-network-error'}`}>
              {deviceToEdit.deviceStatus.online ? 'Online' : 'Offline'}
            </div>
          </div>

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

      {!gameOver ? (
        <div className="flex flex-col lg:flex-row flex-1 border-t-0 border border-gray-600 rounded-b overflow-hidden">
          <div className={`h-[600px] lg:flex-1 bg-network-light dark:bg-network-surface ${showLogs ? 'hidden lg:flex' : 'flex'}`}>
            <ReactFlow
              key={nodes.length + score}
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              nodeTypes={nodeTypes}
              nodesDraggable
              fitView
            >
              <Background />
            </ReactFlow>
          </div>
          <div className={`w-full lg:w-80  ${showLogs ? 'flex' : 'hidden lg:flex'} lg:border-l border-t lg:border-t-0 border-gray-600  bg-network-light dark:bg-network-surface  flex-col max-h-[400px] lg:max-h-none `}>
            <div className="p-3 sm:p-4 border-b border-gray-600 flex justify-between items-center">
              <h3 className="text-base sm:text-lg font-bold dark:text-network-light">System Logs</h3>
              <button
                onClick={() => setShowLogs(false)}
                className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-hidden p-3 sm:p-4">
              <div className="text-xs sm:text-sm dark:text-gray-300 text-gray-600">
                <p className="italic mb-5">Monitoring network activity...</p>
                <DeviceLogger logs={systemLogs} />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center h-[600px] border-t-0 w-full border border-gray-600 rounded-b bg-network-light dark:bg-network-surface">
          <p className='text-7xl dark:text-network-light font-bold'>Score: {score}</p>
        </div>
      )}
    </div>
  );
};

export default GameSimulationEnvironment;