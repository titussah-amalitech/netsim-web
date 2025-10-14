import { configureStore } from "@reduxjs/toolkit";
import deviceReducer from "./device.slice";

export const store = configureStore({
   reducer: {
      devices: deviceReducer,
      // scenarios: scenariosReducer,
   }
})