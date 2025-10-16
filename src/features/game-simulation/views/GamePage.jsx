import { useState } from "react";
import { Button } from "../../../components";
import RealTimeAlerts from "../components/RealTimeAlerts";
import DeviceLogger from "../components/DeviceLogger";


export const GamePage = () => {
  const [showAlerts, setShowAlerts] = useState(false);
  

  const devices = [
   // { name: "Router-01", status: "yellow" },
   { name: "Switch-02", status: "red" },
  ];

  const alertStatus = () => {
   setShowAlerts(prev => !prev)
}

  return (
    <div className="bg-network-lighter dark:bg-network-graphite text-network-text-dark dark:text-network-light w-full min-h-full">
      <Button onClick={alertStatus}>Show Alerts</Button>

      {showAlerts && <RealTimeAlerts devices={devices} />}

      <div className="h-120" />
      <DeviceLogger />
    </div>
  );
};
