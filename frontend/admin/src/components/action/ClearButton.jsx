import { useNavigate } from "react-router-dom";
import CachedIcon from '@mui/icons-material/Cached';
const ClearButton = () => {
  const navigate = useNavigate();

  const handleClearFilter = () => {
    navigate({ navigate : window.location.pathname});
  };

  return (
    <button
      onClick={handleClearFilter}
      className="flex items-center bg-rose-800 gap-2 text-white px-3 py-2 rounded-md duration-300 transition shadow-md focus:outline-none"
    >
      <CachedIcon size={16} />
      <span className="font-semibold cursor-pointer">Làm mới</span>
    </button>
  );
};

export default ClearButton;
