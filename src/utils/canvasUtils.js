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
 * Determine if two devices should be connected
 */
export const shouldConnect = (device1, device2) => {
  const type1 = device1.device?.type || device1.type;
  const type2 = device2.device?.type || device2.type;

  // Router-Switch connections
  if ((type1 === 'router' && type2 === 'switch') ||
    (type1 === 'switch' && type2 === 'router')) {
    return true;
  }

  // Switch-PC/Server connections
  if ((type1 === 'switch' && (type2 === 'pc' || type2 === 'server')) ||
    ((type1 === 'pc' || type1 === 'server') && type2 === 'switch')) {
    return true;
  }

  return false;
};

/**
 * Draw connections between devices
 */
export const drawConnections = (ctx, devices) => {
  ctx.strokeStyle = '#6B7280';
  ctx.lineWidth = 2;

  devices.forEach(device1 => {
    devices.forEach(device2 => {
      if (device1._id !== device2._id && shouldConnect(device1, device2)) {
        ctx.beginPath();
        ctx.moveTo(device1.position.x, device1.position.y);
        ctx.lineTo(device2.position.x, device2.position.y);
        ctx.stroke();
      }
    });
  });
};