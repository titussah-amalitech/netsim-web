import { useEffect, useRef, useState } from 'react';
import { useTheme } from '../../hooks/useTheme';
import { DEVICE_TYPES, CANVAS_CONFIG } from '../../constants';
import { drawGrid, drawConnections, drawTemporaryConnection, getCanvasCoords, getScreenCoords } from '../../utils/canvasUtils';
import { Device } from '../common';
import { TOOLS } from '../../features/scenario-management/constants';

export const Canvas = ({
   canvasRef,
   scenario,
   selectedTool,
   selectedDevice,
   connectionMode,
   canvasSize = CANVAS_CONFIG.DEFAULT_CANVAS_SIZE,
   onMouseMove,
   onTouchMove,
   onMouseDown,
   onTouchStart,
}) => {
   const { theme } = useTheme();
   const isDarkMode = theme === 'dark';
   const animationRef = useRef(null);
   const [animationOffset, setAnimationOffset] = useState(0);
   const [mousePos, setMousePos] = useState(null);

   // Track mouse position for temporary connection line
   useEffect(() => {
      if (!connectionMode?.active || !connectionMode.sourceDevice) return;

      const canvas = canvasRef.current;
      if (!canvas) return;

      const handleMouseMove = (e) => {
         const coords = getCanvasCoords(canvas, e.clientX, e.clientY);
         setMousePos(coords);
      };

      canvas.addEventListener('mousemove', handleMouseMove);
      return () => canvas.removeEventListener('mousemove', handleMouseMove);
   }, [connectionMode, canvasRef]);

   // Animation loop for connection lines
   useEffect(() => {
      const animate = () => {
         setAnimationOffset((prev) => (prev + 1) % 20);
         animationRef.current = requestAnimationFrame(animate);
      };

      animationRef.current = requestAnimationFrame(animate);
      return () => {
         if (animationRef.current) cancelAnimationFrame(animationRef.current);
      };
   }, []);

   // Draw static canvas elements (grid + connections)
   useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Set size
      canvas.width = canvasSize.width;
      canvas.height = canvasSize.height;

      // Clear and fill background (old style colors)
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = isDarkMode ? '#1F2937' : '#f3f4f6';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw the old-style grid (preserved colors and density)
      drawGrid(ctx, canvas.width, canvas.height, isDarkMode);

      // Draw connections between devices
      if (scenario?.devices) drawConnections(ctx, scenario.devices, isDarkMode, animationOffset);

      // Draw temporary connection line (if connecting devices)
      if (connectionMode?.active && connectionMode.sourceDevice && mousePos) {
         drawTemporaryConnection(ctx, connectionMode.sourceDevice, mousePos, isDarkMode);
      }

      // Show tool instruction
      if (selectedTool !== TOOLS.SELECT) {
         ctx.fillStyle = '#34D399';
         ctx.font = '14px sans-serif';
         ctx.textAlign = 'left';
         const deviceName = DEVICE_TYPES[selectedTool.type]?.name || selectedTool;
         ctx.fillText(`Click to place ${deviceName}`, 10, 25);
      }
   }, [scenario, isDarkMode, animationOffset, connectionMode, mousePos, canvasRef, canvasSize, selectedTool]);

   return (
      <>
         <div className="mt-4 mb-4 text-network-text-dark dark:text-network-text">
            <p>
               <span className="text-blue-400 font-medium">Click once</span> to select a device and show properties.
               <span className="text-blue-400 font-medium"> Click and drag</span> to move devices around.
               Devices snap to grid for alignment.
            </p>
         </div>
         {/* <div className="relative bg-network-surface-light dark:bg-gray-800 border-2 border-network-border-light dark:border-network-gray-light  rounded-lg p-4 overflow-hidden shadow-lg"> */}
         <div className="bg-network-surface-light dark:bg-gray-800 rounded-lg p-4">
            <div className="relative">
               <canvas
                  ref={canvasRef}
                  width={canvasSize.width}
                  height={canvasSize.height}
                  onMouseDown={onMouseDown}
                  onMouseMove={onMouseMove}
                  onTouchStart={onTouchStart}
                  onTouchMove={onTouchMove}
                  className={`w-full h-full border border-network-border-light dark:border-network-gray-light rounded-lg ${connectionMode?.active ? 'cursor-crosshair' : 'cursor-default'}`}
                  style={{ touchAction: 'none', imageRendering: 'crisp-esdges' }}
               />

               {/* Render devices using Device component */}
               {scenario?.devices?.map((device) => {
                  const canvas = canvasRef.current;
                  if (!canvas) return null;
                  const screenCoords = getScreenCoords(canvas, device.position.x, device.position.y);

                  const isSelected = selectedDevice?._id === device._id;
                  const isSource = connectionMode?.sourceDevice?._id === device._id;

                  return (
                     <div
                        key={device._id}
                        className={`absolute pointer-events-none transition-all duration-150 ${isSelected ? 'ring-4 rounded-full ring-yellow-500 ring-opacity-50' : ''}`}
                        style={{
                           left: `${screenCoords.x - 40}px`,
                           top: `${screenCoords.y - 40}px`,
                           transform: 'scale(0.75)',
                           transformOrigin: 'center',
                        }}
                     >
                        <Device
                           name={device.device?.name || device.name}
                           type={device.device?.type || device.type}
                           isSelected={isSelected}
                           showBgColor={!isSource}
                        />

                        {/* Connection mode pulsing highlight */}
                        {isSource && (
                           <div className="absolute inset-0 flex items-center justify-center">
                              <div
                                 className={`rounded-full border-4 ${connectionMode.mode === 'add' ? 'border-green-500' : 'border-red-500'} animate-ping opacity-50`}
                                 style={{ width: '80%', height: '80%' }}
                              />
                           </div>
                        )}
                     </div>
                  );
               })}

               {/* Connection Mode Overlay */}
               {connectionMode?.active && (
                  <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-network-surface/90 px-4 py-2 rounded-lg shadow-lg border border-network-border">
                     <p className="text-sm text-network-text-light">
                        {connectionMode.sourceDevice
                           ? `Click a device to ${connectionMode.mode === 'add' ? 'connect to' : 'disconnect from'} ${connectionMode.sourceDevice.device.name
                           }`
                           : `Click a device to start ${connectionMode.mode === 'add' ? 'connecting' : 'disconnecting'}`}
                     </p>
                     <p className="text-xs text-gray-400 mt-1">Press ESC to cancel</p>
                  </div>
               )}
            </div>
         </div>
      </>
   );
};
