import { MdVerified } from "react-icons/md";
import { useTheme } from "../../../hooks/useTheme";

const DeviceDetailsPanel = () => {
  const now = new Date();
  const deviceStatus = [
    {
      device: "Database server",
      message: "Database Server: High latency: 38ms, Packet loss: 4%",
      time: now.toLocaleTimeString(),
      indication: "High",
    },
    {
      device: "Workstation 1",
      message: "Workstation 1: Performance degraded",
      time: now.toLocaleTimeString(),
      indication: "Medium",
    },
    {
      device: "Web Server",
      message: "Device Workstation 2 status changed from critical to online",
      time: now.toLocaleTimeString(),
      indication: "Low",
    },
  ];

  // Use global theme instead of local state
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  const DevicePanel = ({ device, message, time, indication, date }) => {
    let indColor;
    if (indication === "High") {
      indColor = "var(--color-network-error)";
    } else if (indication === "Medium") {
      indColor = "var(--color-network-warning)";
    } else {
      indColor = "var(--color-network-success)";
    }

    return (
      <div className="flex details-panel p-4">
        {/* LEFT CARD */}
        <div
          className="w-1/3 rounded-xl p-4"
          style={{
            backgroundColor: isDarkMode
              ? "var(--color-network-gray-light)"
              : "var(--color-network-surface-light)",
          }}
        >
          <div className="flex items-center">
            <div className="w-30 h-30 rounded-full overflow-hidden">
              <img src="/images/cloud-server.png" alt="web server image" />
            </div>
            <p
              className="text-2xl ms-3 font-black text-nowrap"
              style={{
                color: isDarkMode
                  ? "var(--color-network-text-light)"
                  : "var(--color-network-text-darker)",
              }}
            >
              Web Server
            </p>
            <div className="verify ms-2 rounded-full">
              <MdVerified color="var(--color-network-success)" size={32} />
            </div>
          </div>

          {/* Ping */}
          <div className="flex justify-between my-2 ms-2">
            <p
              className="text-2xl text-nowrap"
              style={{
                color: isDarkMode
                  ? "var(--color-network-text)"
                  : "var(--color-network-text-dark)",
              }}
            >
              Ping rate
            </p>
            <input
              type="text"
              value={"30s"}
              className="text-2xl px-4 text-end w-full ms-3 p-1 rounded-xl"
              style={{
                backgroundColor: isDarkMode
                  ? "var(--color-network-background)"
                  : "var(--color-network-light)",
                color: "var(--color-network-warning)",
              }}
              disabled
            />
          </div>

          {/* Latency */}
          <div className="flex justify-between my-2 ms-2">
            <p
              className="text-2xl"
              style={{
                color: isDarkMode
                  ? "var(--color-network-text)"
                  : "var(--color-network-text-dark)",
              }}
            >
              Latency
            </p>
            <input
              type="text"
              value={"250ms"}
              className="text-2xl px-4 text-end w-full ms-3 p-1 rounded-xl"
              style={{
                backgroundColor: isDarkMode
                  ? "var(--color-network-background)"
                  : "var(--color-network-light)",
                color: "var(--color-network-success)",
              }}
              disabled
            />
          </div>

          {/* Error probability */}
          <div className="flex justify-between my-2 ms-2">
            <p
              className="text-2xl text-nowrap"
              style={{
                color: isDarkMode
                  ? "var(--color-network-text)"
                  : "var(--color-network-text-dark)",
              }}
            >
              Error probability
            </p>
            <input
              type="text"
              value={"0.8"}
              className="text-2xl px-4 text-end w-full ms-3 p-1 rounded-xl"
              style={{
                backgroundColor: isDarkMode
                  ? "var(--color-network-background)"
                  : "var(--color-network-light)",
                color: "var(--color-network-error)",
              }}
              disabled
            />
          </div>
        </div>

        {/* RIGHT LOG PANEL */}
        <div
          className="flex flex-row ms-2 overflow-auto w-2/3 p-4 rounded-xl max-h-80"
          style={{
            backgroundColor: isDarkMode
              ? "var(--color-network-gray-light)"
              : "var(--color-network-surface-light)",
          }}
        >
          <div
            className="log border-l-4 rounded-xl flex w-max p-4 my-4 flex-1 h-max"
            style={{
              backgroundColor: isDarkMode
                ? "var(--color-network-surface)"
                : "var(--color-network-light)",
            }}
          >
            <div
              className="me-4 h-5 w-5 rounded-full mt-1"
              style={{ backgroundColor: indColor }}
            ></div>
            <div className="w-full">
              <div className="flex">
                <p
                  className="font-extrabold mt-1"
                  style={{
                    color: isDarkMode
                      ? "var(--color-network-text-light)"
                      : "var(--color-network-text-darker)",
                  }}
                >
                  {device}
                </p>
                <p
                  className="indicator ms-5 rounded-sm font-bold"
                  style={{ color: indColor }}
                >
                  {indication}
                </p>
              </div>
              <p
                className="text-xs mt-2 text-nowrap"
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
                {date}, {time}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="device-details mt-8">
      <DevicePanel
        device={"Database Server"}
        message={"Device Database Server status changed from online to offline"}
        date={now.toLocaleDateString()}
        time={now.toLocaleTimeString()}
        indication={deviceStatus[Math.floor(Math.random() * 3)].indication}
      />
    </div>
  );
};

export default DeviceDetailsPanel;
