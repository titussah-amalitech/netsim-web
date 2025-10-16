import { NavLink } from "react-router-dom";
import { navItems } from "../../constants";
import { Logo } from "../common";
import { ThemeToggle } from "../common/ThemeToggle";

export const Sidebar = () => {
  const isGameActive = true;

  return (
    <aside className="w-64 h-full bg-network-lighter border border-network-border-light  dark:bg-network-darker dark:border-network-border">
      <div className="p-6 h-full flex flex-col">
        <div className="flex items-center space-x-3 mb-8">
          <Logo />
          <div>
            <h2 className="text-network-text-darker dark:text-white font-semibold">NetSim</h2>
            <p className="text-network-text-dark dark:text-network-text text-sm">Training Platform</p>
          </div>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive
                  ? "bg-network-primary-light text-white dark:bg-network-primary"
                  : "text-network-text-dark hover:bg-network-surface-light hover:text-network-text-darker dark:text-network-text dark:hover:bg-network-surface dark:hover:text-white"
                }`
              }
            >
              <span className="text-lg">
                <item.icon className="h-5 w-5" />
              </span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {isGameActive && (
          <div className="mt-8 p-4 bg-network-surface-light rounded-lg dark:bg-network-surface">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-2 h-2 bg-network-success rounded-full animate-pulse"></div>
              <span className="text-network-success text-sm font-semibold">Game Running</span>
            </div>
            <p className="text-network-text-dark text-xs dark:text-network-text">
              Monitor your network and resolve issues to earn points!
            </p>
          </div>
        )}

        <div className="mt-auto">
          <ThemeToggle useSwitch={false} />
        </div>
      </div>
    </aside>
  );
};