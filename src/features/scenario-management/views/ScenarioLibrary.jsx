import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Library, Play, Edit, Trash2, Plus, Clock, Target, BookOpen } from "lucide-react";
import { fetchScenarios } from "../store/scenario.slice";
import { scenarioService } from "../../../services";
import { Alert, Button, Modal } from "../../../components";
import { StatCard } from "../../../components/common/StatCard";
import { Loader } from "../../../components/common/Loader";

export const ScenarioLibrary = () => {
   const dispatch = useDispatch();
   const navigate = useNavigate();

   const { scenarios, loading, error } = useSelector((state) => state.scenarios);
   // TODO: UPDATE THE USER FOR ADMIN LOGIC
   // const userRole = useSelector((state) => state.auth?.user?.role || "user");
   // const isAdmin = userRole === "admin";
   const isAdmin = true;

   const [alerts, setAlerts] = useState([]);
   const [deleteConfirm, setDeleteConfirm] = useState(null);

   useEffect(() => {
      dispatch(fetchScenarios());
   }, [dispatch]);

   // Alert helper
   const showAlert = (type, title, message) => {
      const id = Date.now();
      setAlerts((prev) => [...prev, { id, type, title, message }]);
   };

   const removeAlert = (id) => {
      setAlerts((prev) => prev.filter((a) => a.id !== id));
   };

   // Calculate stats
   const totalScenarios = scenarios?.length || 0;
   const easyScenarios = scenarios?.filter(s => s.difficulty === "easy").length || 0;
   const mediumScenarios = scenarios?.filter(s => s.difficulty === "medium").length || 0;
   const hardScenarios = scenarios?.filter(s => s.difficulty === "hard").length || 0;

   const handleRunScenario = (scenario) => {
      // TODO: Navigate to canvas view with scenario - implement when canvas view is ready
      showAlert("info", "Run Scenario", `Running scenario: ${scenario.name}`);
      console.log("Running scenario:", scenario);
   };

   // Navigate to scenario editor with scenario ID in URL
   const handleEditScenario = (scenario) => {
      navigate(`/scenario-editor?id=${scenario.id}`);
   };

   // Navigate to scenario editor for new scenario
   const handleCreateScenario = () => {
      navigate("/scenario-editor");
   };

   const handleDeleteScenario = async () => {
      if (!deleteConfirm) return;

      try {
         await scenarioService.remove(deleteConfirm.id);

         // Refresh scenarios list
         dispatch(fetchScenarios());

         showAlert("success", "Success", `Scenario "${deleteConfirm.name}" deleted successfully`);
         setDeleteConfirm(null);
      } catch (err) {
         showAlert("error", "Delete Failed", err.message || "Failed to delete scenario");
      }
   };

   if (loading) {
      return (
         <div className="flex items-center justify-center h-full w-full min-h-screen">
            <Loader />
         </div>
      );
   }

   return (
      <div className="min-h-screen bg-network-lighter dark:bg-network-graphite text-network-text-darker dark:text-white rounded-lg">
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
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
               <div className="flex items-center gap-3">
                  <div className="p-3 bg-network-light dark:bg-network-text-darker rounded-lg">
                     <BookOpen className="w-8 h-8 text-network-warning" />
                  </div>
                  <div>
                     <h1 className="text-2xl font-bold text-network-text-darker dark:text-network-lighter">
                        Scenario Library
                     </h1>
                     <p className="text-network-text-dark dark:text-gray-400">
                        Manage and run network simulation scenarios
                     </p>
                  </div>
               </div>

               {isAdmin && (
                  <Button
                     variant="primary"
                     onClick={handleCreateScenario}
                     className="flex items-center gap-2"
                  >
                     <Plus className="w-4 h-4" />
                     Create Scenario
                  </Button>
               )}
            </div>

            {/* Error State */}
            {error && (
               <div className="text-center py-16">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-network-error/10 rounded-full mb-4">
                     <Trash2 className="w-10 h-10 text-network-error" />
                  </div>
                  <h2 className="text-xl font-semibold text-network-text-darker dark:text-white mb-2">
                     Error Loading Scenarios
                  </h2>
                  <p className="text-network-text-dark dark:text-gray-400 mb-4">
                     {error}
                  </p>
                  <Button
                     variant="primary"
                     onClick={() => dispatch(fetchScenarios())}
                  >
                     Retry
                  </Button>
               </div>
            )}

            {/* Stats Cards */}
            {!error && scenarios && scenarios.length > 0 && (
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <StatCard
                     label="Total Scenarios"
                     value={totalScenarios}
                     color="text-network-lighter"
                  />
                  <StatCard
                     label="Easy"
                     value={easyScenarios}
                     color="text-network-lighter"
                  />
                  <StatCard
                     label="Medium"
                     value={mediumScenarios}
                     color="text-network-lighter"
                  />
                  <StatCard
                     label="Hard"
                     value={hardScenarios}
                     color="text-network-lighter"
                  />
               </div>
            )}

            {/* Empty State */}
            {!error && (!scenarios || scenarios.length === 0) && (
               <div className="text-center py-16">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-network-surface-light dark:bg-network-surface rounded-full mb-4">
                     <Library className="w-10 h-10 text-network-text-dark dark:text-network-text" />
                  </div>
                  <h2 className="text-xl font-semibold text-network-text-darker dark:text-white mb-2">
                     No Scenarios Yet
                  </h2>
                  <p className="text-network-text-dark dark:text-gray-400 mb-4">
                     {isAdmin
                        ? "Create your first scenario to get started"
                        : "No scenarios available at the moment"}
                  </p>
                  {isAdmin && (
                     <Button
                        variant="primary"
                        onClick={handleCreateScenario}
                        className="inline-flex items-center gap-2"
                     >
                        <Plus className="w-4 h-4" />
                        Create Scenario
                     </Button>
                  )}
               </div>
            )}

            {/* Scenarios Grid */}
            {!error && scenarios && scenarios.length > 0 && (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {scenarios.map((scenario) => (
                     <div
                        key={scenario.id}
                        className="bg-network-lighter dark:bg-network-surface rounded-lg border border-network-border-light dark:border-network-border shadow-sm hover:shadow-md transition-all overflow-hidden"
                     >
                        {/* Card Header */}
                        <div className="p-4 border-b border-network-border-light dark:border-network-border">
                           <div className="flex items-start justify-between mb-2">
                              <h3 className="text-lg font-semibold text-network-text-darker dark:text-white truncate flex-1">
                                 {scenario.name}
                              </h3>
                              <span
                                 className="text-network-text px-2 py-1 text-xs font-medium rounded border"
                              >
                                 {scenario.difficulty?.toUpperCase()}
                              </span>
                           </div>
                           <p className="text-sm text-network-text-dark dark:text-network-text line-clamp-2">
                              {scenario.description || "No description provided"}
                           </p>
                        </div>

                        {/* Card Body */}
                        <div className="p-4 space-y-3">
                           <div className="flex items-center gap-4 text-sm">
                              <div className="flex items-center gap-2 text-network-text-dark dark:text-network-text">
                                 <Clock className="w-4 h-4" />
                                 <span>{scenario.timeLimit || 60}s</span>
                              </div>
                              <div className="flex items-center gap-2 text-network-text-dark dark:text-network-text">
                                 <Target className="w-4 h-4" />
                                 <span>{scenario.devices?.length || 0} devices</span>
                              </div>
                           </div>

                           {/* Actions */}
                           <div className="flex gap-2 pt-2">
                              <Button
                                 variant="primary"
                                 onClick={() => handleRunScenario(scenario)}
                                 className="flex-1 flex items-center justify-center gap-2 text-sm"
                                 size="small"
                              >
                                 <Play className="w-4 h-4" />
                                 Run
                              </Button>

                              {isAdmin && (
                                 <>
                                    <Button
                                       variant="outline"
                                       onClick={() => handleEditScenario(scenario)}
                                       className="flex items-center justify-center gap-2 text-sm border-network-info text-network-info hover:bg-network-info/10"
                                       size="small"
                                    >
                                       <Edit className="w-4 h-4" />
                                    </Button>
                                    <Button
                                       variant="outline"
                                       onClick={() => setDeleteConfirm(scenario)}
                                       className="flex items-center justify-center gap-2 text-sm border-network-error text-network-error hover:bg-network-error/10"
                                       size="small"
                                    >
                                       <Trash2 className="w-4 h-4" />
                                    </Button>
                                 </>
                              )}
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
            )}

            {/* Delete Confirmation Modal */}
            <Modal
               title="Confirm Delete"
               isOpen={!!deleteConfirm}
               showCloseButton={false}
               onClose={() => setDeleteConfirm(null)}
            >
               <p className="mb-4 text-network-text-dark dark:text-network-text">
                  Are you sure you want to delete <strong>"{deleteConfirm?.name}"</strong>? This action cannot be undone.
               </p>

               <div className="flex justify-end gap-3">
                  <Button
                     variant="secondary"
                     onClick={() => setDeleteConfirm(null)}
                  >
                     Cancel
                  </Button>
                  <Button
                     variant="danger"
                     onClick={handleDeleteScenario}
                  >
                     Delete
                  </Button>
               </div>
            </Modal>
         </div>
      </div>
   );
};