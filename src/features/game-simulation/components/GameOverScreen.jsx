import { useNavigate } from "react-router-dom";
import { Button } from "../../../components";

export const GameOverScreen = ({ gameData }) => {
  const navigate = useNavigate()

  const unresolved = gameData?.totalIssues - gameData?.issuesFixed;

  return (
    <div className="relative flex flex-col justify-center items-center h-[600px] w-full bg-white dark:bg-network-darker text-network-text-darker dark:text-network-text-light font-mono overflow-hidden border-t-4 border-network-error">
      {/* Background patterns - CRT scanlines */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10 pointer-events-none">
        <div className="h-full w-full bg-[repeating-linear-gradient(0deg,transparent,transparent_4px,#155dfc_4px,#155dfc_8px)]" />
      </div>

      <div className="relative z-10 w-full max-w-2xl px-8 text-center">

        <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-network-text-darker dark:text-network-lighter mb-2">
          SIMULATION OVER
        </h1>

        <p className="text-md text-network-text-dark dark:text-network-text opacity-80 mb-10 uppercase font-bold">
          {gameData?.scenarioName}
        </p>

        <div className="mb-12">
          <div className="text-lg font-semibold uppercase tracking-widest text-network-text-darker dark:text-network-light opacity-70 mb-3">
            Final Score
          </div>
          <div className="text-7xl md:text-8xl font-bold text-network-accent tracking-tight">
            {Number(gameData?.score).toLocaleString()}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="bg-network-lighter dark:bg-network-surface/40 backdrop-blur-sm border border-network-border-light dark:border-network-border rounded p-5 mb-10 font-mono text-xs">
          <div className="grid grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-network-text-darker dark:text-network-text text-sm opacity-70">TOTAL ISSUES</div>
              <div className="text-network-text-darker dark:text-network-lighter font-bold text-base">{gameData?.totalIssues}</div>
            </div>
            <div>
              <div className="text-network-text-darker dark:text-network-text text-sm opacity-70">FIXED</div>
              <div className="text-network-text-darker dark:text-network-lighter font-bold text-base">
                {gameData?.issuesFixed}
              </div>
            </div>
            <div>
              <div className="text-network-text-darker dark:text-network-text text-sm opacity-70">UNRESOLVED</div>
              <div className="text-network-text-darker dark:text-network-lighter font-bold text-base">{unresolved}</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Button
            variant=""
            title="View Leaderboard"
            onClick={() => navigate("/leaderboard")}
            className="bg-gray-50 dark:bg-network-surface/40 px-6 py-3 text-network-text-darker dark:text-network-text-light font-medium uppercase tracking-wider rounded border border-network-border-light dark:border-network-border hover:border-network-primary-light hover:text-network-primary-light transition-colors"
          >
            Leaderboard
          </Button>
        </div>

        {/* Footer */}
        <div className="text-xs text-network-darker dark:text-network-text opacity-50 uppercase tracking-widest">
          <span className="inline-block animate-pulse">█</span> Awaiting command...
        </div>
      </div>
    </div>
  );
};