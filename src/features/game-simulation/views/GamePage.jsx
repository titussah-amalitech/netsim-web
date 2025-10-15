import { useState } from "react";
import { PlayerNameModal } from "../components/PlayerNameModal";
import { Button } from "../../../components";

export const GamePage = () => {
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [currentPlayer, setCurrentPlayer] = useState(null);

   console.log(currentPlayer)

   const handleNewGame = () => {
      setIsModalOpen(true);
   };

   const handlePlayerCreated = (player) => {
      setCurrentPlayer(player);
   };
   return (
   <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
         <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
               <h1 className="text-3xl flex justify-center font-bold text-gray-900 dark:text-white mb-6">
                  Network Simulation Game
               </h1>
               
                  <div className="text-center py-8">
                     <Button
                        onClick={handleNewGame}
                        variant="primary"
                        size="large"
                     >
                        New Game
                     </Button>
                  </div>
            </div>
         </div>

         <PlayerNameModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onPlayerCreated={handlePlayerCreated}
         />
      </div>
   )
}
