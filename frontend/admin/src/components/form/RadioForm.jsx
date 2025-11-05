import { Box, FormControlLabel, Radio, Typography } from "@mui/material";
import ChipForm from "./ChipForm";

const RadioForm = ({value, title, description}) => {
  return (
    <FormControlLabel
      value={value}
      control={<Radio color="secondary" />}
      sx={{
        alignItems: "flex-start",
      }}
      label={
        <Box>
          <Typography variant="body1" sx={{ fontSize: 16, py: 0.8 }}>
            {title}
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ fontSize: 12 }}
          >
            {description}
          </Typography>
          {value === "select" && (
            <ChipForm/>
          )}
        </Box>
      }
    />
  );
};

export default RadioForm;
