import { configureStore } from "@reduxjs/toolkit";
import deviceReducer from "./device.slice";
import userReducer from "./user.slice";
import scoreSlice from "../features/game-simulation/store/score.slice";
import leaderboardReducer from "../features/leaderboard/store/leaderboard.slice";

export const store = configureStore({
   reducer: {
      users: userReducer,
      score: scoreSlice,
      devices: deviceReducer,
      // scenarios: scenariosReducer,
      leaderboard: leaderboardReducer,
   }
})