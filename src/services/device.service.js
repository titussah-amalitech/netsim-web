import { API_CONFIG } from "../constants/apiConfig";
import { api } from "./api";

class DeviceService {
   getAll() {
      return api.get(API_CONFIG.endpoints.devices);
   }

   getById(id) {
      return api.get(`${API_CONFIG.endpoints.devices}/${id}`);
   }

   create(data) {
      return api.post(API_CONFIG.endpoints.devices, data);
   }

   update(id, data) {
      return api.put(`${API_CONFIG.endpoints.devices}/${id}`, data)
   }

   remove(id) {
      return api.delete(`${API_CONFIG.endpoints.devices}/${id}`);
   }
}

export const deviceService = new DeviceService();