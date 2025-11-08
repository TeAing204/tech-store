import { Box, useTheme } from "@mui/material";
import Header from "../layouts/Header";

const StoreInfo = () => {
    const theme = useTheme();
  return (
    <div>
      <Box
        sx={{
          m: {
            xs: "1rem 1.5rem",
            md: "1.5rem 2.5rem",
          }
        }}
      >
        <Header title="THÔNG TIN" subtitle="Thông tin cửa hàng." />
        <Box bgcolor={theme.palette.background.alt} p={2} sx={{borderRadius: "4px", mt: 4}}>
            h
        </Box>
      </Box>
    </div>
  );
};

export default StoreInfo;
