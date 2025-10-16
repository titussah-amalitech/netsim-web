export const StatCard = ({ label, value, color = "text-network-primary" }) => {
   return (
      <div
         className="bg-network-lighter dark:bg-network-surface rounded-lg p-4 border  border-network-border-light dark:border-network-border shadow-sm hover:shadow-sm transition-shadow"
      >
         <div className="text-sm text-network-text-dark dark:text-network-text mb-1">
            {label}
         </div>
         <div className={`text-2xl font-bold ${color}`}>
            {value?.toLocaleString?.() ?? value}
         </div>
      </div>
   );
};
