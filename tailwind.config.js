/** @type {import('tailwindcss').Config} */
export default {
   content: [
      "./src/**/*.{js,jsx,ts,tsx}",
      "./app/**/*.{ts,tsx}",
      "./components/**/*.{ts,tsx}",
      "./features/**/*.{ts,tsx}",
   ],
  darkMode: ["class"],
   theme: {
      extend: {
         borderRadius: {
            lg: "var(--radius)",
            md: "calc(var(--radius) - 2px)",
            sm: "calc(var(--radius) - 4px)",
         },
         spacing: {
            18: "4.5rem",
            88: "22rem",
            128: "32rem",
         },
         transitionDuration: {
            250: "250ms",
            350: "350ms",
         },
         boxShadow: {
            network: "0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)",
            "network-lg": "0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)",
            "network-xl": "0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)",
            glow: "0 0 20px rgba(59, 130, 246, 0.3)",
         },
      },
   },
   plugins: [],
}