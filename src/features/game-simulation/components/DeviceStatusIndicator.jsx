import { FaRegTrashAlt } from "react-icons/fa";
import { TiTick } from "react-icons/ti";
import { ImCross } from "react-icons/im";
import { IoWarning } from "react-icons/io5";
import { useEffect, useState } from "react";
import { useTheme } from "../../../hooks/useTheme"; 

const DeviceStatusIndicator = () => {
  const [allAlerts, setAllAlerts] = useState([]);
  const { theme } = useTheme(); 
  const isDarkMode = theme === "dark";
  const [showClearAlerts, setShowClearAlerts] = useState(false)
  

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
    const [showTooltip, setShowTooltip] = useState(false);
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
              <ImCross color="var(--color-network-error)" size={24} className="mt-2"/>
            ) : indication === "Medium" ? (
              <IoWarning color="var(--color-network-warning)" size={32} />
            ) : (
              <TiTick color="var(--color-network-success)" size={36} className="mt-2"/>
            )}
          </div>
          <div className="w-3/4">
            <div className="flex">
              <p
                
                style={{
                  color: isDarkMode
                    ? "var(--color-network-text-light)"
                    : "var(--color-network-text-darker)",
                }}
              >
                {device}
              </p>
              <p
                className="indicator text-white ms-5 rounded-sm px-2 py-1 mt-1"
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
            className="dismiss rounded-sm font-bold ms-5 cursor-pointer"
            onClick={() => dismissAlert(id)}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            <FaRegTrashAlt
              color={
                isDarkMode
                  ? "var(--color-network-text)"
                  : "var(--color-network-text-dark)"
              }
              size={32}
            />
          </button>
          {showTooltip && (
          <div className="absolute  bg-gray-800 text-white text-xs rounded-md px-2 py-1 shadow-lg">
            Delete Alert
          </div>
          )}
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
        {allAlerts.length ? allAlerts.map((dev) => (
          <ActiveAlerts key={dev.id} {...dev} />
        )) : <div className="flex flex-1 justify-center items-center">
                <span className="text-xl text-yellow-500">No active alerts!</span>
             </div>
        }
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
        className="clear-all-alerts w-full border rounded-xl my-4 py-2 text-xl cursor-pointer"
        style={{
          color: isDarkMode
            ? "var(--color-network-text-light)"
            : "var(--color-network-text-darker)",
          borderColor: isDarkMode
            ? "var(--color-network-border-light)"
            : "var(--color-network-border)",
          display: allAlerts.length ? 'block' : 'none'
        }}
        onClick={clearAllAlerts}
        onMouseEnter={() => setShowClearAlerts(true)}
        onMouseLeave={() => setShowClearAlerts(false)}
        
      >
        Clear All Alerts
      </button>
      {showClearAlerts && (
        <div className="absolute left-1/2 bg-gray-800 text-white text-xs rounded-md px-2 py-1 shadow-lg">
          Delete All Alerts
        </div>
      )}

    </div>
  );
};

export default DeviceStatusIndicator;
