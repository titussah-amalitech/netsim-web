import { X } from "lucide-react"
import { Button } from "./Button"

export const Modal = ({
   isOpen,
   onClose,
   title,
   children,
   size = "medium",
   showCloseButton = true,
   className = ""
}) => {
   if (!isOpen) return null

   const sizeClasses = {
      small: "max-w-md",
      medium: "max-w-2xl",
      large: "max-w-4xl",
      full: "max-w-7xl",
   }

   const handleBackdropClick = (e) => {
      if (e.target === e.currentTarget) onClose()
   }

   return (
      <div
         className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs"
         onClick={handleBackdropClick}
      >
         <div
            className={`bg-network-lighter dark:bg-gray-900 rounded-xl p-6 w-full ${sizeClasses[size]} ${className} shadow-xl`}>
            {/* Header */}
            {(title || showCloseButton) && (
               <div className="flex items-center justify-between mb-4 pb-2 border-b border-network-border-light dark:border-network-gray-light">
                  {title && <h2 className="text-xl font-semibold text-network-text-darker dark:text-white">{title}</h2>}
                  {showCloseButton && (
                     <Button
                        onClick={onClose}
                        variant="danger"
                        className="text-network-text-dark dark:text-gray-300 hover:text-network-text-darker dark:hover:text-white transition-colors p-2 hover:bg-network-surface-light dark:hover:bg-gray-800 rounded-lg"
                        title="Close modal"
                     >
                        <X />
                     </Button>
                  )}
               </div>
            )}

            {/* Modal body */}
            <div className="text-network-text-dark dark:text-gray-200">{children}</div>
         </div>
      </div>
   )
}