import { Sun, Moon, Monitor } from "lucide-react"
import { Dropdown } from "./Dropdown"
import { useTheme } from "../../hooks/useTheme"

export const ThemeToggle = ({ useSwitch = true }) => {
   const { theme, changeTheme } = useTheme()

   const themeOptions = [
      { value: "light", label: "Light", icon: Sun },
      { value: "dark", label: "Dark", icon: Moon },
      { value: "system", label: "System", icon: Monitor },
   ]

   const currentTheme = themeOptions.find((option) => option.value === theme)

   // Switch toggle handler - toggles between light and dark only
   const handleSwitchToggle = () => {
      const newTheme = theme === "dark" ? "light" : "dark"
      changeTheme(newTheme)
   }

   // If useSwitch is true, render a toggle switch
   if (useSwitch) {
      return (
         <button
            onClick={handleSwitchToggle}
            className="relative inline-flex items-center h-6 w-11 rounded-full transition-colors focus:outline-none bg-network-border-light dark:bg-network-border cursor-pointer"
            aria-label="Toggle theme"
         >
            {/* Switch track background */}
            <span
               className={`inline-block h-4 w-4 transform rounded-full bg-white dark:bg-network-graphite transition-transform ${theme === "dark" ? "translate-x-6" : "translate-x-1"}`}
            >
               {/* Icon inside the switch */}
               {theme === "dark" ? (
                  <Moon className="w-3 h-3 text-white m-auto mt-0.5" />
               ) : (
                  <Sun className="w-3 h-3 text-network-warning m-auto mt-0.5" />
               )}
            </span>
         </button>
      )
   }

   // Otherwise, render the dropdown
   return (
      <Dropdown
         selected={currentTheme}
         options={themeOptions}
         onChange={changeTheme}
         className="min-w-[120px]"
         renderSelected={(option) => (
            <div className="flex items-center space-x-2">
               <option.icon className="w-4 h-4" />
               <span className="hidden sm:inline">{option.label}</span>
            </div>
         )}
         renderOption={(option) => (
            <div className="flex items-center space-x-2">
               <option.icon className="w-4 h-4" />
               <span>{option.label}</span>
            </div>
         )}
      />
   )
}