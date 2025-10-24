import { createScenario, exportScenario, } from "../store/scenario.slice"
import { handleError } from "../../../utils/errorHandler"

// Validate scenario before save/export
export const validateScenario = (scenario) => {
   const errors = [];

   if (!scenario.name.trim()) {
      errors.push('Scenario name is required');
   }

   if (scenario.devices.length === 0) {
      errors.push('Scenario must contain at least one device');
   }

   if (scenario.timeLimit <= 0) {
      errors.push('Time limit must be greater than 0');
   }

   // Check for devices with duplicate names
   const deviceNames = scenario.devices.map(d => d.device?.name || d.name);
   const duplicateNames = deviceNames.filter((name, index) => deviceNames.indexOf(name) !== index);

   if (duplicateNames.length > 0) {
      errors.push(`Duplicate device names found: ${[...new Set(duplicateNames)].join(', ')}`);
   }

   return {
      isValid: errors.length === 0,
      errors
   };
};

// Generate scenario statistics
export const getScenarioStats = (scenario) => {
   const deviceTypes = {};
   const totalDevices = scenario.devices.length;

   scenario.devices.forEach(device => {
      const type = device.device?.type || device.type;
      deviceTypes[type] = (deviceTypes[type] || 0) + 1;
   });

   const onlineDevices = scenario.devices.filter(d => d.status?.online).length;
   const offlineDevices = totalDevices - onlineDevices;

   return {
      totalDevices,
      deviceTypes,
      onlineDevices,
      offlineDevices,
      difficulty: scenario.difficulty,
      timeLimit: scenario.timeLimit
   };
};

// Save scenario to server
export const saveScenario = async (scenario, dispatch, showAlert) => {
   try {
      const validation = validateScenario(scenario)
      if (!validation.isValid) {
         showAlert("error", "Save Failed", validation.errors.join("\n"))
         return
      }

      const resultAction = await dispatch(createScenario(scenario))
      if (createScenario.fulfilled.match(resultAction)) {
         showAlert("success", "Save Successful", "Scenario saved to server!")
      } else {
         throw new Error(resultAction.payload)
      }
   } catch (err) {
      handleError(err, "SaveScenario")
      showAlert("error", "Save Failed", err.message)
   }
}

// Export scenario as JSON
export const exportScenarioToFile = async (scenario, dispatch, showAlert) => {
   try {
      const validation = validateScenario(scenario)
      if (!validation.isValid) {
         showAlert("error", "Export Failed", validation.errors.join("\n"))
         return
      }

      const resultAction = await dispatch(exportScenario(scenario._id))
      if (exportScenario.fulfilled.match(resultAction)) {
         const data = resultAction.payload
         const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
         const url = URL.createObjectURL(blob)

         const link = document.createElement("a")
         link.href = url
         link.download = `${scenario.name || "scenario"}.json`
         link.click()

         showAlert("success", "Export Successful", "Scenario exported successfully!")
      } else {
         throw new Error(resultAction.payload)
      }
   } catch (err) {
      handleError(err, "ExportScenario")
      showAlert("error", "Export Failed", err.message)
   }
}

// Export the current editor scenario directly as JSON
export const exportScenarioLocal = (scenario, showAlert) => {
   try {
      const validation = validateScenario(scenario)
      if (!validation.isValid) {
         showAlert("error", "Save Failed", validation.errors.join("\n"))
         return
      }

      const blob = new Blob([JSON.stringify(scenario, null, 2)], {
         type: "application/json",
      });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `${scenario.name || "scenario"}.json`;
      link.click();

      showAlert("success", "export Successful", "Scenario exported locally!");
   } catch (err) {
      handleError(err, "ExportScenario")
      showAlert("error", "export Failed", err.message);
   }
};


// Import scenario from uploaded file
export const importScenarioFromFile = async (file) => {
   try {
      const text = await file.text()
      const json = JSON.parse(text)
      const validation = validateScenario(json)

      if (!validation.isValid) {
         return { isValid: false, errors: validation.errors, scenario: null }
      }

      return { isValid: true, errors: [], scenario: json }
   } catch (err) {
      handleError(err, "ImportScenario")
      return { isValid: false, errors: ["Invalid JSON file"], scenario: null }
   }
}