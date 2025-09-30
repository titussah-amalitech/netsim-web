import {
   Monitor,
   Router,
   Server,
   Grid,
   Database,
   Cloud,
   Shield,
   Wifi,
   Globe
} from 'lucide-react';

export const DEVICE_TYPES = {
   router: {
      name: "Router",
      icon: Router,
      color: "#60A5FA",
      bgColor: "#2563EB"
   },
   switch: {
      name: "Switch",
      icon: Grid,
      color: "#34D399",
      bgColor: "#059669"
   },
   server: {
      name: "Server",
      icon: Server,
      color: "#A78BFA",
      bgColor: "#7C3AED"
   },
   pc: {
      name: "PC",
      icon: Monitor,
      color: "#FBBF24",
      bgColor: "#D97706"
   },
   firewall: {
      name: "Firewall",
      icon: Shield,
      color: "#F87171",
      bgColor: "#B91C1C"
   },
   accessPoint: {
      name: "Access Point",
      icon: Wifi,
      color: "#38BDF8",
      bgColor: "#0EA5E9"
   },
   database: {
      name: "Database",
      icon: Database,
      color: "#F472B6",
      bgColor: "#BE185D"
   },
   cloud: {
      name: "Cloud Service",
      icon: Cloud,
      color: "#94A3B8",
      bgColor: "#475569"
   },
   internet: {
      name: "Internet",
      icon: Globe,
      color: "#22D3EE",
      bgColor: "#0E7490"
   }
};


export const DIFFICULTY_OPTIONS = [
   { value: 'easy', label: 'Easy' },
   { value: 'medium', label: 'Medium' },
   { value: 'hard', label: 'Hard' }
];

export const CANVAS_CONFIG = {
   GRID_SIZE: 40,
   DEVICE_SIZE: 40,
   DEFAULT_CANVAS_SIZE: { width: 1000, height: 700 },
};

export const navItems = [
   { path: "/", label: "Game Dashboard", icon: "🎮" },
   { path: "/scenario-editor", label: "Scenario Editor", icon: "⚙️" },
   { path: "/scenarios", label: "Scenario Library", icon: "📚" },
   { path: "/leaderboard", label: "Leaderboard", icon: "🏆" },
]