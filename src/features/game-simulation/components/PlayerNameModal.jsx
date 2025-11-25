import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createUser, fetchUsers } from "../../../store/user.slice";
import { Button, Modal } from "../../../components";
import { Play } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Admins secrete key
const ADMIN_SECRET_KEY = "Isadmin1";

export const PlayerNameModal = ({ isOpen, onClose }) => {
  const [playerName, setPlayerName] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminKey, setAdminKey] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading } = useSelector((state) => state.users);

  useEffect(() => {
    if (isOpen) dispatch(fetchUsers());
  }, [isOpen, dispatch]);

  // Validate inputs
  const validateName = (name, key) => {
    if (!name || name.trim() === "") return "Player name cannot be empty";
    if (isAdmin && key.trim() === "") return "Admin key is required";
    if (isAdmin && key !== ADMIN_SECRET_KEY) return "Invalid admin key";
    return null;
  };

  const handleSubmit = async () => {
    const validationError = validateName(playerName, adminKey);
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const newUser = {
        name: playerName.trim(),
        role: isAdmin ? "admin" : "player",
      };

      await dispatch(createUser(newUser)).unwrap();

      // Redirect to home
        navigate("/");


      // Reset modal state
      setPlayerName("");
      setAdminKey("");
      setIsAdmin(false);
      setError("");
      onClose();
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setError("Failed to create user. Please try again.");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Enter Your Name"
      size="small"
      showCloseButton={false}
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Your Name or Nickname</label>
          <input
            type="text"
            value={playerName}
            onChange={(e) => {
              setPlayerName(e.target.value);
              setError("");
            }}
            placeholder="Enter your name..."
            className="w-full px-3 py-2 border border-network-border-light dark:border-0 dark:bg-network-gray-light rounded text-network-text-darker dark:text-network-text-light focus:outline-none focus:ring-2 focus:ring-blue-400"
            autoFocus
            disabled={loading}
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="adminCheck"
            checked={isAdmin}
            onChange={(e) => setIsAdmin(e.target.checked)}
          />
          <label htmlFor="adminCheck" className="text-network-text-dark dark:text-network-text-light">
            Log in as Admin
          </label>
        </div>

        {isAdmin && (
          <div>
            <label className="block text-sm font-medium mb-2">Admin Key</label>
            <input
              type="password"
              value={adminKey}
              onChange={(e) => {
                setAdminKey(e.target.value);
                setError("");
              }}
              placeholder="Enter secret key..."
              className="w-full px-3 py-2 border border-network-border-light dark:border-0 dark:bg-network-gray-light rounded text-network-text-darker dark:text-network-text-light focus:outline-none focus:ring-2 focus:ring-blue-400"
              disabled={loading}
            />
          </div>
        )}

        {error && (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        )}

        <div className="flex justify-end gap-3">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            className="gap-2"
            disabled={loading || !playerName.trim() || (isAdmin && !adminKey.trim())}
          >
            <Play size={20} /> <span>Sign In</span>
          </Button>
        </div>
      </div>
    </Modal>
  );
};
