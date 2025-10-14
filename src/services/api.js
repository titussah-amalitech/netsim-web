import { API_CONFIG } from "../constants/apiConfig";

/**
 * A lightweight API client wrapper around Fetch API.
 * Provides methods for GET, POST, PUT, and DELETE requests.
 * 
 *  @param {string} baseUrl - The base URL for all API requests.
 */

export class ApiClient {
   constructor(baseUrl = API_CONFIG.BASE_URL) {
      this.baseUrl = baseUrl;
   }

   async request(endpoint, options = {}) {
      const url = `${this.baseUrl}${endpoint}`;

      const defaultHeaders = { "Content-Type": "application/json" };

      const response = await fetch(url, {
         headers: { ...defaultHeaders, ...options.headers },
         ...options,
      });

      let data;
      try {
         data = await response.json();
      } catch {
         data = null;
      }

      if (!response.ok) {
         // Use server-provided message if exists
         const message = data?.message || response.statusText || "Unknown error";
         throw new Error(`API Error (${response.status}): ${message}`);
      }

      return data;
   }

   /** Perform a GET request */
   get(endpoint) {
      return this.request(endpoint);
   }


   /** Perform a POST request */
   post(endpoint, body) {
      return this.request(endpoint, { method: "POST", body: JSON.stringify(body) });
   }

   /** Perform a PUT request */
   put(endpoint, body) {
      return this.request(endpoint, { method: "PUT", body: JSON.stringify(body) });
   }

   /** Perform a DELETE request */
   delete(endpoint) {
      return this.request(endpoint, { method: "DELETE" });
   }
}

/** Singleton instance of ApiClient for shared use */
export const api = new ApiClient();