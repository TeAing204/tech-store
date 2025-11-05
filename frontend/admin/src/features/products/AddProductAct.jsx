import { Button, useTheme } from "@mui/material";
import { Link } from "react-router-dom";

const AddProductAct = ({ onReset, mode = "create" }) => {
  const theme = useTheme();
  return (
    <div className="flex flex-row items-center gap-x-2">
      <Link to="/admin/products"> 
        <Button variant="outlined" color="secondary" sx={{px: 2, py: 1}}>
          {mode === "create" ? "Sản phẩm" : "Trở về"}
        </Button>
      </Link>
      <Button
        variant="outlined"
        color="secondary"
        sx={{ px: 2, py: 1 }}
        onClick={() => onReset?.()}
      >
        {mode === "create" ? "Làm mới" : "Phục hồi"}
      </Button>
      <Button variant="outlined" color="secondary" sx={{ px: 2, py: 1 }}>
        Bản nháp
      </Button>
      <Button
        variant="contained"
        type="submit"
        form="add-product-form"
        sx={{ bgcolor: theme.palette.button.main, px: 2, py: 1 }}
      >
        {mode === "create" ? "Xuất bản" : "Lưu"}
      </Button>
    </div>
  );
};

export default AddProductAct;
