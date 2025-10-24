import { useDispatch, useSelector } from "react-redux";
import { initializeGame } from "../store/score.slice";
import { useCallback } from "react";

export const useStartGame = (addLog, scenario) => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.users);

  console.log(currentUser)

  const startGame = useCallback(async (user) => {
    // Use passed user or fallback to currentUser from state
    const gameUser = user || currentUser;
    
    if (!gameUser?.id) {
      addLog("User not logged in. Cannot start game.", "warning");
      return;
    }

    await dispatch(
      initializeGame({
        scenarioId: scenario._id,
        userId: gameUser.id,
        scenarioName: scenario.name,
      })
    );

    addLog(`Game started: ${scenario.name}`, "success");

    // Return initialized devices so caller can set state
    return scenario.devices.map((d) => ({ ...d, status: "green" }));
  }, [dispatch, currentUser, scenario, addLog]);

  return { startGame };
};