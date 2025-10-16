import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Trophy, Medal, Award } from "lucide-react";
import { FaCrown, FaMedal } from "react-icons/fa"
import { fetchLeaderboard } from "../store/leaderboard.slice";
import { Loader } from "../../../components/common/Loader";
import { Alert } from "../../../components/common/Alert";
import { DataTable } from "../../../components/Table";
import { LeaderboardStats } from "../components/LeaderBoardStats";

export const Leaderboard = () => {
   const dispatch = useDispatch();
   const { entries, highestScore, averageScore, totalPlayers, loading, error, } = useSelector((state) => state.leaderboard);

   const [alert, setAlert] = useState(null);

   useEffect(() => {
      // TODO: REMOVE THIS LATER
      // dispatch(clearLeaderboard()).unwrap()
      dispatch(fetchLeaderboard());
   }, [dispatch]);


   const getRankIcon = (rank) => {
      if (rank === 1)
         return <FaCrown className="text-yellow-500 text-2xl" />;
      if (rank === 2)
         return <FaMedal className="text-purple-500 text-2xl" />;
      if (rank === 3)
         return <Award className="text-orange-500 text-2xl" />;
      return `#${rank}`;
   };

   const getScoreColor = (score, index) => {
      const rank = index + 1;
      if (score >= 1000 && (rank <= 3)) return "text-network-success dark:text-network-success";
      return "text-network-text-darker dark:text-white";
   };

   // Define columns for DataTable
   const columns = [
      {
         header: "Rank",
         accessor: "rank",
         render: (entry, index) => {
            const rank = index + 1;
            const isTopThree = rank <= 3;

            return (
               <div className="flex items-center">
                  <span className={`text-xl font-semi-bold ${isTopThree ? "" : "text-network-text-dark dark:text-gray-400"}`}>
                     {getRankIcon(rank)}
                  </span>
               </div>
            );
         },
      },
      {
         header: "Player",
         accessor: "name",
         render: (entry) => (
            <div className="flex items-center">
               <p className="flex-shrink-0 h-10 w-10 bg-network-primary/10 dark:bg-network-primary/20 rounded-full flex items-center justify-center">
                  {entry.name?.charAt(0)?.toUpperCase()}
               </p>
               <div className="ml-4">
                  <div className="text-sm font-medium text-network-text-darker dark:text-white">
                     {entry.name}
                  </div>
               </div>
            </div>
         ),
      },
      {
         header: "Score",
         accessor: "score",
         render: (entry, index) => (
            <span className={`text-lg font-semi-bold ${getScoreColor(entry.score, index)}`}>
               {entry.score?.toLocaleString()}
            </span>
         ),
      }
   ];

   if (loading) {
      return (
         <div className="flex items-center justify-center h-full w-full">
            <Loader />
         </div>
      );
   }

   return (
      <div className="min-h-screen bg-network-lighter dark:bg-network-graphite text-network-text-darker dark:text-white rounded-lg">
         <div className="container mx-auto px-4 py-6">
            {/* Alerts */}
            {alert && (
               <div className="space-y-3 mb-4">
                  <Alert
                     type={alert.type}
                     title={alert.title}
                     onClose={() => setAlert(null)}
                  >
                     {alert.message}
                  </Alert>
               </div>
            )}

            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
               <div className="flex items-center gap-3">
                  <div className="p-3 bg-network-light dark:bg-network-text-darker rounded-lg">
                     <Trophy className="w-8 h-8 dark:text-network-lighter" />
                  </div>
                  <div>
                     <h1 className="text-2xl font-bold text-network-text-darker dark:text-network-lighter">
                        Leaderboard
                     </h1>
                     <p className="text-network-text-dark dark:text-gray-400">
                        Top 10 Players
                     </p>
                  </div>
               </div>
            </div>

            {/* Empty State */}
            {!error && entries.length === 0 && (
               <div className="text-center py-16">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-network-surface-light dark:bg-network-surface rounded-full mb-4">
                     <Medal className="w-10 h-10 text-network-text-dark dark:text-network-text" />
                  </div>
                  <h2 className="text-xl font-semibold text-network-text-darker dark:text-white mb-2">
                     No Scores Yet
                  </h2>
                  <p className="text-network-text-dark dark:text-gray-400">
                     Be the first to set a score!
                  </p>
               </div>
            )}

            {/* Leaderboard Table */}
            {!error && entries.length > 0 && (
               <>
                  <LeaderboardStats
                     entries={entries}
                     highestScore={highestScore}
                     averageScore={averageScore}
                     totalPlayers={totalPlayers}
                  />

                  <DataTable
                     data={entries}
                     columns={columns}
                     totalItems={entries.length}
                     loading={loading}
                  />
               </>
            )}
         </div>
      </div>
   );
};