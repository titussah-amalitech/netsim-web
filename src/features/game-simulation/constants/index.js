

export const TEST_SCENARIO = {
  name: "University Network Outage",
  difficulty: "hard",
  timeLimit: 600, // 10 minutes
  devices: [
    {
      id: "router-01",
      type: "router",
      name: "Main Campus Router",
      status: "red", // offline
      ip: "192.168.1.1",
      connections: ["switch-01", "server-01"],
      position: { x: 200, y: 100 },
      message: "Router disconnected — no packets being transmitted.",
    },
    {
      id: "switch-01",
      type: "switch",
      name: "Core Switch",
      status: "yellow", // high latency
      ip: "192.168.1.2",
      connections: ["router-01", "workstation-01", "workstation-02"],
      position: { x: 450, y: 100 },
      message: "Packet loss detected — latency exceeding 250ms.",
    },
    {
      id: "server-01",
      type: "server",
      name: "Database Server",
      status: "green", // online
      ip: "192.168.1.3",
      connections: ["router-01"],
      position: { x: 700, y: 80 },
      message: "Operational — 2 queries/sec load.",
    },
    {
      id: "workstation-01",
      type: "pc",
      name: "Admin Workstation",
      status: "green",
      ip: "192.168.1.10",
      connections: ["switch-01"],
      position: { x: 400, y: 300 },
      message: "Running network monitoring tool.",
    },
    {
      id: "workstation-02",
      type: "pc",
      name: "Student Lab PC",
      status: "yellow",
      ip: "192.168.1.11",
      connections: ["switch-01"],
      position: { x: 600, y: 300 },
      message: "Experiencing connection drops to server.",
    },
  ],
  metadata: {
    description:
      "A simulated outage scenario at the university network where the main router is offline and the switch is experiencing latency. The player must diagnose and restore connectivity before the time runs out.",
    createdBy: "admin",
    createdAt: new Date().toISOString(),
  },
};


export const officeNetworkScenario = {
  _id: "scenario_001",
  name: "Office Network",
  difficulty: "easy",
  timeLimit: 900,
  devices: [
    {
      _id: "temp_1759761987795",
      device: { name: "Router_1", type: "router" },
      position: { x: 680, y: 280 },
      parameters: {
        pingInterval: 30,
        latencyThreshold: 100,
        failureProbability: 0.1,
        trafficLoad: 0,
      },
      status: {
        online: true,
        latency: 0,
        lastChecked: "2025-10-06T14:46:27.795Z",
      },
      connections: ["temp_1759762003616", "temp_1759762010208"], // Switch_1, Access Point_1
    },
    {
      _id: "temp_1759761997997",
      device: { name: "Server_1", type: "server" },
      position: { x: 240, y: 360 },
      parameters: {
        pingInterval: 30,
        latencyThreshold: 100,
        failureProbability: 0.1,
        trafficLoad: 0,
      },
      status: {
        online: true,
        latency: 0,
        lastChecked: "2025-10-06T14:46:37.997Z",
      },
      connections: ["temp_1759762003616"], // Connected to Switch_1
    },
    {
      _id: "temp_1759761999629",
      device: { name: "Database_1", type: "database" },
      position: { x: 80, y: 320 },
      parameters: {
        pingInterval: 30,
        latencyThreshold: 100,
        failureProbability: 0.1,
        trafficLoad: 0,
      },
      status: {
        online: true,
        latency: 0,
        lastChecked: "2025-10-06T14:46:39.629Z",
      },
      connections: ["temp_1759761997997"], // Connected to Server_1
    },
    {
      _id: "temp_1759762003616",
      device: { name: "Switch_1", type: "switch" },
      position: { x: 560, y: 400 },
      parameters: {
        pingInterval: 30,
        latencyThreshold: 100,
        failureProbability: 0.1,
        trafficLoad: 0,
      },
      status: {
        online: true,
        latency: 0,
        lastChecked: "2025-10-06T14:46:43.616Z",
      },
      connections: ["temp_1759761987795", "temp_1759761997997"], // Router_1, Server_1
    },
    {
      _id: "temp_1759762007651",
      device: { name: "PC_1", type: "pc" },
      position: { x: 200, y: 560 },
      parameters: {
        pingInterval: 30,
        latencyThreshold: 100,
        failureProbability: 0.1,
        trafficLoad: 0,
      },
      status: {
        online: true,
        latency: 70,
        lastChecked: "2025-10-06T14:46:47.651Z",
      },
      connections: ["temp_1759762003616"], // Connected to Switch_1
    },
    {
      _id: "temp_1759762010208",
      device: { name: "Access Point_1", type: "accessPoint" },
      position: { x: 720, y: 480 },
      parameters: {
        pingInterval: 30,
        latencyThreshold: 100,
        failureProbability: 0.1,
        trafficLoad: 0,
      },
      status: {
        online: true,
        latency: 100,
        lastChecked: "2025-10-06T14:46:50.208Z",
      },
      connections: ["temp_1759761987795"], // Connected to Router_1
    },
    {
      _id: "temp_1759762012281",
      device: { name: "Server S1", type: "server" },
      position: { x: 800, y: 80 },
      parameters: {
        pingInterval: 30,
        latencyThreshold: 200,
        failureProbability: 0.9,
        trafficLoad: 0,
        problemType: "packet_drops",
      },
      status: {
        online: false,
        latency: 0,
        lastChecked: "2025-10-06T14:46:52.281Z",
      },
      connections: ["temp_1759761987795"], // Connected to Router_1
    },
  ],
  metadata: {
    description: "Office network topology for testing",
    createdBy: "admin",
    createdAt: "2025-10-06T14:08:34.050Z",
  },
};
