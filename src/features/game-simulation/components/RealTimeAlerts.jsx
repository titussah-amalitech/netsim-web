import { useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { FaRegTrashAlt } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import { useTheme } from "../../../hooks/useTheme";
import { useAlertSound } from "../hooks/useAlertSound";

const RealTimeAlerts = ({ devices }) => {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  const { playSound } = useAlertSound(false)

  const showAlert = (device) => {

    playSound(device.status)

    const message =
      device.status === "red"
        ? `${device.name} is offline`
        : `${device.name} is experiencing high latency`;

    toast(
      (t) => (
        <div className="flex items-center justify-between w-full space-x-4">
          <p>{message}</p>
          <button onClick={() => toast.dismiss(t.id)}>
            <FaRegTrashAlt
              color={
                isDarkMode
                  ? "var(--color-network-text)"
                  : "var(--color-network-text-dark)"
              }
            />
          </button>
        </div>
      ),
      {
        icon:
          device.status === "red" ? (
            <ImCross color="#ff0000" size={20} />
          ) : (
            <ImCross color="#facc15" size={20} />
          ),
        duration: 7000,
        position: "top-right",
      }
    );
  };

  useEffect(() => {
    const problemDevices = devices.filter(
      (d) => d.status === "yellow" || d.status === "red"
    );

    problemDevices.forEach((device, index) => {
      setTimeout(() => {
        showAlert(device);
      }, index * 1500); 
    });
  }, [devices]);

  return <Toaster position="top-right" reverseOrder={false} />;
};

export default RealTimeAlerts;
