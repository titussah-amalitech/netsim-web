import { useState, useCallback, useRef } from 'react';
import { getCanvasCoords, getDeviceAtPosition } from '../utils/canvasUtils';
import { TOOLS } from '../features/scenario-management/constants';

export const useCanvasInteraction = ({
  scenario,
  selectedTool,
  onDeviceAdd,
  onDeviceMove,
  onDeviceSelect
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [mouseDownDeviceId, setMouseDownDeviceId] = useState(null);

  const canvasRef = useRef(null);

  const handlePointerDown = useCallback((clientX, clientY, button = 0) => {
    if (button !== 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const { x, y } = getCanvasCoords(canvas, clientX, clientY);

    if (selectedTool === TOOLS.SELECT) {
      const device = getDeviceAtPosition(scenario.devices, x, y);

      if (device) {
        onDeviceSelect(device);
        setDragOffset({
          x: x - device.position.x,
          y: y - device.position.y
        });
        setMouseDownDeviceId(device._id);
        setIsDragging(false);
      } else {
        onDeviceSelect(null);
        setMouseDownDeviceId(null);
      }
    } else if (selectedTool && selectedTool !== TOOLS.SELECT) {
      const existingDevice = getDeviceAtPosition(scenario.devices, x, y);
      if (existingDevice) return;

      const newDevice = onDeviceAdd(selectedTool, x, y);
      if (newDevice) {
        onDeviceSelect(newDevice);
        setMouseDownDeviceId(newDevice._id);
        setDragOffset({ x: 0, y: 0 });
        setIsDragging(false);
      }
    }
  }, [selectedTool, scenario.devices, onDeviceAdd, onDeviceSelect]);

  const handlePointerMove = useCallback((clientX, clientY) => {
    if (!mouseDownDeviceId || selectedTool !== TOOLS.SELECT) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const { x, y } = getCanvasCoords(canvas, clientX, clientY);
    const device = scenario.devices.find(d => d._id === mouseDownDeviceId);

    if (!device) return;

    const newPosition = {
      x: x - dragOffset.x,
      y: y - dragOffset.y
    };

    if (newPosition.x !== device.position.x || newPosition.y !== device.position.y) {
      setIsDragging(true);
      onDeviceMove(device._id, newPosition);
    }
  }, [mouseDownDeviceId, selectedTool, scenario.devices, dragOffset, onDeviceMove]);

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
    setMouseDownDeviceId(null);
  }, []);

  // Event handlers for different input types
  const handleMouseDown = useCallback((e) => {
    handlePointerDown(e.clientX, e.clientY, e.button);
  }, [handlePointerDown]);

  const handleMouseMove = useCallback((e) => {
    handlePointerMove(e.clientX, e.clientY);
  }, [handlePointerMove]);

  const handleTouchStart = useCallback((e) => {
    if (e.touches.length === 1) {
      handlePointerDown(e.touches[0].clientX, e.touches[0].clientY, 0);
    }
  }, [handlePointerDown]);

  const handleTouchMove = useCallback((e) => {
    if (e.touches.length === 1) {
      handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, [handlePointerMove]);

  return {
    canvasRef,
    isDragging,
    handleMouseDown,
    handleMouseMove,
    handleTouchStart,
    handleTouchMove,
    handlePointerUp,
  };
};