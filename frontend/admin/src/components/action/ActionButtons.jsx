import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import AddIcon from '@mui/icons-material/Add';
import Export from "../share/Export";

const ActionButtons = ({ addLink = "", setOpen, color = "secondary", label = "Thêm" }) => {
  return (
    <div className="flex sm:gap-4 gap-2">
      <Export/>
      <Link to={addLink}>
        <Button
          variant="contained"
          color={color}
          sx={{ height: 38, width: 100 }}
          className="gap-x-2"
          onClick={() => setOpen(true)}
        >
          <AddIcon size={20} />
          <span>{label}</span>
        </Button>
      </Link>
    </div>
  );
};

export default ActionButtons;
