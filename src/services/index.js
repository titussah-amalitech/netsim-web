import { EntityService } from "./EntityService.service"

// Central export for all services for server-side API calls
// export { deviceService } from "./device.service"
// export { scenarioService } from "./scenario.service"
// export { leaderboardService } from "./leaderboard.service"

// For local JSON CRUD operations using localStorage
export const logService = new EntityService("logs");
export const userService = new EntityService("users");
export const deviceService = new EntityService("devices");
export const scenarioService = new EntityService("scenarios");
export const leaderboardService = new EntityService("leaderboard");