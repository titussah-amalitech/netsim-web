import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { PlayerNameModal } from "../features/game-simulation/components/PlayerNameModal";

export const GlobalAuthWrapper = ({ children }) => {
  const { currentUser } = useSelector((state) => state.users);
  const [modalOpen, setModalOpen] = useState(!currentUser);

  useEffect(() => {
    if (!currentUser) setModalOpen(true);
  }, [currentUser]);

  return (
    <>
      {children}
      <PlayerNameModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
};
