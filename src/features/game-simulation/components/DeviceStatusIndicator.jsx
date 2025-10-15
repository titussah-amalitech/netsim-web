import { FaRegTrashAlt } from "react-icons/fa";
import { TiTick } from "react-icons/ti";
import { ImCross } from "react-icons/im";
import { IoWarning } from "react-icons/io5";
import { useTheme } from "../../../hooks/useTheme"; 
import toast, { Toaster } from 'react-hot-toast';

const DeviceStatusIndicator = () => {
  const { theme } = useTheme(); 
  const isDarkMode = theme === "dark";

  const ShowAlert = () => {
    return toast(
      (t) => (
        <span className="flex min-h-10 items-center space-x-5">
          <p>Router-01 is experiencing high latency</p>
          <button onClick={() => toast.dismiss(t.id)} >
            <FaRegTrashAlt
                  color={
                    isDarkMode
                      ? "var(--color-network-text)"
                      : "var(--color-network-text-dark)"
                  }
                  
            />
          </button>
        </span>
      ),
      {
        icon: <ImCross color="#ff0000"  size={24}/>,
        duration: 7000
      }
    );
    
  }


  return (
    <div
      className="alerts-container p-8 rounded-3xl max-w-180"
      style={{
        backgroundColor: isDarkMode
          ? "var(--color-network-gray-light)"
          : "var(--color-network-light)",
      }}
    >
     
      <button onClick={ShowAlert}>Alert</button>
    </div>
  );
};

export default DeviceStatusIndicator;
