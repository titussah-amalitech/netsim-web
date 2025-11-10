


export const officeNetworkScenario = {
  _id: "scenario_001",
  name: "Office Network",
  difficulty: "easy",
  timeLimit: 50,
  devices: [
    {
      _id: "temp_1759761987795",
      device: { name: "Router_1", type: "router" },
      position: { x: 680, y: 280 },
      parameters: {
        pingInterval: 30,
        latencyThreshold: 50,
        failureProbability: 0.1,
        trafficLoad: 0,
      },
      deviceStatus: {
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
        latencyThreshold: 50,
        failureProbability: 0.1,
        trafficLoad: 0,
      },
      deviceStatus: {
        online: true,
        latency: 0,
        lastChecked: "2025-10-06T14:46:37.997Z",
      },
      connections: ["temp_1759762003616"], // Connected to Switch_1
    },
    {
      _id: "temp_1759762003616",
      device: { name: "Switch_1", type: "switch" },
      position: { x: 560, y: 400 },
      parameters: {
        pingInterval: 30,
        latencyThreshold: 50,
        failureProbability: 0.1,
        trafficLoad: 0,
      },
      deviceStatus: {
        online: true,
        latency: 0,
        lastChecked: "2025-10-06T14:46:43.616Z",
      },
      connections: ["temp_1759761987795", "temp_1759761997997"], // Router_1, Server_1
    },
  ],
  metadata: {
    description: "Office network topology for testing",
    createdBy: "admin",
    createdAt: "2025-10-06T14:08:34.050Z",
  },
};

