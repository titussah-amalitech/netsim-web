import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Trophy, Medal, Award } from "lucide-react";
import { FaCrown, FaMedal } from "react-icons/fa";
import { Loader } from "../../../components/common/Loader";
import { Alert } from "../../../components/common/Alert";
import { DataTable } from "../../../components/Table";
import { fetchScores } from "../../game-simulation/store/score.slice";
import { Button } from "../../../components/common";
import { useNavigate } from "react-router-dom";
import { fetchScenarios, setSelectedScenario } from "../../scenario-management/store/scenario.slice";

export const Leaderboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { scenarios } = useSelector((state) => state.scenarios);
  const { scores, loading, error } = useSelector((state) => state.score);

  const [alert, setAlert] = useState(null);

  useEffect(() => {
    dispatch(fetchScores());
    dispatch(fetchScenarios());
  }, [dispatch]);

  const getScoreColor = (score, index) => {
    const rank = index + 1;
    if (score >= 1000 && rank <= 3)
      return "text-network-success dark:text-network-success";
    return "text-network-text-darker dark:text-white";
  };

  const handleViewPlayersLeaderBoard = (scenario) => {
    navigate(`/players-leaderboard/?id=${scenario.id}`);
    dispatch(setSelectedScenario(scenario));
  };

  const findTopScorer = (sName) => {
    const players = scores.filter((s) => s.scenarioName === sName);

    if (!players.length) return { name: "No players", score: 0 };

    const rankPlayers = players.sort((a, b) => b.score - a.score);

    return rankPlayers[0];
  };
  
  // Define columns for DataTable
  const columns = [
    {
      header: "Scenario",
      accessor: "scenario",
      render: (entry) => {
        return (
          <div className="flex items-center">
            <span className="text-sm font-medium text-network-text-darker dark:text-white">
              {entry?.name}
            </span>
          </div>
        );
      },
    },
    {
      header: "Top Player",
      accessor: "name",
      render: (entry) => (
        <div className="flex items-center">
          <p className="flex-shrink-0 h-10 w-10 bg-network-primary/10 dark:bg-network-primary/20 rounded-full flex items-center justify-center">
            {findTopScorer(entry.name).name?.charAt(0)?.toUpperCase()}
          </p>
          <div className="ml-4">
            <div className="text-sm font-medium text-network-text-darker dark:text-white">
              {findTopScorer(entry.name).name}
            </div>
            <div className="text-xs  text-gray-500 dark:text-gray-400">
              {`Score: ${findTopScorer(entry.name).score}`}
            </div>
          </div>
        </div>
      ),
    },

    {
      header: "Action",
      accessor: "action",
      render: (entry, index) => (
        <Button
          className={`text-lg font-semi-bold ${getScoreColor(
            entry.score,
            index
          )}`}
          size="small"
          onClick={() => handleViewPlayersLeaderBoard(scenarios[index])}
        >
          View
        </Button>
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
                Leaderboard
              </h1>
              <p className="text-network-text-dark dark:text-gray-400">
                Top 10 Scenarios
              </p>
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
              No Scenarios Yet
            </h2>
            <p className="text-network-text-dark dark:text-gray-400">
              Be the first to create a scenario!
            </p>
          </div>
        )}

        {/* Leaderboard Table */}
        {!error && scores.length > 0 && (
          <>
            <DataTable
              data={scenarios}
              columns={columns}
              totalItems={scenarios.length}
              loading={loading}
            />
          </>
        )}
      </div>
    </div>
  );
};
