import { useState, useEffect, useRef } from "react"
import { ChevronDown } from "lucide-react"

export const Dropdown = ({
  label,
  selected,
  options,
  error,
  onChange,
  placeholder = "Select an option",
  disabled = false,
  required = false,
  renderOption,   // prop for custom option rendering
  renderSelected, // prop for custom selected rendering
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [dropDirection, setDropDirection] = useState("down") // 'down' or 'up'
  const [shouldRender, setShouldRender] = useState(false) // Prevents flash
  const dropdownRef = useRef(null)
  const buttonRef = useRef(null)

  // Calculate dropdown direction based on available space
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect()
      const viewportHeight = window.innerHeight
      const spaceBelow = viewportHeight - buttonRect.bottom
      const spaceAbove = buttonRect.top
      const dropdownHeight = 240 // max-h-60 = 240px

      // If not enough space below but more space above, open upward
      if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
        setDropDirection("up")
      } else {
        setDropDirection("down")
      }

      // Render dropdown after direction is calculated
      setShouldRender(true)
    } else {
      setShouldRender(false)
    }
  }, [isOpen])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  // Helper function to get display label from option
  const getOptionLabel = (option) => {
    if (typeof option === "string") return option
    return option?.label || option?.name || option?.title || String(option)
  }

  // Helper function to get option value
  const getOptionValue = (option) => {
    if (typeof option === "string") return option
    return option?.value !== undefined ? option.value : option?.id || option
  }

  // Helper function to get the display text for selected value
  const getSelectedDisplay = () => {
    if (!selected) return placeholder

    if (renderSelected) return renderSelected(selected)

    // Normal handling (text fallback)
    const matchingOption = options.find((option) => {
      const optionValue = getOptionValue(option)
      return optionValue === selected
    })

    if (matchingOption) return getOptionLabel(matchingOption)

    if (typeof selected === "object" && selected !== null) {
      return getOptionLabel(selected)
    }

    return String(selected)
  }

  return (
    <div className={`relative bg-network-lighter dark:bg-network-surface w-full mb-6 ${className}`} ref={dropdownRef}>
      {label && (
        <label className="block text-network-gray-light dark:text-gray-300 text-sm mb-2 font-light tracking-wide">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        <button
          ref={buttonRef}
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={`w-full bg-network-lighter dark:bg-network-gray-light cursor-pointer border py-3 px-4 text-left rounded-md flex items-center justify-between transition-all focus:outline-none focus:ring-0 ${error
            ? "border-red-500 focus:ring-red-400"
            : "border-gray-300 dark:border-network-gray-light  "
            } ${disabled ? "bg-gray-200 dark:bg-gray-800 cursor-not-allowed" : ""}`}
        >
          <span className={selected ? "text-gray-900 dark:text-gray-100" : "text-gray-500 dark:text-gray-400"}>
            {getSelectedDisplay()}
          </span>
          <ChevronDown
            className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
        </button>

        {isOpen && !disabled && shouldRender && (
          <div
            className={`absolute z-10 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-network-gray-light rounded-md shadow-lg max-h-60 overflow-auto ${dropDirection === "up" ? "bottom-full mb-1" : "top-full mt-1"}`}
          >
            {options.map((option, index) => {
              const optionLabel = getOptionLabel(option)
              const optionValue = getOptionValue(option)

              return (
                <div
                  key={typeof option === "string" ? option : optionValue || index}
                  className="px-4 py-3 text-gray-900 dark:text-gray-100 hover:bg-blue-50 dark:hover:bg-network-graphite cursor-pointer transition-colors"
                  onClick={() => {
                    onChange(typeof option === "string" ? option : optionValue)
                    setIsOpen(false)
                  }}
                >
                  {renderOption ? renderOption(option) : optionLabel}
                </div>
              )
            })}
          </div>
        )}
      </div>
      {error && (
        <p className="text-red-500 text-xs mt-1 font-light">{error}</p>
      )}
    </div>
  )
}