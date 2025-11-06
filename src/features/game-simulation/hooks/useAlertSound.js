import { useRef } from "react";

export const useAlertSound = (isMuted = false) => {
  const warningSound = useRef(new Audio("/sounds/critical.mp3"));
  const criticalSound = useRef(new Audio("/sounds/warning.mp3"));

  const playSound = (type) => {
    if (isMuted) return;
    const sound =
      type === "red" ? criticalSound.current : warningSound.current;
    sound.currentTime = 0;
    sound.play().catch(() => {});
  };

  return { playSound };
};
