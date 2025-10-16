import { useState, useCallback } from 'react';
import { DEVICE_TYPES } from '../../../constants';
import { SCENARIO_DEFAULTS } from '../constants';
import { snapToGrid } from '../../../utils/canvasUtils';

export const useScenario = () => {
   const [scenario, setScenario] = useState(SCENARIO_DEFAULTS);
   const [selectedDevice, setSelectedDevice] = useState(null);

   const updateScenarioProperty = useCallback((property, value) => {
      setScenario(prev => ({ ...prev, [property]: value }));
   }, []);

   const updateMetadata = useCallback((property, value) => {
      setScenario(prev => ({
         ...prev,
         metadata: { ...prev.metadata, [property]: value }
      }));
   }, []);

   const addDevice = useCallback((deviceType, x, y) => {
      const config = DEVICE_TYPES[deviceType.type];
      if (!config) {
         console.error(`Unknown device type: ${deviceType.type}`);
         return null;
      }

      const snappedX = snapToGrid(x);
      const snappedY = snapToGrid(y);

      const existingDevicesOfType = scenario.devices.filter(
         d => (d.device?.type || d.type) === deviceType.type
      );

      const newDevice = {
         _id: `temp_${Date.now()}`,
         device: {
            name: `${config.name}_${existingDevicesOfType.length + 1}`, // ✅ safe now
            type: deviceType.type
         },
         position: { x: snappedX, y: snappedY },
         parameters: {
            pingInterval: 30,
            latencyThreshold: 100,
            failureProbability: 0.1,
            trafficLoad: 0
         },
         status: {
            online: true,
            latency: 0,
            lastChecked: new Date().toISOString()
         }
      };

      setScenario(prev => ({
         ...prev,
         devices: [...prev.devices, newDevice]
      }));

      return newDevice;
   }, [scenario.devices]);

   const updateDevice = useCallback((deviceId, updates) => {
      setScenario(prev => ({
         ...prev,
         devices: prev.devices.map(device =>
            device._id === deviceId
               ? { ...device, ...updates }
               : device
         )
      }));

      // Update selected device if it's the one being updated
      if (selectedDevice?._id === deviceId) {
         setSelectedDevice(prev => ({ ...prev, ...updates }));
      }
   }, [selectedDevice]);

   const deleteDevice = useCallback((deviceId) => {
      setScenario(prev => ({
         ...prev,
         devices: prev.devices.filter(device => device._id !== deviceId)
      }));

      if (selectedDevice?._id === deviceId) {
         setSelectedDevice(null);
      }
   }, [selectedDevice]);

   const moveDevice = useCallback((deviceId, newPosition) => {
      const snappedPosition = {
         x: snapToGrid(newPosition.x),
         y: snapToGrid(newPosition.y)
      };

      updateDevice(deviceId, { position: snappedPosition });
   }, [updateDevice]);

   const clearScenario = useCallback(() => {
      setScenario({
         ...SCENARIO_DEFAULTS,
         metadata: {
            ...SCENARIO_DEFAULTS.metadata,
            createdAt: new Date().toISOString()
         }
      });
      setSelectedDevice(null);
   }, []);

   return {
      scenario,
      selectedDevice,
      setSelectedDevice,
      updateScenarioProperty,
      updateMetadata,
      addDevice,
      updateDevice,
      deleteDevice,
      moveDevice,
      clearScenario,
      setScenario, // For import functionality
   };
};
