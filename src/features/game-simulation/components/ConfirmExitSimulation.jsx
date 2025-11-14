import { Button, Modal } from "../../../components";
import { useCompleteNavigationGuard } from "../hooks/useCompleteNavigationGuard";

const ConfirmExitSimulation = ({
  gameOver,
  score,
  activeIssue,
  timeoutRef,
  scoreService,
  startGame
}) => {
  // Determine if we should block navigation
  const shouldBlock = !gameOver && startGame;

  // Cleanup function when user confirms exit
  const handleConfirmExit = () => {
    if (timeoutRef?.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (scoreService) {
      scoreService.clearGame();
    }
  };

  // Use the navigation guard hook
  const { showModal, confirm, cancel } = useCompleteNavigationGuard(
    shouldBlock,
    handleConfirmExit
  );

  return (
    <Modal isOpen={showModal} title="Simulation in Progress" onClose={cancel}>
      <div className="space-y-4">
        <p className="text-network-text-darker dark:text-network-text-light">
          You have a simulation running with a score of <strong>{score}</strong>
          . If you leave now, all progress will be lost.
        </p>
        <p className="text-network-text-darker dark:text-network-text-light font-semibold">
          Are you sure you want to leave?
        </p>
        <div className="flex gap-3 justify-end">
          <Button
            onClick={cancel}
            className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg"
          >
            Stay
          </Button>
          <Button
            onClick={confirm}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
          >
            Leave & Lose Progress
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmExitSimulation;
