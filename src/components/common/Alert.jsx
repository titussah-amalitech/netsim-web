import { useEffect } from "react";
import { X, CheckCircle2, AlertTriangle, AlertCircle, Info } from "lucide-react";
import { Button } from "./Button";

export const Alert = ({
   type = "info",
   title,
   children,
   onClose,
   autoDismiss = true,
   className = "",
}) => {
   // Auto-dismiss logic
   useEffect(() => {
      if (!autoDismiss) return;
      const timer = setTimeout(() => {
         if (onClose) onClose();
      }, 4000);
      return () => clearTimeout(timer);
   }, [autoDismiss, onClose]);

   // Type → styles + icon
   const typeConfig = {
      success: {
         classes: "bg-green-50 border-green-500 text-green-800",
         icon: <CheckCircle2 className="h-5 w-5 text-green-600" />,
      },
      warning: {
         classes: "bg-yellow-50 border-yellow-500 text-yellow-800",
         icon: <AlertTriangle className="h-5 w-5 text-yellow-600" />,
      },
      error: {
         classes: "bg-red-50 border-red-500 text-red-800",
         icon: <AlertCircle className="h-5 w-5 text-red-600" />,
      },
      info: {
         classes: "bg-blue-50 border-blue-500 text-blue-800",
         icon: <Info className="h-5 w-5 text-blue-600" />,
      },
   };

   const { classes, icon } = typeConfig[type] || typeConfig.info;

   return (
      <div
         className={`fixed top-4 right-4 max-w-sm w-full shadow-lg rounded-lg border p-4 pr-10 flex items-start space-x-3 ${classes} ${className}`}
      >
         {/* Icon */}
         <div className="flex-shrink-0">{icon}</div>

         {/* Text */}
         <div className="flex-1">
            {title && <h4 className="font-semibold">{title}</h4>}
            <div className="text-sm">{children}</div>
         </div>

         {/* Close button overlay */}
         {onClose && (
            <Button
               variant=""
               onClick={onClose}
               title="Close alert"
               className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 cursor-pointer"
            >
               <X className="h-4 w-4" />
            </Button>
         )}
      </div>
   );
};
