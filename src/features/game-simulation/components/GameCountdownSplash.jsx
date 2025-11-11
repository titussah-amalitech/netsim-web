import { useState, useEffect } from 'react';
import { countDownAnimations } from '../../../styles';

export const GameCountdownSplash = ({ onComplete }) => {
   const [count, setCount] = useState(5);
   const [phase, setPhase] = useState('loading');

   useEffect(() => {
      // Initial loading phase
      const loadingTimer = setTimeout(() => setPhase('countdown'), 800);

      return () => clearTimeout(loadingTimer);
   }, []);

   useEffect(() => {
      if (phase !== 'countdown') return;

      if (count > 0) {
         const timer = setTimeout(() => setCount(count - 1), 1000);
         return () => clearTimeout(timer);
      } else {
         setPhase('launch');
         setTimeout(() => onComplete(), 800);
      }
   }, [count, phase, onComplete]);

   return (
      <div className="fixed inset-0 z-50 bg-network-lighter dark:bg-network-darker overflow-hidden">
         {/* Dynamic grid background */}
         <div className="absolute inset-0">
            <div
               className="absolute inset-0 opacity-[0.03] dark:opacity-[0.08]"
               style={{
                  backgroundImage: `
              repeating-linear-gradient(0deg, transparent, transparent 2px, #155dfc 2px, #155dfc 3px),
              repeating-linear-gradient(90deg, transparent, transparent 2px, #155dfc 2px, #155dfc 3px)
            `,
                  backgroundSize: '60px 60px',
                  animation: 'grid-shift 20s linear infinite',
               }}
            />
         </div>

         {/* Floating particles */}
         <div className="absolute inset-0">
            {[...Array(12)].map((_, i) => (
               <div
                  key={i}
                  className="absolute w-1 h-1 bg-network-primary/30 dark:bg-network-accent/30 rounded-full"
                  style={{
                     left: `${Math.random() * 100}%`,
                     top: `${Math.random() * 100}%`,
                     animation: `float-particle ${8 + Math.random() * 10}s ease-in-out infinite`,
                     animationDelay: `${Math.random() * 5}s`,
                  }}
               />
            ))}
         </div>

         {/* Corner brackets */}
         <div className="absolute top-8 left-8 w-16 h-16 border-t-2 border-l-2 border-network-primary dark:border-network-accent opacity-40"
            style={{ animation: 'fade-in 0.6s ease-out' }} />
         <div className="absolute top-8 right-8 w-16 h-16 border-t-2 border-r-2 border-network-primary dark:border-network-accent opacity-40"
            style={{ animation: 'fade-in 0.6s ease-out 0.1s both' }} />
         <div className="absolute bottom-8 left-8 w-16 h-16 border-b-2 border-l-2 border-network-primary dark:border-network-accent opacity-40"
            style={{ animation: 'fade-in 0.6s ease-out 0.2s both' }} />
         <div className="absolute bottom-8 right-8 w-16 h-16 border-b-2 border-r-2 border-network-primary dark:border-network-accent opacity-40"
            style={{ animation: 'fade-in 0.6s ease-out 0.3s both' }} />


         <div className="relative h-full flex flex-col items-center justify-center px-4">

            {/* Header section */}
            <div
               className="mb-16 text-center"
               style={{
                  animation: 'slide-down 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                  opacity: phase === 'launch' ? 0 : 1,
                  transform: phase === 'launch' ? 'translateY(-30px)' : 'translateY(0)',
                  transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
               }}
            >
               <div className="inline-flex items-center gap-3 mb-4">
                  <div className="w-2 h-2 bg-network-success rounded-full animate-pulse" />
                  <span className="text-xs tracking-[0.3em] text-network-text-dark dark:text-network-text uppercase">
                     System Online
                  </span>
                  <div className="w-2 h-2 bg-network-success rounded-full animate-pulse" />
               </div>

               <h1 className="text-5xl md:text-7xl font-bold mb-3 tracking-tight">
                  <span className="bg-gradient-to-br from-network-primary via-network-secondary to-network-accent bg-clip-text text-transparent dark:from-network-accent dark:via-network-secondary dark:to-network-primary">
                     NETWORK SIM
                  </span>
               </h1>

               <div className="flex items-center justify-center gap-2 text-sm text-network-text-dark dark:text-network-text">
                  <div className="h-px w-8 bg-gradient-to-r from-transparent to-network-primary/50 dark:to-network-accent/50" />
                  <span className="tracking-wider">MISSION CONTROL</span>
                  <div className="h-px w-8 bg-gradient-to-l from-transparent to-network-primary/50 dark:to-network-accent/50" />
               </div>
            </div>

            {/* Countdown */}
            <div
               className="relative mb-16"
               style={{
                  opacity: phase === 'launch' ? 0 : 1,
                  transform: phase === 'launch' ? 'scale(1.5)' : 'scale(1)',
                  transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
               }}
            >
               {/* Outer hexagon ring */}
               <div className="absolute inset-0 flex items-center justify-center">
                  <div
                     className="w-72 h-72 md:w-80 md:h-80"
                     style={{
                        background: `conic-gradient(from 0deg, 
                  transparent 0deg, 
                  rgba(21, 93, 252, 0.1) ${(5 - count) * 72}deg, 
                  transparent ${(5 - count) * 72}deg)`,
                        animation: 'rotate-slow 30s linear infinite',
                        clipPath: 'polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)',
                     }}
                  />
               </div>

               {/* Middle glow ring */}
               <div className="absolute inset-0 flex items-center justify-center">
                  <div
                     className="w-56 h-56 md:w-64 md:h-64 rounded-full"
                     style={{
                        background: 'radial-gradient(circle, rgba(21, 93, 252, 0.15) 0%, transparent 70%)',
                        animation: 'pulse-glow 2s ease-in-out infinite',
                     }}
                  />
               </div>

               {/* Inner circle frame */}
               <div className="relative w-44 h-44 md:w-52 md:h-52 rounded-full border-2 border-network-border-light dark:border-network-border flex items-center justify-center bg-network-surface-light/50 dark:bg-network-surface/50 backdrop-blur-sm">

                  {/* Rotating segments */}
                  <div className="absolute inset-0 rounded-full overflow-hidden">
                     {[...Array(8)].map((_, i) => (
                        <div
                           key={i}
                           className="absolute top-1/2 left-1/2 w-1 h-20 origin-bottom"
                           style={{
                              background: count > 0 && i < (5 - count) * 1.6
                                 ? 'linear-gradient(to top, rgba(21, 93, 252, 0.6), transparent)'
                                 : 'rgba(100, 116, 139, 0.1)',
                              transform: `rotate(${i * 45}deg) translateY(-50%)`,
                              transition: 'background 0.3s ease',
                           }}
                        />
                     ))}
                  </div>

                  {/* Countdown display */}
                  <div className="relative z-10 text-center">
                     {count > 0 ? (
                        <div
                           key={count}
                           className="text-7xl md:text-8xl font-bold tabular-nums"
                           style={{
                              background: 'linear-gradient(135deg, #155dfc, #6366f1)',
                              WebkitBackgroundClip: 'text',
                              WebkitTextFillColor: 'transparent',
                              backgroundClip: 'text',
                              animation: 'number-pop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                              filter: 'drop-shadow(0 4px 12px rgba(21, 93, 252, 0.3))',
                           }}
                        >
                           {count}
                        </div>
                     ) : (
                        <div
                           className="text-3xl md:text-4xl font-bold tracking-wider"
                           style={{
                              background: 'linear-gradient(135deg, #10b981, #06b6d4)',
                              WebkitBackgroundClip: 'text',
                              WebkitTextFillColor: 'transparent',
                              backgroundClip: 'text',
                              animation: 'launch-pulse 0.8s ease-out',
                           }}
                        >
                           GO!
                        </div>
                     )}
                  </div>

                  {/* Inner ring progress */}
                  <svg className="absolute inset-0 w-full h-full -rotate-90">
                     <circle
                        cx="50%"
                        cy="50%"
                        r="48%"
                        className="stroke-network-primary dark:stroke-network-accent"
                        strokeWidth="3"
                        fill="none"
                        strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 48}`}
                        strokeDashoffset={`${2 * Math.PI * 48 * (count / 5)}`}
                        style={{
                           transition: 'stroke-dashoffset 1s cubic-bezier(0.4, 0, 0.2, 1)',
                           filter: 'drop-shadow(0 0 6px rgba(21, 93, 252, 0.6))',
                        }}
                     />
                  </svg>
               </div>
            </div>

            {/* Status bar */}
            <div
               className="w-full max-w-md"
               style={{
                  animation: 'slide-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both',
                  opacity: phase === 'launch' ? 0 : 1,
                  transform: phase === 'launch' ? 'translateY(30px)' : 'translateY(0)',
                  transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
               }}
            >
               {/* Progress bar */}
               <div className="mb-6 bg-network-border-light/30 dark:bg-network-border/30 rounded-full h-1 overflow-hidden">
                  <div
                     className="h-full bg-gradient-to-r from-network-primary via-network-secondary to-network-accent"
                     style={{
                        width: `${((5 - count) / 5) * 100}%`,
                        transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)',
                        boxShadow: '0 0 10px rgba(21, 93, 252, 0.5)',
                     }}
                  />
               </div>

               {/* System checks */}
               <div className="grid grid-cols-3 gap-4 text-xs">
                  {[
                     { label: 'TOPOLOGY', delay: 1 },
                     { label: 'PROTOCOLS', delay: 2 },
                     { label: 'MONITORING', delay: 3 },
                  ].map((item) => (
                     <div key={item.label} className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-2">
                           <div
                              className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${5 - count >= item.delay
                                    ? 'bg-network-success shadow-[0_0_8px_rgba(16,185,129,0.6)]'
                                    : 'bg-network-border-light dark:bg-network-border'
                                 }`}
                           />
                           <span className={`tracking-wider transition-colors duration-500 ${5 - count >= item.delay
                                 ? 'text-network-success'
                                 : 'text-network-text-dark dark:text-network-text'
                              }`}>
                              {item.label}
                           </span>
                        </div>
                        <div className="text-[10px] text-network-text-dark dark:text-network-text/50">
                           {5 - count >= item.delay ? 'READY' : 'PENDING'}
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </div>

         <style>{countDownAnimations}</style>
      </div>
   );
};