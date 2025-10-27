import { localStorageService } from "../utils/localStorageService";

export const seedDevices = () => {
  const seed = [
    {
      parameters: { pingInterval: 30, latencyThreshold: 80, failureProbability: 0.05, trafficLoad: 40 },
      _id: "68d6c11dbea78db8d55f1e43",
      name: "Router",
      type: "router",
    },
    {
      parameters: { pingInterval: 25, latencyThreshold: 50, failureProbability: 0.03, trafficLoad: 60 },
      _id: "68d6c140bea78db8d55f1e46",
      name: "Switch",
      type: "switch",
    },
    {
      parameters: { pingInterval: 20, latencyThreshold: 150, failureProbability: 0.08, trafficLoad: 70 },
      _id: "68d6c16abea78db8d55f1e4b",
      name: "Server",
      type: "server",
    },
    {
      parameters: { pingInterval: 30, latencyThreshold: 120, failureProbability: 0.02, trafficLoad: 30 },
      _id: "68d6c178bea78db8d55f1e4e",
      name: "PC",
      type: "pc",
    },
    {
      parameters: { pingInterval: 20, latencyThreshold: 200, failureProbability: 0.05, trafficLoad: 90 },
      _id: "68d6c20f5b8f1e48c702d8fd",
      name: "Database",
      type: "database",
    },
    {
      parameters: { pingInterval: 10, latencyThreshold: 60, failureProbability: 0.07, trafficLoad: 80 },
      _id: "68d6c2175b8f1e48c702d900",
      name: "AP",
      type: "accessPoint",
    },
    {
      parameters: { pingInterval: 15, latencyThreshold: 70, failureProbability: 0.1, trafficLoad: 50 },
      _id: "68d6c21e5b8f1e48c702d903",
      name: "Firewall",
      type: "firewall",
    },
    {
      parameters: { pingInterval: 5, latencyThreshold: 250, failureProbability: 0.15, trafficLoad: 95 },
      _id: "68d6c22c5b8f1e48c702d906",
      name: "Internet",
      type: "internet",
    },
  ];

  // Normalize to `id` so EntityService/localStorage helpers can work consistently
  const normalized = seed.map((d, i) => ({
    ...d,
    id: d._id || Date.now() + i,
  }));

  localStorageService.set("devices", normalized);
  return normalized;
};

export default seedDevices;
