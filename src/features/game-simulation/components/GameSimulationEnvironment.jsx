import React, { useState } from "react";
import { FaPlay, FaPause, FaRedo } from "react-icons/fa";
import { Button } from "../../../components";
import { useTheme } from "../../../hooks/useTheme";
import CountdownTimer from "./CountDown";

const GameSimulationEnvironment = () => {
  const { theme } = useTheme();

  return (
    <div className={
      `w-full min-h-full flex flex-col gap-6 ${
        // background & text adapt to Tailwind dark mode
        "bg-gray-50 text-gray-800 dark:bg-gray-900 dark:text-gray-100"
      }`
    }>

      {/* === TOP CONTROL BAR === */}
  <div className="flex flex-wrap justify-between items-center bg-agri-primary text-white rounded-xl shadow-md px-6 py-3">
        {/* Title */}
        <h2 className="text-lg md:text-xl font-semibold tracking-wide">
          Network Simulation Environment
        </h2>

        {/* Score, Timer, Buttons */}
        <div className="flex flex-wrap items-center gap-4 text-sm md:text-base">
          <p>
            Score:{" "}
            <span className="font-bold text-yellow-200">150 pts</span>
          </p>
          <div className="flex space-x-2 items-center">
            <p>Time Left:</p>
            <span className="font-bold text-yellow-200">
                <CountdownTimer />
            </span>
          </div>
          
        </div>
      </div>

      {/* === MAIN VISUALIZATION AREA === */}
      {<div className="relative flex-1 rounded-2xl shadow-inner border overflow-hidden bg-white dark:bg-gray-800 dark:border-gray-700 border-gray-200">
        <h3 className="absolute top-4 left-4 dark:">
          Network Overview
        </h3>

        {/* Router */}
        <div className="absolute left-1/2 top-[15%] transform -translate-x-1/2 flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center text-white font-bold shadow-md cursor-pointer">
            R1
          </div>
          <p className="text-xs mt-2">Router-01</p>
        </div>

        {/* Switch 1 */}
        <div className="absolute left-[25%] top-[45%] flex flex-col items-center">
          <div className="w-14 h-14 rounded-full bg-yellow-400 flex items-center justify-center text-white font-bold shadow-md cursor-pointer">
            S1
          </div>
          <p className="text-xs mt-2">Switch-01</p>
        </div>

        {/* Switch 2 */}
        <div className="absolute left-[65%] top-[45%] flex flex-col items-center">
          <div className="w-14 h-14 rounded-full bg-green-500 flex items-center justify-center text-white font-bold shadow-md cursor-pointer">
            S2
          </div>
          <p className="text-xs mt-2">Switch-02</p>
        </div>

        {/* Workstations */}
        <div className="absolute left-[15%] bottom-[10%] flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center text-white font-bold shadow-md cursor-pointer">
            WS1
          </div>
          <p className="text-xs mt-2">Workstation-01</p>
        </div>

        <div className="absolute left-[45%] bottom-[10%] flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-white font-bold shadow-md cursor-pointer">
            WS2
          </div>
          <p className="text-xs mt-2">Workstation-02</p>
        </div>

        <div className="absolute right-[15%] bottom-[10%] flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-yellow-400 flex items-center justify-center text-white font-bold shadow-md cursor-pointer">
            DB
          </div>
          <p className="text-xs mt-2">Database Server</p>
        </div>

        
      </div>}
    </div>
  );
};

export default GameSimulationEnvironment;
