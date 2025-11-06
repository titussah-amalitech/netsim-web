import toast from "react-hot-toast";
import { FaRegTrashAlt } from "react-icons/fa";
import { ImCross } from "react-icons/im";


/**
 * Shows a real-time alert toast.
 * 
 * @param {object} device - The affected device object.
 * @param {string} message - The alert message.
 * @param {"red" | "yellow"} status - The alert severity.
 */
export const showRealTimeAlert = (device, message, status, isDarkMode = false) => {

  toast((t) => (
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
  ), {
    icon: (
      <ImCross
        color={status === "red" ? "#ff0000" : "#facc15"}
        size={20}
      />
    ),
    duration: 7000,
    position: "top-right",
  });
};
