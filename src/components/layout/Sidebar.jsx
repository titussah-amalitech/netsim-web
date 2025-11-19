import { NavLink } from "react-router-dom";
import { navItems } from "../../constants";
import { Button, Logo } from "../common";
import { ThemeToggle } from "../common/ThemeToggle";
import { useDispatch, useSelector } from "react-redux";
import { clearUsers } from "../../store/user.slice";
import { LogOut } from "lucide-react";

export const Sidebar = () => {
  const dispatch = useDispatch();

  const { currentUser } = useSelector((state) => state.users);
  const isGameActive = true;

  const isAdmin = currentUser?.role === "admin";

  const handleSignOut = () => {
    dispatch(clearUsers());

    // Hard redirect to home page
    // window.history.pushState(null, "/", '');
    // window.onpopstate = () => {
    //   window.history.go(1);
    // };

      window.location.replace("/");
  };


  return (
    <aside className="w-64 h-full bg-network-lighter border border-network-border-light dark:bg-network-darker dark:border-network-border">
      <div className="p-6 h-full flex flex-col">
        {/* Logo & App Info */}
        <div className="flex items-center space-x-3 mb-8">
          <Logo />
          <div>
            <h2 className="text-network-text-darker dark:text-white font-semibold">
              NetSim
            </h2>
            <p className="text-network-text-dark dark:text-network-text text-sm">
              Training Platform
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-2">
          {navItems.map((item) =>
            item.path === "/scenario-editor" ? (
              isAdmin && <NavLink
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
            ) : (
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
            )
          )}
        </nav>

        {/* Game Status */}
        {isGameActive && (
          <div className="mt-8 p-4 bg-network-surface-light rounded-lg dark:bg-network-surface">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-2 h-2 bg-network-success rounded-full animate-pulse"></div>
              <span className="text-network-success text-sm font-semibold">
                Game Running
              </span>
            </div>
            <p className="text-network-text-dark text-xs dark:text-network-text">
              Monitor your network and resolve issues to earn points!
            </p>
          </div>
        )}

        {/* Bottom Section */}
        <div className="mt-auto space-y-4">
          <ThemeToggle useSwitch={false} />

          {currentUser && (
            <Button
              onClick={handleSignOut}
              className="flex w-full px-4 py-2 bg-red-400/80 hover:bg-red-400 text-white gap-2 rounded-lg text-sm font-medium transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          )}
        </div>
      </div>
    </aside>
  );
};
