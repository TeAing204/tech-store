import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import ReplyIcon from '@mui/icons-material/Reply';

const BackButton = ({ addLink = "", color = "secondary", label = "Trở về" }) => {
  return (
    <div className="flex gap-4">
      <Link to={addLink}>
        <Button
          variant="outlined"
          color={color}
          sx={{ height: 38 }}
          className="gap-x-2"
        >
          <ReplyIcon size={20}/>
          <span>{label}</span>
        </Button>
      </Link>
    </div>
  );
};

export default BackButton;