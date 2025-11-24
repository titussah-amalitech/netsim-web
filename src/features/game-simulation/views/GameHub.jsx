import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { fetchLeaderboard } from "../../leaderboard/store/leaderboard.slice";
import { PlayerNameModal } from "../components/PlayerNameModal";
import GameSimulationEnvironment from "../components/GameSimulationEnvironment";
import { useLocation, useNavigate } from "react-router-dom";
import { Play, Settings, AlertTriangle, BookOpen } from 'lucide-react';
import { Button } from '../../../components';
import { GameGuidelines } from '../components/GameGuidelines';
import { GameOnboardingModal } from '../components/GameOnboardingModal';

export const GameHub = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useSelector((state) => state.users);
  const { selectedScenario } = useSelector((state) => state.scenarios);
  const isAdmin = currentUser?.role === "admin";

  const [isGameMode, setIsGameMode] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("is_game_mode") === "true" && selectedScenario) {
      setIsGameMode(true);
    }
  }, [location.search]);

  useEffect(() => {
    dispatch(fetchLeaderboard());
  }, [dispatch]);

  const handleStartGame = () => setIsGameMode(true);
  const handleCreateScenario = () => navigate("/scenario-editor");
  const handleBrowseScenario = () => navigate("/scenario-library");

  if (isGameMode) {
    return (
      <div className="bg-network-lighter dark:bg-network-graphite text-network-text-dark dark:text-network-light w-full min-h-screen">
        <GameSimulationEnvironment scenario={selectedScenario} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-network-darker text-network-text-darker dark:text-network-text-light font-mono">
      {/* Hero Section */}
      <div className="relative overflow-hidden border-b-4 border-network-accent">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-network-text-darker dark:text-network-lighter mb-8 relative inline-block">
              Network Simulation Game
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-network-accent to-transparent"></div>
            </h1>
            <p className="text-lg sm:text-xl text-network-text-dark dark:text-network-text max-w-3xl mx-auto mb-12 leading-relaxed">
              Master network troubleshooting through hands-on simulation. Monitor devices, fix issues in real-time, and compete for the highest score!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {isAdmin ? (
                <Button variant="success" size="xl" onClick={handleCreateScenario} className="font-bold uppercase tracking-wider gap-3 shadow-lg hover:shadow-xl">
                  <Settings className="w-6 h-6" /> Create Scenario
                </Button>
              ) : (
                <Button variant="success" size="xl" onClick={handleBrowseScenario} className="font-bold uppercase tracking-wider gap-3 shadow-lg hover:shadow-xl">
                  <BookOpen className="w-6 h-6" /> Browse Scenarios
                </Button>
              )}
              <Button variant="primary" size="xl" onClick={handleStartGame} className="font-bold uppercase tracking-wider gap-3 shadow-lg hover:shadow-xl">
                <Play className="w-6 h-6" /> Start Game
              </Button>
              <Button variant="outline" size="xl" onClick={() => setShowOnboarding(true)} className="font-bold uppercase tracking-wider gap-3">
                <AlertTriangle className="w-6 h-6" /> How to Play
              </Button>
            </div>
          </div>
        </div>
      </div>

      <GameGuidelines />

      <GameOnboardingModal
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
      />

      {/* Footer CTA */}
      <div className="bg-network-accent/80 dark:bg-network-accent/30 text-white py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to Start?</h2>
          <p className="text-lg sm:text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Test your network troubleshooting skills and climb the leaderboard!
          </p>
          <Button variant="secondary" size="xl" onClick={handleStartGame}
            className="font-bold uppercase tracking-wider shadow-lg hover:shadow-xl bg-white text-network-accent hover:bg-gray-100">
            <Play className="w-6 h-6 mr-2" /> Launch Game Now
          </Button>
        </div>
      </div>

      <PlayerNameModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};