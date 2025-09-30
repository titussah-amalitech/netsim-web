import { TOOLS } from "../constants"
import { useState, useEffect, useRef, useCallback } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Save, Upload, Trash2 } from "lucide-react"
import { CANVAS_CONFIG } from "../../../constants"
import { useScenario } from "../hooks/useScenario"
import { useCanvasInteraction } from "../../../hooks/useCanvasInteraction"
import { fetchDevices } from "../../../store/device.slice"
import { exportScenarioLocal, importScenarioFromFile, saveScenario, } from "../services/scenarioOperations.service"
import { Alert, Button, Canvas, Modal, } from "../../../components"
import { DeviceProperties, ScenarioDetails, ScenarioProperties, ToolPalette, } from "../components"

export const ScenarioEditor = () => {
   const dispatch = useDispatch()
   const fileInputRef = useRef(null)

   const [alerts, setAlerts] = useState([])
   const [pendingScenario, setPendingScenario] = useState(null)
   const [selectedTool, setSelectedTool] = useState(TOOLS.SELECT)
   const [modalState, setModalState] = useState({
      clear: false,
      import: false,
      export: false,
   })

   const { devices, loading, error } = useSelector((state) => state.devices)

   const {
      scenario,
      selectedDevice,
      setSelectedDevice,
      updateScenarioProperty,
      updateMetadata,
      addDevice,
      updateDevice,
      deleteDevice,
      moveDevice,
      clearScenario,
      setScenario,
   } = useScenario()

   const {
      canvasRef,
      handleMouseDown,
      handleMouseMove,
      handleTouchStart,
      handleTouchMove,
      handlePointerUp,
   } = useCanvasInteraction({
      scenario,
      selectedTool,
      onDeviceAdd: (deviceType, x, y) => {
         const newDevice = addDevice(deviceType, x, y)
         setSelectedTool(TOOLS.SELECT)
         return newDevice
      },
      onDeviceMove: moveDevice,
      onDeviceSelect: setSelectedDevice,
   })

   /** Fetch devices on mount */
   useEffect(() => {
      dispatch(fetchDevices())
   }, [dispatch])

   /** Global event listeners */
   useEffect(() => {
      const handleGlobalMouseUp = () => handlePointerUp()
      const handleKeyDown = (e) => {
         if (e.key === "Delete" && selectedDevice) {
            deleteDevice(selectedDevice._id)
         }
      }

      window.addEventListener("mouseup", handleGlobalMouseUp)
      window.addEventListener("touchend", handleGlobalMouseUp)
      window.addEventListener("keydown", handleKeyDown)

      return () => {
         window.removeEventListener("mouseup", handleGlobalMouseUp)
         window.removeEventListener("touchend", handleGlobalMouseUp)
         window.removeEventListener("keydown", handleKeyDown)
      }
   }, [handlePointerUp, selectedDevice, deleteDevice])

   /** Alerts */
   const showAlert = useCallback((type, title, message) => {
      const id = Date.now()
      setAlerts((prev) => [...prev, { id, type, title, message }])
   }, [])

   const removeAlert = useCallback(
      (id) => setAlerts((prev) => prev.filter((a) => a.id !== id)),
      []
   );

   /** Scenario operations */
   const handleSaveScenario = useCallback(
      () => saveScenario(scenario, dispatch, showAlert),
      [scenario, dispatch, showAlert]
   );

   const confirmExport = useCallback(() => {
      if (!scenario) {
         showAlert("error", "Export Failed", "No scenario available to export")
         return
      }
      exportScenarioLocal(scenario, showAlert)
      setModalState((prev) => ({ ...prev, export: false }))
   }, [scenario, showAlert]);

   const handleImportScenario = useCallback(async (event) => {
      const file = event.target.files?.[0]
      if (!file) return

      try {
         const { isValid, errors, scenario: imported } = await importScenarioFromFile(file);

         if (!isValid) {
            showAlert("error", "Import Failed", errors.join("\n"))
            return
         }

         setPendingScenario(imported)
         setModalState((prev) => ({ ...prev, import: true }))
      } catch (err) {
         showAlert("error", "Import Failed", err.message)
      } finally {
         event.target.value = ""
      }
   }, [showAlert]);

   const confirmImportScenario = useCallback(() => {
      if (!pendingScenario) return

      setScenario(pendingScenario)
      setSelectedDevice(null)
      showAlert("success", "Import Successful", "Scenario loaded successfully.")

      setPendingScenario(null)
      setModalState((prev) => ({ ...prev, import: false }))
   }, [pendingScenario, setScenario, setSelectedDevice, showAlert])

   const confirmClear = useCallback(() => {
      clearScenario()
      showAlert("info", "Scenario Cleared", "The scenario has been reset.")
      setModalState((prev) => ({ ...prev, clear: false }))
   }, [clearScenario, showAlert])

   /** File upload trigger */
   const triggerFileInput = () => fileInputRef.current?.click()

   /** Handle modal toggle */
   const toggleModal = (name, isOpen) =>
      setModalState((prev) => ({ ...prev, [name]: isOpen }))

   /** UI Rendering */
   if (loading) return <p>Loading devices...</p>
   if (error) return <p className="text-red-500">Error: {error}</p>

   return (
      <div className="min-h-screen bg-gray-900 text-white">
         <div className="container mx-auto px-4 py-6">
            {/* Alerts */}
            <div className="space-y-3 mb-4">
               {alerts.map((a) => (
                  <Alert
                     key={a.id}
                     type={a.type}
                     title={a.title}
                     onClose={() => removeAlert(a.id)}
                  >
                     {a.message}
                  </Alert>
               ))}
            </div>

            {/* Header */}
            <div className="flex justify-between items-center mb-6">
               <div>
                  <h1 className="text-2xl font-bold">Scenario Editor</h1>
                  <p className="text-gray-400">
                     Design and configure network scenarios
                  </p>
               </div>

               <div className="flex gap-3">
                  <Button
                     onClick={() => toggleModal("export", true)}
                     className="px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                     title="Export scenario to JSON file"
                  >
                     <Save size={18} /> Export
                  </Button>

                  <Button
                     variant="success"
                     onClick={handleSaveScenario}
                     className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                     title="Save scenario to server"
                  >
                     <Save size={18} /> Save
                  </Button>

                  <Button
                     onClick={triggerFileInput}
                     className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                     title="Import scenario from JSON file"
                  >
                     <Upload size={18} /> Import
                  </Button>

                  <Button
                     onClick={() => toggleModal("clear", true)}
                     className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                     title="Clear current scenario"
                  >
                     <Trash2 size={18} /> Clear
                  </Button>
               </div>

               <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  className="hidden"
                  onChange={handleImportScenario}
               />
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
               <div className="space-y-6">
                  <ScenarioProperties
                     scenario={scenario}
                     onUpdateProperty={updateScenarioProperty}
                     onUpdateMetadata={updateMetadata}
                  />
                  <ToolPalette
                     devices={devices}
                     selectedTool={selectedTool}
                     onToolSelect={setSelectedTool}
                  />
                  {selectedDevice && (
                     <DeviceProperties
                        device={selectedDevice}
                        onUpdateDevice={updateDevice}
                        onDeleteDevice={deleteDevice}
                     />
                  )}
               </div>

               <div className="xl:col-span-3">
                  <Canvas
                     canvasRef={canvasRef}
                     scenario={scenario}
                     selectedTool={selectedTool}
                     selectedDevice={selectedDevice}
                     canvasSize={CANVAS_CONFIG.DEFAULT_CANVAS_SIZE}
                     onMouseMove={handleMouseMove}
                     onTouchMove={handleTouchMove}
                     onMouseDown={handleMouseDown}
                     onTouchStart={handleTouchStart}
                  />
               </div>
            </div>
         </div>

         {/* Export Modal */}
         <Modal
            title="Confirm Export"
            isOpen={modalState.export}
            onClose={() => toggleModal("export", false)}
         >
            <p className="mb-4">
               You are about to export the current scenario as a JSON file. Continue?
            </p>

            {scenario && (
               <ScenarioDetails scenario={scenario} title="Scenario Details" />
            )}

            <div className="flex justify-end gap-3">
               <Button variant="secondary" onClick={() => toggleModal("export", false)}>
                  Cancel
               </Button>
               <Button variant="success" onClick={confirmExport}>
                  Export
               </Button>
            </div>
         </Modal>

         {/* Import Modal */}
         <Modal
            title="Confirm Import"
            isOpen={modalState.import}
            onClose={() => toggleModal("import", false)}
         >
            <p className="mb-4">
               You are about to import a new scenario. This will replace your current scenario.
            </p>

            {pendingScenario && (
               <ScenarioDetails scenario={pendingScenario} title="Pending Scenario" />
            )}

            <div className="flex justify-end gap-3">
               <Button variant="secondary" onClick={() => toggleModal("import", false)}>
                  Cancel
               </Button>
               <Button variant="success" onClick={confirmImportScenario}>
                  Continue
               </Button>
            </div>
         </Modal>

         {/* Clear Modal */}
         <Modal
            title="Confirm Clear"
            isOpen={modalState.clear}
            onClose={() => toggleModal("clear", false)}
            showCloseButton={false}
         >
            <p className="mb-4">
               Are you sure you want to clear the current scenario? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
               <Button variant="secondary" onClick={() => toggleModal("clear", false)}>
                  Cancel
               </Button>
               <Button variant="danger" onClick={confirmClear}>
                  Clear
               </Button>
            </div>
         </Modal>
      </div>
   )
};