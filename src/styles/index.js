export const countDownAnimations = `
        @keyframes grid-shift {
          0% { transform: translate(0, 0); }
          100% { transform: translate(60px, 60px); }
        }

        @keyframes float-particle {
          0%, 100% { 
            transform: translate(0, 0) scale(1);
            opacity: 0.3;
          }
          50% { 
            transform: translate(calc(20px * var(--tx, 1)), calc(-30px * var(--ty, 1))) scale(1.5);
            opacity: 0.8;
          }
        }

        @keyframes fade-in {
          from { 
            opacity: 0;
            transform: scale(0.8);
          }
          to { 
            opacity: 0.4;
            transform: scale(1);
          }
        }

        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes rotate-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes pulse-glow {
          0%, 100% { 
            opacity: 0.3;
            transform: scale(1);
          }
          50% { 
            opacity: 0.6;
            transform: scale(1.05);
          }
        }

        @keyframes number-pop {
          0% {
            transform: scale(0.5);
            opacity: 0;
          }
          60% {
            transform: scale(1.15);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes launch-pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.8;
          }
        }
      `;

export const scoreAnimation = `
        @keyframes score-popup {
          0% {
            transform: translateY(0) scale(0.8);
            opacity: 0;
          }
          15% {
            transform: translateY(-40px) scale(1.3);
            opacity: 1;
          }
          30% {
            transform: translateY(-50px) scale(1.1);
            opacity: 1;
          }
          70% {
            transform: translateY(-60px) scale(1);
            opacity: 1;
          }
          100% {
            transform: translateY(-80px) scale(0.8);
            opacity: 0;
          }
        }

        .animate-score-popup {
          animation: score-popup 5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          text-shadow: 0 0 10px rgba(59, 130, 246, 0.5),
            0 0 20px rgba(59, 130, 246, 0.3),
            0 0 30px rgba(59, 130, 246, 0.1);
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-weight: 900;
        }
      `;
