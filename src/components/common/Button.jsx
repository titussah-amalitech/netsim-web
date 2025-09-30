export const Button = ({
   children,
   onClick,
   type = "button",
   variant = "primary",
   size = "medium",
   disabled = false,
   title,
   className = "",
   ...props
}) => {
   const baseClasses =
      "inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-network-dark disabled:opacity-50 disabled:cursor-not-allowed"

   const variants = {
      primary: "bg-network-primary text-white hover:bg-network-primary/80 focus:ring-network-primary",
      secondary: "bg-network-surface text-white hover:bg-network-surface/80 focus:ring-network-surface",
      outline:
         "border border-network-border text-network-text hover:bg-network-surface hover:text-white focus:ring-network-primary",
      danger: "bg-network-error text-white hover:bg-network-error/80 focus:ring-network-error",
      success: "bg-network-success text-white hover:bg-network-success/80 focus:ring-network-success",
   }

   const sizes = {
      small: "px-3 py-2 text-sm",
      medium: "px-4 py-2.5 text-sm",
      large: "px-6 py-3 text-base",
   }

   const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`

   return (
      <button type={type} onClick={onClick} aria-label={title} disabled={disabled} className={`${classes} cursor-pointer`} {...props}>
         {children}
      </button>
   )
}
