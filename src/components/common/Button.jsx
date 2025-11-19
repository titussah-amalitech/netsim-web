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
      "inline-flex items-center justify-center font-medium rounded-lg dark:focus:ring-offset-network-dark disabled:opacity-50 disabled:cursor-not-allowed"

   const variants = {
      primary: "bg-network-primary text-white hover:bg-network-primary-dark focus:ring-network-primary",
      secondary: "bg-network-surface-light text-network-text-darker hover:bg-network-border-light dark:bg-network-surface dark:text-network-text-light dark:hover:bg-network-border focus:ring-network-secondary",
      outline:
         "border-2 border-network-border-light text-network-text-darker bg-transparent hover:bg-network-surface-light dark:border-network-border dark:text-network-text dark:hover:bg-network-surface ",
      danger: "bg-network-error text-white hover:bg-network-error/90 focus:ring-network-error",
      success: "bg-network-success text-white hover:bg-network-success/90 focus:ring-network-success",
   }

   const sizes = {
      small: "px-3 py-2 text-sm",
      medium: "px-4 py-2.5 text-sm",
      large: "px-6 py-3 text-base",
      xl: "px-8 py-4 text-base",
   }

   const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`

   return (
      <button type={type} onClick={onClick} aria-label={title} disabled={disabled} className={`${classes} cursor-pointer`} {...props}>
         {children}
      </button>
   )
}