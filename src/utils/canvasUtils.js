// src/features/scenario-management/utils/canvasUtils.js
import { CANVAS_CONFIG } from '../constants';

const { GRID_SIZE, DEVICE_SIZE } = CANVAS_CONFIG;

/**
 * Convert mouse/touch coordinates to canvas coordinates
 */
export const getCanvasCoords = (canvas, clientX, clientY) => {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  return {
    x: (clientX - rect.left) * scaleX,
    y: (clientY - rect.top) * scaleY
  };
};

/**
 * Convert canvas coordinates to screen coordinates for overlay positioning
 */
export const getScreenCoords = (canvas, canvasX, canvasY) => {
  if (!canvas) return { x: 0, y: 0 };

  const rect = canvas.getBoundingClientRect();
  const scaleX = rect.width / canvas.width;
  const scaleY = rect.height / canvas.height;

  return {
    x: canvasX * scaleX,
    y: canvasY * scaleY
  };
};

/**
 * Snap coordinate to grid
 */
export const snapToGrid = (value) => Math.round(value / GRID_SIZE) * GRID_SIZE;

/**
 * Find device at given position
 */
export const getDeviceAtPosition = (devices, x, y) => {
  return devices.find(device => {
    const dx = x - device.position.x;
    const dy = y - device.position.y;
    return Math.sqrt(dx * dx + dy * dy) <= DEVICE_SIZE;
  });
};

/**
 * Draw grid on canvas
 */
export const drawGrid = (ctx, width, height, isDarkMode) => {
  ctx.strokeStyle = isDarkMode ? '#374151' : '#D1D5DB';
  ctx.lineWidth = 0.5;

  // Vertical lines
  for (let x = 0; x <= width; x += GRID_SIZE) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }

  // Horizontal lines
  for (let y = 0; y <= height; y += GRID_SIZE) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
};

/**
 * Draw animated connections between devices
 */
export const drawConnections = (ctx, devices, isDarkMode, animationOffset = 0) => {
  devices.forEach(device => {
    const connections = device.connections || [];
    
    connections.forEach(targetId => {
      const targetDevice = devices.find(d => d._id === targetId);
      if (!targetDevice) return;

      const sourcePos = device.position;
      const targetPos = targetDevice.position;

      // Draw main connection line
      ctx.strokeStyle = isDarkMode ? '#155dfc' : '#3b82f6';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(sourcePos.x, sourcePos.y);
      ctx.lineTo(targetPos.x, targetPos.y);
      ctx.stroke();

      // Draw animated dashed line overlay
      ctx.strokeStyle = isDarkMode ? '#06b6d4' : '#155dfc';
      ctx.lineWidth = 2;
      ctx.setLineDash([10, 10]);
      ctx.lineDashOffset = -animationOffset;
      ctx.beginPath();
      ctx.moveTo(sourcePos.x, sourcePos.y);
      ctx.lineTo(targetPos.x, targetPos.y);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw connection endpoints (small circles)
      const drawEndpoint = (x, y) => {
        ctx.fillStyle = isDarkMode ? '#155dfc' : '#3b82f6';
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
      };

      drawEndpoint(sourcePos.x, sourcePos.y);
      drawEndpoint(targetPos.x, targetPos.y);
    });
  });
};

/**
 * Draw temporary connection line during connection mode
 */
export const drawTemporaryConnection = (ctx, sourceDevice, mousePos, isDarkMode) => {
  if (!sourceDevice || !mousePos) return;

  const sourcePos = sourceDevice.position;

  // Draw temporary dashed line
  ctx.strokeStyle = isDarkMode ? '#f59e0b' : '#f59e0b';
  ctx.lineWidth = 2;
  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.moveTo(sourcePos.x, sourcePos.y);
  ctx.lineTo(mousePos.x, mousePos.y);
  ctx.stroke();
  ctx.setLineDash([]);

  // Draw source endpoint
  ctx.fillStyle = isDarkMode ? '#f59e0b' : '#f59e0b';
  ctx.beginPath();
  ctx.arc(sourcePos.x, sourcePos.y, 4, 0, Math.PI * 2);
  ctx.fill();
};