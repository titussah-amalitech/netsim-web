import React, { useEffect, useState, useRef } from "react";
import { Button } from "../../../components";
import { FaPause, FaPlay, FaRedo, FaPlayCircle, FaStopCircle } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { scoreService } from '../services/score.service';

const CountdownTimer = ({
  initialTime = 300,
  onComplete = () => { },
  className = "",
  scenario,
  gameOver,
  handleGamePaused,
  handleGameReset,
  handleStartEndGame,
  startGame
}) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [active, setActive] = useState(false);
  const intervalRef = useRef(null);
  const { currentUser } = useSelector((state) => state.users);
  const navigate = useNavigate();

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
    if (!active || gameOver) {
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
  }, [active, onComplete, gameOver]);

  const handlePauseResume = () => {
    setActive((prev) => {
      const newActive = !prev;
      // Send the PAUSED state (inverse of active) to parent
      handleGamePaused(!newActive);
      return newActive;
    });
  };

  const handleReset = () => {
    if (!currentUser || !scenario) return;

    const existingGame = scoreService.getCurrentGame();
    if (existingGame) scoreService.clearGame();

    if(!gameOver){scoreService.initializeGame(
      scenario?.id || scenario?._id,
      currentUser?._id || currentUser?.id,
      scenario.name
    );}

    if (gameOver) navigate(0)
    setTimeLeft(initialTime)
    handleGameReset()
  };

  const startEndGame = () => {
    handleStartEndGame()
    if(!active){
      setActive(true)
    }
  }

  return (
    <div className={`flex items-center flex-nowrap space-x-4 ${className}`}>
      <div className="text-xl font-semibold">
        {formatTime(timeLeft)}
      </div>

      {!gameOver && (
        <Button
          className="hover:bg-gray-100 flex items-center gap-2 px-3 py-1 rounded-lg"
          onClick={handlePauseResume}
          disabled={!startGame}
        >
          {active ? <FaPause size={14} /> : <FaPlay size={14} />}
          {active ? 'Pause' : 'Resume'}
        </Button>
      )}

      <Button
        className="hover:bg-gray-100 flex items-center gap-2 px-3 py-1 rounded-lg"
        onClick={handleReset}
      >
        <FaRedo size={14} />
        {gameOver ? "Replay" : "Reset"}
      </Button>

      {!gameOver && (
        <Button
          className="hover:bg-gray-100 flex items-center gap-2 px-3 py-1 rounded-lg"
          onClick={startEndGame}
          variant={startGame ? "danger" : "success"}
        >
          {startGame ? <FaStopCircle size={18} /> : <FaPlayCircle size={18} />}
          {startGame ? 'End ' : 'Play'}
        </Button>
      )}
    </div>
  );
};

export default CountdownTimer;