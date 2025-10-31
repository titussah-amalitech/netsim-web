import { TOOLS } from "../constants"
import { useState, useEffect, useRef, useCallback } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useSearchParams, useNavigate } from "react-router-dom"
import { Save, Upload, Trash2, Play, Link2, Unlink } from "lucide-react"
import { CANVAS_CONFIG } from "../../../constants"
import { useScenario } from "../hooks/useScenario"
import { useCanvasInteraction } from "../../../hooks/useCanvasInteraction"
import { fetchDevices } from "../../../store/device.slice"
import { Alert, Button, Canvas, Modal } from "../../../components"
import { DeviceProperties, ScenarioDetails, ScenarioProperties, ToolPalette } from "../components"
import { Loader } from "../../../components/common/Loader"
import { exportScenarioLocal, importScenarioFromFile, saveScenario, updateScenario, validateScenario } from "../services/scenarioOperations.service"
import { fetchScenarioById, setSelectedScenario } from "../store/scenario.slice"

export const ScenarioEditor = () => {
   const dispatch = useDispatch()
   const navigate = useNavigate()
   const [searchParams] = useSearchParams()
   const fileInputRef = useRef(null)

   const [alerts, setAlerts] = useState([])
   const [pendingScenario, setPendingScenario] = useState(null)
   const [selectedTool, setSelectedTool] = useState(TOOLS.SELECT)
   const [isEditMode, setIsEditMode] = useState(false)
   const [loadingScenario, setLoadingScenario] = useState(false)
   const [connectionMode, setConnectionMode] = useState({
      active: false,
      sourceDevice: null,
      mode: 'add' // 'add' or 'remove'
   })
   const [modalState, setModalState] = useState({
      clear: false,
      import: false,
      export: false,
   })

   const { selectedScenario } = useSelector((state) => state.scenarios)
   const { devices, loading, error } = useSelector((state) => state.devices)
   const { currentUser } = useSelector((state) => state.users);
   const isAdmin = currentUser?.role === "admin";

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
      addConnection,
      removeConnection,
      clearScenario,
      setScenario,
   } = useScenario()

   /** Alerts */
   const showAlert = useCallback((type, title, message) => {
      const id = Date.now()
      setAlerts((prev) => [...prev, { id, type, title, message }])
   }, [])

   const removeAlert = useCallback(
      (id) => setAlerts((prev) => prev.filter((a) => a.id !== id)),
      []
   )

   const handleConnectionStart = useCallback((device) => {
      setConnectionMode(prev => ({
         ...prev,
         sourceDevice: device
      }))
   }, [])

   const handleConnectionEnd = useCallback((targetDevice) => {
      if (!connectionMode.sourceDevice || connectionMode.sourceDevice._id === targetDevice._id) {
         setConnectionMode({ active: false, sourceDevice: null, mode: 'add' })
         return
      }

      if (connectionMode.mode === 'add') {
         addConnection(connectionMode.sourceDevice._id, targetDevice._id)
         showAlert("success", "Connection Added", `Connected ${connectionMode.sourceDevice.device.name} to ${targetDevice.device.name}`)
      } else {
         removeConnection(connectionMode.sourceDevice._id, targetDevice._id)
         showAlert("info", "Connection Removed", `Disconnected ${connectionMode.sourceDevice.device.name} from ${targetDevice.device.name}`)
      }

      setConnectionMode({ active: false, sourceDevice: null, mode: 'add' })
   }, [connectionMode.sourceDevice, connectionMode.mode, addConnection, showAlert, removeConnection])

   const toggleConnectionMode = useCallback((mode) => {
      if (connectionMode.active && connectionMode.mode === mode) {
         setConnectionMode({ active: false, sourceDevice: null, mode: 'add' })
         setSelectedTool(TOOLS.SELECT)
      } else {
         setConnectionMode({ active: true, sourceDevice: null, mode })
         setSelectedTool(TOOLS.SELECT)
      }
   }, [connectionMode])

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
      connectionMode,
      onDeviceAdd: (deviceType, x, y) => {
         const newDevice = addDevice(deviceType, x, y)
         setSelectedTool(TOOLS.SELECT)
         return newDevice
      },
      onDeviceMove: moveDevice,
      onDeviceSelect: setSelectedDevice,
      onConnectionStart: handleConnectionStart,
      onConnectionEnd: handleConnectionEnd,
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
         if (e.key === "Escape" && connectionMode.active) {
            setConnectionMode({ active: false, sourceDevice: null, mode: 'add' })
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
   }, [handlePointerUp, selectedDevice, deleteDevice, connectionMode.active])

   useEffect(() => {
      if (selectedScenario) {
         setScenario(selectedScenario)
         setIsEditMode(true)
         showAlert("info", "Scenario Loaded", `Loaded previously selected scenario: ${selectedScenario.name}`)
      }
   }, [selectedScenario, setScenario, showAlert])

   /** Load scenario from URL if id parameter exists */
   useEffect(() => {
      const scenarioId = searchParams.get("id")

      if (scenarioId) {
         setLoadingScenario(true)
         setIsEditMode(true)

         dispatch(fetchScenarioById(scenarioId))
            .unwrap()
            .then((data) => {
               if (data) {
                  setScenario(data)
                  showAlert("success", "Scenario Loaded", `Editing: ${data.name}`)
               } else {
                  showAlert("error", "Load Failed", "Scenario not found")
                  navigate("/scenario-editor")
               }
            })
            .catch((err) => {
               showAlert("error", "Load Failed", err.message || "Failed to load scenario")
               navigate("/scenario-editor")
            })
            .finally(() => {
               setLoadingScenario(false)
            })
      }
   }, [searchParams, dispatch, setScenario, navigate, showAlert])

   /** Scenario operations */
   const handleSaveScenario = useCallback(() => {
      if (isEditMode && scenario?.id) {
         updateScenario(scenario, dispatch, showAlert, () => {
            navigate('/scenario-library')
         })
      } else {
         saveScenario(scenario, dispatch, showAlert, clearScenario)
      }
   }, [scenario, dispatch, showAlert, clearScenario, isEditMode, navigate])

   const confirmExport = useCallback(() => {
      if (!scenario) {
         showAlert("error", "Export Failed", "No scenario available to export")
         return
      }
      exportScenarioLocal(scenario, showAlert)
      setModalState((prev) => ({ ...prev, export: false }))
   }, [scenario, showAlert])

   const handleImportScenario = useCallback(async (event) => {
      const file = event.target.files?.[0]
      if (!file) return

      try {
         const { isValid, errors, scenario: imported } = await importScenarioFromFile(file)

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
   }, [showAlert])

   const confirmImportScenario = useCallback(() => {
      if (!pendingScenario) return

      setScenario(pendingScenario)
      setSelectedDevice(null)
      setIsEditMode(false)
      showAlert("success", "Import Successful", "Scenario loaded successfully.")

      setPendingScenario(null)
      setModalState((prev) => ({ ...prev, import: false }))
   }, [pendingScenario, setScenario, setSelectedDevice, showAlert])

   const confirmClear = useCallback(() => {
      clearScenario()
      setIsEditMode(false)
      navigate('/scenario-editor', { replace: true })
      showAlert("info", "Scenario Cleared", "The scenario has been reset.")
      setModalState((prev) => ({ ...prev, clear: false }))
   }, [clearScenario, showAlert, navigate])

   const handleSimulateScenario = useCallback(() => {
      const validation = validateScenario(scenario)

      if (!validation.isValid) {
         showAlert("error", "Run Failed", validation.errors.join("\n"))
         return
      }

      dispatch(setSelectedScenario(scenario))
      navigate('/')
   }, [scenario, dispatch, navigate, showAlert])

   /** File upload trigger */
   const triggerFileInput = () => fileInputRef.current?.click()

   /** Handle modal toggle */
   const toggleModal = (name, isOpen) =>
      setModalState((prev) => ({ ...prev, [name]: isOpen }))

   /** UI Rendering */
   if (loading || loadingScenario) {
      return (
         <div className="flex items-center justify-center h-full w-full min-h-screen">
            <Loader />
         </div>
      )
   }

   if (error) return <p className="text-red-500">Error: {error}</p>

   return (
      <div className="min-h-screen bg-network-lighter dark:bg-network-graphite text-white rounded-lg">
         <div className="container mx-auto px-4 py-6">
            {/* Alerts */}
            <div className="space-y-3 mb-4">
               {alerts.map((a, idx) => (
                  <Alert
                     key={`${a.id} - ${idx}`}
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
                  <h1 className="text-2xl font-bold text-network-text-darker dark:text-network-lighter">
                     {(isEditMode && !!scenario?.id) ? 'Edit Scenario' : 'Scenario Editor'}
                  </h1>
                  <p className="text-gray-400">
                     {connectionMode.active
                        ? `${connectionMode.mode === 'add' ? 'Connect' : 'Disconnect'} Mode: ${connectionMode.sourceDevice ? 'Select target device' : 'Select source device'}`
                        : (isEditMode && !!scenario?.id) ? `Editing: ${scenario.name}` : 'Design and configure network scenarios'
                     }
                  </p>
               </div>

               <div className="flex gap-3">
                  <Button
                     variant="primary"
                     onClick={handleSimulateScenario}
                     className="px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                     title="Simulate scenario"
                  >
                     <Play className="w-4 h-4" /> Simulate
                  </Button>

                  {isAdmin && <>
                     <Button
                        variant={connectionMode.active && connectionMode.mode === 'add' ? 'success' : 'outline'}
                        onClick={() => toggleConnectionMode('add')}
                        className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${connectionMode.active && connectionMode.mode === 'add'
                           ? 'bg-network-success text-white'
                           : 'bg-network-surface'
                           }`}
                        title="Connect devices"
                     >
                        <Link2 size={18} /> Connect
                     </Button>

                     <Button
                        variant={connectionMode.active && connectionMode.mode === 'remove' ? 'danger' : 'outline'}
                        onClick={() => toggleConnectionMode('remove')}
                        className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${connectionMode.active && connectionMode.mode === 'remove'
                           ? 'bg-network-error text-white'
                           : 'bg-network-surface'
                           }`}
                        title="Disconnect devices"
                     >
                        <Unlink size={18} /> Disconnect
                     </Button>

                     <Button
                        variant="outline"
                        onClick={() => toggleModal("export", true)}
                        className="bg-network-surface px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                        title="Export scenario to JSON file"
                     >
                        <Save size={18} /> Export
                     </Button>

                     <Button
                        variant="outline"
                        onClick={handleSaveScenario}
                        className="bg-network-surface px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                        title={(isEditMode && !!scenario?.id) ? "Update scenario on server" : "Save scenario to server"}
                     >
                        <Save size={18} /> {(isEditMode && !!scenario?.id) ? 'Update' : 'Save'}
                     </Button>

                     <Button
                        variant="outline"
                        onClick={triggerFileInput}
                        className="bg-network-surface px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                        title="Import scenario from JSON file"
                     >
                        <Upload size={18} /> Import
                     </Button>
                  </>}

                  <Button
                     variant="outline"
                     onClick={() => toggleModal("clear", true)}
                     className="bg-network-surface px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
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
            <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-5 gap-6">
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
                     disabled={connectionMode.active}
                  />
               </div>

               <div className="lg:col-span-2 xl:col-span-3">
                  <Canvas
                     key={scenario?.id || scenario?.name || "canvas"}
                     canvasRef={canvasRef}
                     scenario={scenario}
                     selectedTool={selectedTool}
                     selectedDevice={selectedDevice}
                     connectionMode={connectionMode}
                     canvasSize={CANVAS_CONFIG.DEFAULT_CANVAS_SIZE}
                     onMouseMove={handleMouseMove}
                     onTouchMove={handleTouchMove}
                     onMouseDown={handleMouseDown}
                     onTouchStart={handleTouchStart}
                  />
               </div>
               {selectedDevice && !connectionMode.active && (
                  <DeviceProperties
                     device={selectedDevice}
                     onUpdateDevice={updateDevice}
                     onDeleteDevice={deleteDevice}
                     allDevices={scenario.devices}
                  />
               )}
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
}