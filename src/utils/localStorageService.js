export const localStorageService = {
  // Get data from localStorage
  get: (key, defaultValue = []) => {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultValue;
    } catch (err) {
      console.error(`Error reading key "${key}" from localStorage`, err);
      return defaultValue;
    }
  },

  // Set data to localStorage
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.error(`Error writing key "${key}" to localStorage`, err);
    }
  },


  // Add item to an array in localStorage
  add: (key, item) => {
    const arr = localStorageService.get(key);
    arr.push(item);
    localStorageService.set(key, arr);
  },

  // Update item by id
  update: (key, id, newItem) => {
    const arr = localStorageService.get(key);
    const index = arr.findIndex((i) => i.id === id);
    if (index !== -1) {
      arr[index] = { ...arr[index], ...newItem };
      localStorageService.set(key, arr);
    }
  },

  // Remove item by id
  remove: (key, id) => {
    let arr = localStorageService.get(key);
    console.log(arr)
    arr = arr.filter((i) => i.id !== id);
    localStorageService.set(key, arr);
  },
};
