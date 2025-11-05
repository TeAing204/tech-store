import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import DeleteIcon from '@mui/icons-material/Delete';

const TrashButton = ({ addLink = "", color = "secondary", label = "Thùng rác" }) => {
  return (
    <div className="flex gap-4">
      <Link to={addLink}>
        <Button
          variant="outlined"
          color={color}
          sx={{ height: 38 }}
          className="gap-x-2"
        >
          <DeleteIcon />
          <span>{label}</span>
        </Button>
      </Link>
    </div>
  );
};

export default TrashButton;