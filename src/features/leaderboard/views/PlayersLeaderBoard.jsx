import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Trophy, Medal, Award } from "lucide-react";
import { FaCrown, FaMedal } from "react-icons/fa";
import { Loader } from "../../../components/common/Loader";
import { Alert } from "../../../components/common/Alert";
import { DataTable } from "../../../components/Table";
import { LeaderBoardStats } from "../components/LeaderBoardStats";
import { fetchScores } from "../../game-simulation/store/score.slice";
import { Button } from "../../../components";
import { useNavigate } from "react-router-dom";

export const PlayersLeaderboard = () => {
  const dispatch = useDispatch();
  const { scores,    loading, error } =
    useSelector((state) => state.score);
  let highestScore = 0, averageScore = 0, totalPlayers = 0;
  const { selectedScenario } = useSelector((state) => state.scenarios);
  const navigate = useNavigate();
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    dispatch(fetchScores());
  }, [dispatch]);

  const getRankIcon = (rank) => {
    if (rank === 1) return <FaCrown className="text-yellow-500 text-2xl" />;
    if (rank === 2) return <FaMedal className="text-purple-400 text-2xl" />;
    if (rank === 3) return <Award className="text-network-warning text-2xl" />;
    return `#${rank}`;
  };

  const getScoreColor = (score, index) => {
    const rank = index + 1;
    if (score >= 1000 && rank <= 3)
      return "text-network-success dark:text-network-success";
    return "text-network-text-darker dark:text-white";
  };

  const players = scores.filter(
    (s) => s?.scenarioName === selectedScenario?.name
  );

  console.log(players)
  if ( players.length )
  {
    const rankPlayers = players.sort( ( a, b ) => b.score - a.score );
    totalPlayers = players.length 
    highestScore = rankPlayers[ 0 ].score
    averageScore = Math.floor(rankPlayers.reduce((s, player) => s + (player.score || 0), 0) / rankPlayers.length)
  }
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
            <span
              className={`text-xl font-semi-bold ${
                isTopThree ? "" : "text-network-text-dark dark:text-gray-400"
              }`}
            >
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
        <span
          className={`text-lg font-semi-bold ${getScoreColor(
            entry.score,
            index
          )}`}
        >
          {entry.score?.toLocaleString()}
        </span>
      ),
    },
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
              <Trophy className="w-8 h-8 text-network-warning" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-network-text-darker dark:text-network-lighter">
                {selectedScenario?.name}
              </h1>
              <div className="flex items-center space-x-4">
                <p className="text-network-text-dark dark:text-gray-400">
                  Top 10 Players
                </p>
                <Button
                  variant="success"
                  size="small"
                  onClick={() => navigate("/")}
                >
                  Play
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Empty State */}
        {!error && scores.length === 0 && (
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
        {!error && scores.length > 0 && (
          <>
            <LeaderBoardStats
              entries={scores.filter(
                (score) => score.scenarioName === selectedScenario?.name
              )}
              highestScore={highestScore}
              averageScore={averageScore}
              totalPlayers={totalPlayers}
            />

            <DataTable
              data={scores.filter(
                (score) => score.scenarioName === selectedScenario?.name
              )}
              columns={columns}
              totalItems={scores.length}
              loading={loading}
            />
          </>
        )}
      </div>
    </div>
  );
};
