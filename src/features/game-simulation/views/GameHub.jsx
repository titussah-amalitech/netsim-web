import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchLeaderboard } from "../../leaderboard/store/leaderboard.slice";
import { PlayerNameModal } from "../components/PlayerNameModal";
import { Button } from "../../../components";
import DeviceLogger from "../components/DeviceLogger";
import GameSimulationEnvironment from "../components/GameSimulationEnvironment";
// import { useStartGame } from "../hooks/useStartGame";
// import { officeNetworkScenario } from "../../../seed/scenarioSample";

export const GameHub = () => {
   const dispatch = useDispatch();
   const { currentUser } = useSelector((state) => state.users);
   // TODO: USE THE `selectedScenario` WHEN USER WANTS TO SIMULATE A SCENARIO FROM THE EDITOR
   const { selectedScenario } = useSelector((state) => state.scenarios)

   const [isModalOpen, setIsModalOpen] = useState(false);
   const [approvalRequired, setApprovalRequired] = useState(currentUser?.role === "admin");

   ;



   // const { startGame } = useStartGame(() => (''), officeNetworkScenario);

   const handleNewGame = () => setIsModalOpen(true);

   // eslint-disable-next-line no-unused-vars
   const handleStartGame = async (user) => {
      // await startGame(user);
   };

   useEffect(() => {
      dispatch(fetchLeaderboard());
   }, [dispatch]);

   return (
      <div>
         {!approvalRequired? (
            <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
               <div className="max-w-4xl mx-auto">
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
                     <h1 className="text-3xl flex justify-center font-bold text-gray-900 dark:text-white mb-6">
                        Network Simulation Game
                     </h1>

                     <div className="text-center py-8">
                        <Button onClick={() => setApprovalRequired(prev => !prev)} variant="primary" size="large">
                           Start Game
                        </Button>
                     </div>
                  </div>
               </div>

               <PlayerNameModal
                  isOpen={isModalOpen}
                  onClose={() => setIsModalOpen(false)}
                  onStart={handleStartGame}
               />
            </div>
         ) : (
            <div className="bg-network-lighter dark:bg-network-graphite text-network-text-dark dark:text-network-light w-full min-h-full space-y-4">
               <GameSimulationEnvironment scenario={selectedScenario}/>
               <DeviceLogger />
            </div>
         )}
      </div>
   );
};