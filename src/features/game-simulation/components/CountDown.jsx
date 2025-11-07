import React, { useEffect, useState, useRef } from "react";
import { Button } from "../../../components";
import { FaPause, FaPlay, FaRedo } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { scoreService } from '../services/score.service';


const CountdownTimer = ({
  initialTime = 300, // default 5 minutes
  isRunning = true,
  onComplete = () => {},
  className = "",
  scenario,
  handleGamePaused
}) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [active, setActive] = useState(isRunning);
  const intervalRef = useRef(null);
  const { currentUser } = useSelector((state) => state.users);
  const navigate = useNavigate()

  // Format seconds to mm:ss
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = Math.floor(seconds % 60)
      .toString()
      .padStart(2, "0");
    return `${m}:${s}`;
  };

  // Handle countdown logic
  useEffect(() => {
    if (!active) {
      clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          onComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [active, onComplete]);

  const handlePauseResume = () => {setActive((prev) => !prev); handleGamePaused();};
  const handleReset = () => {
    if (!currentUser || !scenario) return;
    
    // Only initialize if no current game
    const existingGame = scoreService.getCurrentGame();
    if (existingGame) scoreService.clearGame();
    scoreService.initializeGame(
      scenario?.id || scenario?._id,
      currentUser?._id || currentUser?.id,
      scenario.name
    );
    navigate(0)
  };

  return (
    <div
      className={`flex items-center flex-nowrap space-x-4 ${className}`}
    >
      <div className="text-xl font-semibold ">
        {formatTime(timeLeft)}
      </div>

      <Button className=" hover:bg-gray-100 flex items-center gap-2 px-3 py-1 rounded-lg" onClick={handlePauseResume}>
        {active ? <FaPause size={14} /> : <FaPlay size={14} />}
        {active ? 'Pause' : 'Play'}
      </Button>
      <Button className=" hover:bg-gray-100 flex items-center gap-2 px-3 py-1 rounded-lg" onClick={handleReset}>
        <FaRedo size={14} />
        {active ? "Reset" : "Replay"}
      </Button>
    </div>
  );
};

export default CountdownTimer;
