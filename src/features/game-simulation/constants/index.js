import { CiServer } from "react-icons/ci";
import { IoServer } from "react-icons/io5";
import { GiServerRack } from "react-icons/gi";
import { SiLinuxserver } from "react-icons/si";

export const TEST_SCENARIO = {
  name: "University Network Outage",
  difficulty: "hard",
  timeLimit: 600, // 10 minutes
  devices: [
    {
      id: "router-01",
      type: "Router",
      name: "Main Campus Router",
      status: "red", // offline
      ip: "192.168.1.1",
      connections: ["switch-01", "server-01"],
      location: { x: 200, y: 100 },
      message: "Router disconnected — no packets being transmitted.",
      icon: CiServer 
    },
    {
      id: "switch-01",
      type: "Switch",
      name: "Core Switch",
      status: "yellow", // high latency
      ip: "192.168.1.2",
      connections: ["router-01", "workstation-01", "workstation-02"],
      location: { x: 450, y: 100 },
      message: "Packet loss detected — latency exceeding 250ms.",
      icon: IoServer 
    },
    {
      id: "server-01",
      type: "Server",
      name: "Database Server",
      status: "green", // online
      ip: "192.168.1.3",
      connections: ["router-01"],
      location: { x: 700, y: 80 },
      message: "Operational — 2 queries/sec load.",
      icon: GiServerRack 
    },
    {
      id: "workstation-01",
      type: "PC",
      name: "Admin Workstation",
      status: "green",
      ip: "192.168.1.10",
      connections: ["switch-01"],
      location: { x: 400, y: 300 },
      message: "Running network monitoring tool.",
      icon: SiLinuxserver 
    },
    {
      id: "workstation-02",
      type: "PC",
      name: "Student Lab PC",
      status: "yellow",
      ip: "192.168.1.11",
      connections: ["switch-01"],
      location: { x: 600, y: 300 },
      message: "Experiencing connection drops to server.",
      icon: SiLinuxserver 
    },
  ],
  metadata: {
    description:
      "A simulated outage scenario at the university network where the main router is offline and the switch is experiencing latency. The player must diagnose and restore connectivity before the time runs out.",
    createdBy: "admin",
    createdAt: new Date().toISOString(),
  },
};
