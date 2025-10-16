import { StatCard } from "../../../components/common/StatCard";

export const LeaderboardStats = ({ entries = [] }) => {
   if (!entries || entries.length === 0) return null;

   const highestScore = entries[0]?.score ?? 0;
   const averageScore =
      entries.length > 0
         ? Math.round(entries.reduce((sum, e) => sum + e.score, 0) / entries.length)
         : 0;
   const totalPlayers = entries.length;

   return (
      <div className="my-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
         <StatCard label="Highest Score" value={highestScore} color="text-network-success" />
         <StatCard label="Average Score" value={averageScore} color="text-network-text-dark dark:text-network-light" />
         <StatCard label="Total Players" value={totalPlayers} color="text-network-text-dark dark:text-network-light" />
      </div>
   );
};
