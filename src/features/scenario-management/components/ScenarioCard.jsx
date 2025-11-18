import { Play, Edit, Trash2, Clock, Target } from "lucide-react";
import { Button } from "../../../components";

export const ScenarioCard = ({ scenario, isAdmin, setDeleteConfirm, handleEditScenario, handleRunScenario }) => {
   return (
      <div
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
                  Play
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
   )
}
