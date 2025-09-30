import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { Button } from "./Button";

export function GoBack({ fallback = "/" }) {
   const navigate = useNavigate();

   const handleGoBack = () => {
      if (window.history.state && window.history.state.idx > 0) {
         navigate(-1); // go back if there is history
      } else {
         navigate(fallback); // otherwise go to fallback route
      }
   };

   return (
      <Button
         variant="outline"
         onClick={handleGoBack}
         className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition"
      >
         <ChevronLeft size={16} />
         Back
      </Button>
   );
}
