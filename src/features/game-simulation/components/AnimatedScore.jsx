import { useEffect, useRef, useState } from "react";
import { scoreAnimation } from "../../../styles";

export const AnimatedScore = ({ score }) => {
  const [scoreIncrease, setScoreIncrease] = useState(null);
  const prevScoreRef = useRef(score);

  useEffect(() => {
    const prevScore = prevScoreRef.current;
    if (score > prevScore) {
      const increase = score - prevScore;
      setScoreIncrease(increase);

      // Clear after animation duration
      const timer = setTimeout(() => {
        setScoreIncrease(null);
      }, 3000);

      prevScoreRef.current = score;

      return () => clearTimeout(timer);
    } else {
      // Update ref even if score decreases or stays the same
      prevScoreRef.current = score;
    }
  }, [score]);

  return (
    <div className="relative">
      <p className="text-xl dark:text-network-light font-bold">Score: {score}</p>

      {scoreIncrease !== null && (
        <div className="absolute left-0 top-0 pointer-events-none">
          <span className="absolute whitespace-nowrap text-2xl font-bold text-network-accent dark:text-network-primary-light animate-score-popup">
            +{scoreIncrease}
          </span>
        </div>
      )}

      <style jsx>{scoreAnimation}</style>
    </div>
  );
};