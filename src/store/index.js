import { configureStore } from "@reduxjs/toolkit";
import deviceReducer from "./device.slice";
import userReducer from "./user.slice";
// import leaderboardReducer from "../features/leaderboard/store.slice";

export const store = configureStore({
   reducer: {
      users: userReducer,
      devices: deviceReducer,
      // scenarios: scenariosReducer,
      // leaderboard: leaderboardReducer,
   }
})