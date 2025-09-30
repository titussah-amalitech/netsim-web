import { NavLink } from "react-router-dom"
import { navItems } from "../../constants";
import { Logo } from "../common";

export const Sidebar = () => {
   const isGameActive = true;

   return (
      <aside className="w-64 bg-network-darker border-r border-network-border">
         <div className="p-6">
            <div className="flex items-center space-x-3 mb-8">
               <Logo />
               <div>
                  <h2 className="text-white font-semibold">NetSim</h2>
                  <p className="text-network-text text-sm">Training Platform</p>
               </div>
            </div>

            <nav className="space-y-2">
               {navItems.map((item) => (
                  <NavLink
                     key={item.path}
                     to={item.path}
                     className={({ isActive }) =>
                        `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive
                           ? "bg-network-primary text-white"
                           : "text-network-text hover:bg-network-surface hover:text-white"
                        }`
                     }
                  >
                     <span className="text-lg">{item.icon}</span>
                     <span>{item.label}</span>
                  </NavLink>
               ))}
            </nav>

            {isGameActive && (
               <div className="mt-8 p-4 bg-network-surface rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                     <div className="w-2 h-2 bg-network-success rounded-full animate-pulse"></div>
                     <span className="text-network-success text-sm font-semibold">Game Running</span>
                  </div>
                  <p className="text-network-text text-xs">Monitor your network and resolve issues to earn points!</p>
               </div>
            )}
         </div>
      </aside>
   )
}