import { useEffect, useCallback } from 'react';
import { CANVAS_CONFIG, DEVICE_TYPES } from '../../constants';
import { drawConnections, drawGrid, getScreenCoords } from '../../utils/canvasUtils';
import { TOOLS } from '../../features/scenario-management/constants';
import { Device } from '../common';

export const Canvas = ({
   scenario,
   selectedDevice,
   selectedTool,
   canvasRef,
   onMouseDown,
   onMouseMove,
   onTouchStart,
   onTouchMove,
   canvasSize = CANVAS_CONFIG.DEFAULT_CANVAS_SIZE
}) => {

   const drawCanvas = useCallback(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');

      // Clear and set background
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#1F2937';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw grid
      drawGrid(ctx, canvas.width, canvas.height);

      // Draw connections
      drawConnections(ctx, scenario.devices);

      // Show tool instruction
      if (selectedTool !== TOOLS.SELECT) {
         ctx.fillStyle = '#34D399';
         ctx.font = '14px sans-serif';
         ctx.textAlign = 'left';
         const deviceName = DEVICE_TYPES[selectedTool.type]?.name || selectedTool;
         ctx.fillText(`Click to place ${deviceName}`, 10, 25);
      }
   }, [scenario.devices, selectedTool, canvasRef]);

   useEffect(() => {
      drawCanvas();
   }, [drawCanvas]);

   return (
      <div className="bg-gray-800 rounded-lg p-4">
         <div className="relative">
            <canvas
               ref={canvasRef}
               width={canvasSize.width}
               height={canvasSize.height}
               className="w-full border border-gray-700 rounded-lg cursor-crosshair"
               onMouseDown={onMouseDown}
               onMouseMove={onMouseMove}
               onTouchStart={onTouchStart}
               onTouchMove={onTouchMove}
            />

            {/* Device Overlays */}
            {scenario.devices.map(device => {
               const canvas = canvasRef.current;
               if (!canvas) return null;

               const screenCoords = getScreenCoords(canvas, device.position.x, device.position.y);
               const isSelected = selectedDevice?._id === device._id;

               return (
                  <div
                     key={device._id}
                     className={`absolute pointer-events-none transition-all duration-150 ${isSelected ? 'ring-4 rounded-full ring-yellow-500 ring-opacity-50' : ''
                        }`}
                     style={{
                        left: `${screenCoords.x - 40}px`,
                        top: `${screenCoords.y - 40}px`,
                        transform: 'scale(0.8)',
                        transformOrigin: 'center',
                     }}
                  >
                     <Device
                        type={device.device?.type || device.type}
                        isSelected={isSelected}
                        showLabel={false}
                     />
                  </div>
               );
            })}

            <div className="mt-4 text-sm text-gray-400">
               <p>
                  <span className="text-blue-400 font-medium">Click once</span> to select a device and show properties.
                  <span className="text-blue-400 font-medium"> Click and drag</span> to move devices around.
                  Devices snap to grid for alignment.
               </p>
            </div>
         </div>
      </div>
   );
};
