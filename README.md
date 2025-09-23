```markdown
# NetSim - Network Simulation Game App

---

A fully functional and responsive **React.js + Vite** web application for simulating network scenarios.  

---

## Tech Stack
- [Vite](https://vitejs.dev/) – Build tool for fast React development
- [React.js](https://reactjs.org/) – Frontend library
- [Tailwind CSS](https://tailwindcss.com/) – Utility-first CSS framework
- Vanilla CSS – Custom styles
- HTML5 Canvas – Network simulation rendering


## 📂 Project Structure

```

netsim-frontend/                                      # Root folder
├── public/                                           # Static files (favicon, manifest, etc.)
├── src/                                              # Source code
│   ├── assets/                                       # Images, icons, static resources
│   ├── components/                                   # Shared / reusable UI components
│   ├── context/                                      # Global React Context providers
│   ├── features/                                     # Feature-based modules
│   │   ├── game-simulation/                          # Core simulation feature
│   │   │   ├── components/                           # Simulation UI components
│   │   │   ├── constants/                            # Simulation constants / config
│   │   │   ├── hooks/                                # Simulation-specific custom hooks
│   │   │   ├── services/                             # Simulation logic / services
│   │   │   └── views/                                # Simulation pages and containers
│   │   │
│   │   ├── leaderboard/                              # Leaderboard feature
│   │   │   ├── components/                           # Leaderboard UI components
│   │   │   ├── constants/                            # Leaderboard constants / config
│   │   │   ├── hooks/                                # Leaderboard-specific hooks
│   │   │   ├── services/                             # Leaderboard logic (localStorage / export)
│   │   │   └── views/                                # Leaderboard pages
│   │   │
│   │   └── scenario-management/                      # Scenario create / load / save feature
│   │       ├── components/                           # Scenario management UI
│   │       ├── constants/                            # Scenario constants / config
│   │       ├── hooks/                                # Scenario-specific hooks
│   │       ├── services/                             # Scenario save/load logic (File API)
│   │       └── views/                                # Scenario pages
│   │
│   ├── hooks/                                        # Global reusable hooks
│   ├── services/                                     # Global API / utility services
│   ├── styles/                                       # Global and shared styles (Tailwind + CSS)
│   ├── utils/                                        # Helper functions and utilities
│   ├── App.css                                       # Root CSS file
│   ├── App.jsx                                       # Root React component
│   ├── index.css                                     # Global styles
│   └── main.jsx                                      # Application entry point
│
├── .gitignore                                        # Git ignore rules
├── eslint.config.js                                  # ESLint configuration
├── index.html                                        # HTML template
├── package.json                                      # Project metadata & scripts
├── package-lock.json                                 # Lockfile for npm
├── postcss.config.js                                 # PostCSS configuration (Tailwind)
├── tailwind.config.js                                # Tailwind CSS configuration
└── README.md                                         # Project README

## Setup & Run

Install dependencies:

```bash
npm install
````

Run development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```
