export const DeviceLogCard = ({ device, message, time, indication, date }) => {
   let indColor
   if (indication === 'High') indColor = 'var(--color-network-error)'
   else if (indication === 'Medium') indColor = 'var(--color-network-warning)'
   else indColor = 'var(--color-network-success)'

   return (
      <div className="bg-network-lighter dark:bg-network-surface rounded-lg p-4 border border-network-border-light dark:border-network-border shadow-sm hover:shadow-sm transition-shadow my-2 flex w-full">
         <div
            className="h-3 w-3 rounded-full mt-1 me-4"
            style={{ backgroundColor: indColor }}
         />
         <div className="w-full">
            <div className="flex items-center justify-between">
               <p className="text-network-text-dark dark:text-network-text font-medium">
                  {device}
               </p>
               <span
                  className="px-2 py-1 rounded text-sm font-medium"
                  style={{ backgroundColor: indColor, color: '#fff' }}
               >
                  {indication}
               </span>
            </div>
            <p className="text-network-text-dark dark:text-network-text text-sm mt-2">
               {message}
            </p>
            <p className="text-network-text-dark dark:text-network-text text-xs mt-1">
               {date}, {time}
            </p>
         </div>
      </div>
   )
}