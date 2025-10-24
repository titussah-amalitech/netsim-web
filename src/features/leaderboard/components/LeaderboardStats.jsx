import { StatCard } from "../../../components/common/StatCard";

export const LeaderboardStats = ({ highestScore, averageScore, totalPlayers }) => {

   return (
      <div className="my-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
         <StatCard label="Highest Score" value={highestScore} color="text-network-success" />
         <StatCard label="Average Score" value={averageScore} color="text-network-text-dark dark:text-network-light" />
         <StatCard label="Total Players" value={totalPlayers} color="text-network-text-dark dark:text-network-light" />
      </div>
   );
};
