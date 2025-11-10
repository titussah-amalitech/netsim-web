import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
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
  const [score, setScore] = useState(0);
  const [showLogs, setShowLogs] = useState(false);
  const [deviceToEdit, setDeviceToEdit] = useState(null);
  const [activeIssue, setActiveIssue] = useState(null);
  const [issueResolved, setIssueResolved] = useState(false);
  const [currentScenario, setCurrentScenario] = useState(scenario ? { ...scenario } : { ...officeNetworkScenario });
  const [systemLogs, setSystemLogs] = useState([]);
  
  // Track which devices have already been alerted
  const alertedDevices = useRef(new Set());

  // Keep previous latency per device to detect transitions (<=50 -> >50) or (>50 -> <=50)
  const prevDeviceLatencyRef = useRef(new Map());

  const { currentUser } = useSelector((state) => state.users);
  const { playSound } = useAlertSound(false);

  useEffect(() => {
    if (!currentUser || !currentScenario) return;

    // Only initialize if no current game
    const existingGame = scoreService.getCurrentGame();
    if (!existingGame) {
      scoreService.initializeGame(
        currentScenario?.id || currentScenario?._id,
        currentUser?._id || currentUser?.id,
        currentScenario.name
      );
    }
  }, [currentUser, currentScenario]);

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

  const createNodeFromDevice = (device) => ({
    id: device._id,
    type: 'deviceNode',
    position: { x: device.position.x, y: device.position.y },
    data: {
      label: (
        <div
          className={`
            p-2 font-medium text-sm text-white text-center rounded-full
            ${device.parameters.latencyThreshold > 100
              ? "bg-red-500"
              : device.parameters.latencyThreshold > 50 && device.parameters.latencyThreshold <= 100
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
      color: device.parameters.latencyThreshold > 100
        ? "border-red-500"
        : device.parameters.latencyThreshold > 50 && device.parameters.latencyThreshold <= 100
          ? "border-yellow-400 text-black"
          : "border-green-500",
      device,
    },
    sourcePosition: 'right',
    targetPosition: 'left',
    draggable: true,
  });

  const [nodes, setNodes] = useState(() => currentScenario.devices.map(createNodeFromDevice));

  useEffect(() => {
    setNodes(currentScenario.devices.map(createNodeFromDevice));
  }, [currentScenario]);

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const handleIssueFix = (deviceId) => {
    const result = scoreService.recordIssueFix(deviceId);
    if (result) setScore(result.totalScore);
    setIssueResolved(true);
    
    // Remove device from alerted set when fixed
    alertedDevices.current.delete(deviceId);

    // update prev map to mark it resolved
    prevDeviceLatencyRef.current.set(deviceId, 50);
  };

  const handleApplyDeviceChanges = (deviceId, updates) => {
    if (!deviceId || !updates) return;

    setCurrentScenario((prevScenario) => (({
      ...prevScenario,
      devices: prevScenario.devices.map((dev) =>
        dev._id === deviceId
          ? {
              ...dev,
              ...updates,
              parameters: { ...dev.parameters, ...(updates.parameters || {}) },
              deviceStatus: { ...dev.deviceStatus, ...(updates.deviceStatus || {}) },
            }
          : dev
      ),
    })));

    // If the passed updates fixed the device (latency <= 50), handle fix
    if (updates.parameters && updates.parameters.latencyThreshold !== undefined && updates.parameters.latencyThreshold <= 50) {
      handleIssueFix(deviceId);
      // Log the resolution
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
            nodes.find((n) => n.id === device._id)?.data.device.parameters.latencyThreshold > 100
              ? "#ef4444"
              : nodes.find((n) => n.id === device._id)?.data.device.parameters.latencyThreshold > 50 && nodes.find((n) => n.id === device._id)?.data.device.parameters.latencyThreshold <= 100
                ? "#eab308"
                : "#16a34a",
          strokeWidth: 5,
        },
      })))
    );
  }, [currentScenario.devices, nodes]);

  // === triggerRandomIssue now only updates the device's latency (no showRealTimeAlert / logging here) ===
  const triggerRandomIssue = useCallback(() => {
    setCurrentScenario(prevScenario => {
      if (!prevScenario.devices || prevScenario.devices.length === 0) return prevScenario;

      const randomIndex = Math.floor(Math.random() * prevScenario.devices.length);
      const randomDevice = prevScenario.devices[randomIndex];
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

      // we set active issue so other UI can react
      setActiveIssue(updatedDevice._id);
      setTimeout(() => scoreService.recordIssueStart(randomDevice?._id || randomDevice?.id, newLatency > 100 ? "red" : "yellow"), 1000);
      setIssueResolved(false);

      return {
        ...prevScenario,
        devices: prevScenario.devices.map(d =>
          d._id === randomDevice._id ? updatedDevice : d
        ),
      };
    });
  }, []);

  // If no active issue, schedule a new issue (keeps your original timing)
  useEffect(() => {
    if (!activeIssue) {
      const t = setTimeout(() => triggerRandomIssue(), 10000);
      return () => clearTimeout(t);
    }
  }, [activeIssue, triggerRandomIssue]);

  // Watch device list for transitions and handle alerting/logging exactly once per new issue
  useEffect(() => {
    if (!currentScenario || !Array.isArray(currentScenario.devices)) return;

    const prevLatencies = prevDeviceLatencyRef.current;
    currentScenario.devices.forEach((dev) => {
      const id = dev._id;
      const prevLatency = prevLatencies.has(id) ? prevLatencies.get(id) : (dev.parameters.latencyThreshold <= 50 ? 50 : dev.parameters.latencyThreshold);
      const currLatency = dev.parameters.latencyThreshold;

      // Transition: healthy (<=50) -> issue (>50)
      if (prevLatency <= 50 && currLatency > 50) {
        // Only alert/log once per device per issue cycle
        if (!alertedDevices.current.has(id)) {
          alertedDevices.current.add(id);

          const alertMessage = currLatency > 100
            ? `${dev.device.name} is offline!`
            : `${dev.device.name} is experiencing high latency!`;

          const severity = currLatency > 100 ? 'red' : 'yellow';
          const indication = currLatency > 100 ? 'High' : 'Medium';

          // Play sound and show alert exactly once
          showRealTimeAlert(dev, alertMessage, severity);
          playSound(severity);

          // Log once
          addLogEntry(
            dev,
            `${dev.device.name}: ${currLatency > 100 ? 'Offline' : `High latency: ${currLatency}ms`}`,
            indication
          );
        }
      }

      // Transition: issue (>50) -> healthy (<=50) => mark resolved
      if (prevLatency > 50 && currLatency <= 50) {
        // Remove from alerted so it can be alerted again in future
        alertedDevices.current.delete(id);

        // Log resolution
        addLogEntry(
          dev,
          `${dev.device.name}: Issue resolved - status changed to online`,
          'Low'
        );

        // Optionally record fix in scoreService if needed
        // scoreService.recordIssueFix(id);
      }

      // update prev latency map for next check
      prevLatencies.set(id, currLatency);
    });
  }, [currentScenario, addLogEntry, playSound]);

  // Old effect that attempted to re-trigger issues — kept but safer:
  useEffect(() => {
    if (!activeIssue) return;

    const affectedDevice = currentScenario.devices.find(
      (d) => d._id === activeIssue
    );
    if (!affectedDevice) return;

    const { latencyThreshold } = affectedDevice.parameters;

    // if issue marked resolved externally, schedule next issue
    if (issueResolved === false && latencyThreshold <= 50) {
      const t = setTimeout(() => triggerRandomIssue(), 30000);
      return () => clearTimeout(t);
    }
  }, [currentScenario, activeIssue, issueResolved, triggerRandomIssue]);

  return (
    <div className="flex flex-col w-full h-screen">
      <GameStats nodes={nodes} />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 border-gray-600 p-3 sm:p-4 border bg-network-light dark:bg-network-surface rounded-t mt-2 border-gray-600">
        <p className='text-lg sm:text-xl dark:text-network-light font-bold'>Score: {score}</p>
        <CountdownTimer initialTime={300} isRunning={true} className="dark:text-network-light" endGame={scoreService.endGame.bind(scoreService)} />
        
        <button
          onClick={() => setShowLogs(!showLogs)}
          className="lg:hidden px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors"
        >
          {showLogs ? 'Hide Logs' : 'Show Logs'}
        </button>
      </div>

      <Modal isOpen={deviceToEdit !== null}
        title={"Adjust Device Parameters"}
        onClose={() => setDeviceToEdit(null)}
      >
        <DeviceParamaters
          deviceToEdit={deviceToEdit}
          setDeviceToEdit={setDeviceToEdit}
          applyChanges={handleApplyDeviceChanges}
        />
      </Modal>

      <div className="flex flex-col lg:flex-row flex-1 border-t-0 border border-gray-600 rounded-b overflow-hidden">
        <div className={`flex-1 bg-network-light dark:bg-network-surface ${showLogs ? 'hidden lg:flex' : 'flex'}`}>
          <ReactFlow
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

        <div className={` w-full lg:w-80  ${showLogs ? 'flex' : 'hidden lg:flex'} lg:border-l border-t lg:border-t-0 border-gray-600  bg-network-light dark:bg-network-surface  flex-col max-h-[400px] lg:max-h-none `}>
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
    </div>
  );
};

export default GameSimulationEnvironment;
