import { EntityService } from "./EntityService.service";
import { localStorageService } from "../utils/localStorageService";
import { seedDevices } from "./seedDevices";

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

// Seed devices on first run so the app has example data in localStorage.
try {
	const existing = localStorageService.get("devices");
	if (!existing || existing.length === 0) {
		seedDevices();
	}
} catch (err) {
	// localStorage might be unavailable in some environments (SSR). Ignore errors.
	// eslint-disable-next-line no-console
	console.warn("Could not seed devices localStorage:", err);
}