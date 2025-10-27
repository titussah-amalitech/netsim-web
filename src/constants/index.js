import {
   Monitor,
   Router,
   Server,
   Grid,
   Database,
   Cloud,
   Shield,
   Wifi,
   Globe,
   LayoutDashboard,
   Settings,
   BookOpen,
   Trophy
} from 'lucide-react';

export const DEVICE_TYPES = {
   router: {
      name: "Router",
      icon: Router,
      color: "#60A5FA",
      bgColor: "#1E40AF"
   },
   switch: {
      name: "Switch",
      icon: Grid,
      color: "#34D399",
      bgColor: "#047857"
   },
   server: {
      name: "Server",
      icon: Server,
      color: "#A78BFA",
      bgColor: "#5B21B6"
   },
   pc: {
      name: "PC",
      icon: Monitor,
      color: "#FBBF24",
      bgColor: "#B45309"
   },
   firewall: {
      name: "Firewall",
      icon: Shield,
      color: "#F87171",
      bgColor: "#7F1D1D"
   },
   accessPoint: {
      name: "Access Point",
      icon: Wifi,
      color: "#38BDF8",
      bgColor: "#0369A1"
   },
   database: {
      name: "Database",
      icon: Database,
      color: "#F472B6",
      bgColor: "#9D174D"
   },
   cloud: {
      name: "Cloud Service",
      icon: Cloud,
      color: "#94A3B8",
      bgColor: "#334155"
   },
   internet: {
      name: "Internet",
      icon: Globe,
      color: "#22D3EE",
      bgColor: "#155E75"
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
  { path: "/", label: "Game Dashboard", icon: LayoutDashboard },
  { path: "/scenario-editor", label: "Scenario Editor", icon: Settings },
  { path: "/scenario-library", label: "Scenario Library", icon: BookOpen },
  { path: "/leaderboard", label: "Leaderboard", icon: Trophy },
];