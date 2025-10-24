import React from "react";

export const Loader = ({ size = 60, className = "" }) => {
  return (
    <div
      className={`relative flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
      aria-label="Loading..."
    >
      {/* Center node */}
      <div className="absolute w-4 h-4 rounded-full bg-network-primary dark:bg-network-primary-light animate-pulse" />

      {/* Orbiting nodes */}
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className={`absolute w-3 h-3 rounded-full bg-network-accent dark:bg-network-secondary animate-network-orbit`}
          style={{
            transform: `rotate(${i * 90}deg) translate(${size / 2}px) rotate(-${i * 90}deg)`,
            animationDelay: `${i * 0.15}s`,
          }}
        />
      ))}

      <style jsx>{`
        @keyframes network-orbit {
          0% {
            transform: rotate(0deg) translate(${size / 2}px) rotate(0deg);
          }
          100% {
            transform: rotate(360deg) translate(${size / 2}px) rotate(-360deg);
          }
        }
        .animate-network-orbit {
          animation: network-orbit 1.6s linear infinite;
        }
      `}</style>
    </div>
  );
};
