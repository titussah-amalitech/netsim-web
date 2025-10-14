import React from 'react'

export const LoadingSpinner = ({ size = "medium", className = "" }) => {
   const sizeClasses = {
      small: "w-4 h-4",
      medium: "w-8 h-8",
      large: "w-12 h-12",
   }

   return (
      <div
         className={`inline-block animate-spin rounded-full border-2 border-network-border border-t-network-primary ${sizeClasses[size]} ${className}`}
      >
         <span className="sr-only">Loading...</span>
      </div>
   )
}