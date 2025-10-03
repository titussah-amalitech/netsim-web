import { FaDeleteLeft } from "react-icons/fa6";
import { TiTick } from "react-icons/ti";
import { ImCross } from "react-icons/im";
import { IoWarning } from "react-icons/io5";
import { useEffect, useState } from "react";
import { useTheme } from "../../../hooks/useTheme"; 

const DeviceStatusIndicator = () => {
  const [allAlerts, setAllAlerts] = useState([]);
  const { theme } = useTheme(); 
  const isDarkMode = theme === "dark";

  const deviceStatus = [
    {
      device: "Database server",
      message: "Database Server: High latency: 38ms, Packet loss: 4%",
      indication: "High",
    },
    {
      device: "Workstation 1",
      message: "Workstation 1: Performance degraded",
      indication: "Medium",
    },
    {
      device: "Web Server",
      message: "Device Workstation 2 status changed from critical to online",
      indication: "Low",
    },
  ];

  const refereshStatus = () => {
    const randomStatus = Math.floor(Math.random() * deviceStatus.length);
    const device = {
      ...deviceStatus[randomStatus],
      time: new Date().toLocaleTimeString(),
      id: Date.now() + "-" + randomStatus,
    };
    setAllAlerts((prevState) => [device, ...prevState]);
  };

  useEffect(() => {
    const intervalId = setInterval(refereshStatus, 1000 * 30);
    return () => clearInterval(intervalId);
  }, []);

  const dismissAlert = (id) => {
    setAllAlerts((prevState) => prevState.filter((a) => a.id !== id));
  };

  const clearAllAlerts = () => {
    setAllAlerts([]);
  };

  const ActiveAlerts = ({ device, message, time, indication, id }) => {
    let indColor;
    if (indication === "High") {
      indColor = "var(--color-network-error)";
    } else if (indication === "Medium") {
      indColor = "var(--color-network-warning)";
    } else {
      indColor = "var(--color-network-success)";
    }

    return (
      <div
        className="status rounded-xl flex max-w-150 p-4 my-4 w-full justify-between"
        style={{
          backgroundColor: isDarkMode
            ? "var(--color-network-surface)"
            : "var(--color-network-surface-light)",
        }}
      >
        <div className="flex w-5/6">
          <div className="me-4">
            {indication === "High" ? (
              <ImCross color="var(--color-network-error)" size={24} />
            ) : indication === "Medium" ? (
              <IoWarning color="var(--color-network-warning)" size={32} />
            ) : (
              <TiTick color="var(--color-network-success)" size={36} />
            )}
          </div>
          <div className="w-3/4">
            <div className="flex">
              <p
                className="font-extrabold mt-2"
                style={{
                  color: isDarkMode
                    ? "var(--color-network-text-light)"
                    : "var(--color-network-text-darker)",
                }}
              >
                {device}
              </p>
              <p
                className="indicator text-white ms-5 rounded-sm font-bold px-2"
                style={{ backgroundColor: indColor }}
              >
                {indication}
              </p>
            </div>
            <p
              className="text-xs mt-2"
              style={{
                color: isDarkMode
                  ? "var(--color-network-text)"
                  : "var(--color-network-text-dark)",
              }}
            >
              {message}
            </p>
            <p
              className="text-xs mt-1"
              style={{
                color: isDarkMode
                  ? "var(--color-network-text)"
                  : "var(--color-network-text-dark)",
              }}
            >
              {time}
            </p>
          </div>
        </div>
        <div>
          <button
            className="dismiss rounded-sm font-bold ms-5"
            onClick={() => dismissAlert(id)}
          >
            <FaDeleteLeft
              color={
                isDarkMode
                  ? "var(--color-network-text)"
                  : "var(--color-network-text-dark)"
              }
              size={32}
            />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div
      className="alerts-container p-8 rounded-3xl max-w-180"
      style={{
        backgroundColor: isDarkMode
          ? "var(--color-network-gray-light)"
          : "var(--color-network-light)",
      }}
    >
      <div className="flex justify-between">
        <p
          className="active-alerts text-3xl font-bold"
          style={{
            color: isDarkMode
              ? "var(--color-network-text-light)"
              : "var(--color-network-text-darker)",
          }}
        >
          Active Alerts
        </p>
        <div className="flex mt-2">
          <div className="dimming-alert h-3 w-3 rounded-full mt-2 me-2"></div>
          <p
            className="text-xl"
            style={{
              color: isDarkMode
                ? "var(--color-network-text)"
                : "var(--color-network-text-dark)",
            }}
          >
            {allAlerts.length} active
          </p>
        </div>
      </div>
      <div className="system-logs max-h-100 overflow-auto">
        {allAlerts.map((dev) => (
          <ActiveAlerts key={dev.id} {...dev} />
        ))}
      </div>
      <hr
        className="mt-8"
        style={{
          color: isDarkMode
            ? "var(--color-network-border)"
            : "var(--color-network-border-light)",
        }}
      />
      <button
        className="clear-all-alerts w-full border rounded-xl my-4 py-2 text-xl"
        style={{
          color: isDarkMode
            ? "var(--color-network-text-light)"
            : "var(--color-network-text-darker)",
          borderColor: isDarkMode
            ? "var(--color-network-border-light)"
            : "var(--color-network-border)",
        }}
        onClick={clearAllAlerts}
      >
        Clear All Alerts
      </button>
    </div>
  );
};

export default DeviceStatusIndicator;
