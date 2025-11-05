import { useState } from "react";
import { TextField, IconButton, InputAdornment, useTheme } from "@mui/material";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
export default function PasswordInput({placeholder, label}) {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");

  const handleTogglePassword = () => setShowPassword(!showPassword);
    const theme = useTheme();
  return (
    <div>
        <label>{label}</label>
        <TextField
          style={{marginTop: 5}}
          variant="outlined"
          placeholder={placeholder}
          size="small"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={password.length > 0 && password.length < 5}
          helperText={
            password.length > 0 && password.length < 5
              ? "Mật khẩu phải lớn hơn 4 từ"
              : " "
          }
          fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleTogglePassword} edge="end">
                  {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              color: theme.palette.text.primary,
            },
            "& .MuiFormHelperText-root": {
              color: password.length > 0 && password.length < 5 ? "#ff4d4d" : "gray",
            },
          }}
        />
    </div>
  );
}
