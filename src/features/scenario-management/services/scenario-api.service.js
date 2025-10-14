import { API_CONFIG } from "../../../constants/apiConfig";
import { api } from "../../../services/api";

class ScenarioService {
   getAll() {
      return api.get(API_CONFIG.endpoints.scenarios);
   }

   getById(id) {
      return api.get(`${API_CONFIG.endpoints.scenarios}/${id}`);
   }

   create(data) {
      return api.post(API_CONFIG.endpoints.createScenario, data);
   }

   import(data) {
      return api.post(API_CONFIG.endpoints.loadScenario, data); // import JSON
   }

   export(id) {
      return api.get(`${API_CONFIG.endpoints.scenarios}/${id}/export`, {
         responseType: "blob", // for downloading files
      });
   }
}

export const scenarioService = new ScenarioService();