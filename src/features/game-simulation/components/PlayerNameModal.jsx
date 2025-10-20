import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createUser, fetchUsers } from "../../../store/user.slice";
import { Button, Modal } from "../../../components";
import { Play } from "lucide-react";

export const PlayerNameModal = ({ isOpen, onClose, onStart }) => {
   const [playerName, setPlayerName] = useState('');
   const [error, setError] = useState('');
   const dispatch = useDispatch();

   const { loading } = useSelector((state) => state.users);

   useEffect(() => {
      if (isOpen) {
         dispatch(fetchUsers());
      }
   }, [isOpen, dispatch]);

   const validateName = (name) => {
      if (!name || name.trim() === '') {
         return 'Player name cannot be empty';
      }

      return null;
   };

   // Submit player name and start the game
   const handleSubmit = async () => {
      const validationError = validateName(playerName);
      if (validationError) {
         setError(validationError);
         return;
      }

      try {
         const result = await dispatch(createUser({ name: playerName.trim() })).unwrap();
         
         // Pass the created user to onStart
         onStart(result);
         setPlayerName('');
         setError('');
         onClose();
         // eslint-disable-next-line no-unused-vars
      } catch (err) {
         setError('Failed to create player. Please try again.');
      }
   };


   const handleNameChange = (e) => {
      setPlayerName(e.target.value);
      setError('');
   };

   return (
      <Modal
         isOpen={isOpen}
         onClose={onClose}
         title="Enter Player Name"
         size="small"
         showCloseButton={false}
      >
         <div className="space-y-4">
            <div>
               <label htmlFor="playerName" className="block text-sm font-medium mb-2">
                  Your Name or Nickname
               </label>
               <input
                  id="playerName"
                  type="text"
                  value={playerName}
                  onChange={handleNameChange}
                  placeholder="Enter your name..."
                  className="w-full px-3 py-2 border border-network-border-light dark:border-0 dark:bg-network-gray-light rounded text-network-text-darker dark:text-network-text-light focus:outline-none focus:ring-2 focus:ring-blue-400"
                  autoFocus={true}
                  disabled={loading}
               />
               {error && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                     {error}
                  </p>
               )}
            </div>

            <div className="flex justify-end gap-3">
               <Button
                  type="button"
                  variant="secondary"
                  onClick={onClose}
                  disabled={loading}
                  title="Cancel Game"
               >
                  Cancel
               </Button>
               <Button
                  type="button"
                  variant="primary"
                  onClick={handleSubmit}
                  title="Start New Game"
                  className="gap-2"
                  disabled={loading || !playerName.trim()}
               >
                  <Play size={20} /> <span>Start Game</span>
               </Button>
            </div>
         </div>
      </Modal>
   );
};