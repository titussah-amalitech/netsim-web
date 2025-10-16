import { localStorageService } from "../utils/localStorageService";

export class EntityService {
   constructor(key) {
      this.key = key; // e.g., "devices", "scenarios"
   }

   getAll() {
      return Promise.resolve(localStorageService.get(this.key) || []);
   }

   getById(id) {
      const items = localStorageService.get(this.key);
      const item = items.find((i) => i.id === id);

      return Promise.resolve(item || null);
   }


   create(data) {
      // If data is an array, save each item separately
      if (Array.isArray(data)) {
         data.forEach((item) => localStorageService.add(this.key, { ...item, id: Date.now() + Math.random() }));
         return Promise.resolve(data);
      }

      // If data is a single object, save it normally
      const newItem = { ...data, id: Date.now() };
      localStorageService.add(this.key, newItem);
      return Promise.resolve(newItem);
   }

   update(id, data) {
      localStorageService.update(this.key, id, data);
      const updated = localStorageService.get(this.key).find((e) => e.id === id);

      return Promise.resolve(updated);
   }

   remove(id) {
      localStorageService.remove(this.key, id);

      return Promise.resolve();
   }
}

export const entityService = new EntityService();