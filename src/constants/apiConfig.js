export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",

  endpoints: {
    // Scenario Management
    scenarios: "/scenarios",
    loadScenario: "/scenarios/load",
    createScenario: "/scenarios/create",

    // Logs 
    logs: "/logs",

    //  Devices
    devices: "/devices",

    // Leaderboard
    leaderboard: "/leaderboard",
  },
}
