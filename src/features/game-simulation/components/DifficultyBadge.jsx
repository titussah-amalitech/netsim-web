import { FaLeaf, FaSkull } from "react-icons/fa";
import { AiOutlineStar, AiFillFire } from "react-icons/ai";
import { MdTrendingUp } from "react-icons/md";

const DifficultyBadge = ({ level }) => {
  const config = {
    easy: {
      color: "bg-green-500 text-white",
      icon: <FaLeaf className="inline mr-1" />
    },
    medium: {
      color: "bg-yellow-500 text-black",
      icon: <MdTrendingUp className="inline mr-1" />
    },
    hard: {
      color: "bg-red-600 text-white",
      icon: <AiFillFire className="inline mr-1" />
    }
  };

  return (
    <span className={`px-2 py-0.5 rounded-md text-xs font-semibold flex items-center ${config[level].color}`}>
      {config[level].icon}
    </span>
  );
};

export default DifficultyBadge