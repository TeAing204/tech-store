// import { useState } from "react";
// import {
//   TextField,
//   IconButton,
//   InputAdornment,
//   useTheme,
// } from "@mui/material";
// import VisibilityIcon from "@mui/icons-material/Visibility";
// import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

// export default function PasswordInput({
//   placeholder,
//   label,
//   register,
//   name,
//   error,
//   ...rest
// }) {
//   const [showPassword, setShowPassword] = useState(false);
//   const theme = useTheme();

//   const handleTogglePassword = () => setShowPassword((prev) => !prev);

//   return (
//     <div className="w-full">
//       <label
//         style={{
//           display: "block",
//           fontWeight: 600,
//           marginBottom: 5,
//           color: theme.palette.text.primary,
//         }}
//       >
//         {label}
//       </label>
//       <TextField
//         {...register(name)}
//         {...rest}
//         variant="outlined"
//         placeholder={placeholder}
//         size="small"
//         type={showPassword ? "text" : "password"}
//         error={!!error}
//         helperText={error?.message || " "}
//         fullWidth
//         InputProps={{
//           endAdornment: (
//             <InputAdornment position="end">
//               <IconButton onClick={handleTogglePassword} edge="end">
//                 {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
//               </IconButton>
//             </InputAdornment>
//           ),
//         }}
//         sx={{
//           "& .MuiOutlinedInput-root": {
//             color: theme.palette.text.primary,
//           },
//           "& .MuiFormHelperText-root": {
//             color: error ? "#ff4d4d" : "gray",
//           },
//         }}
//       />
//     </div>
//   );
// }
import { useState } from "react";
import {
  TextField,
  IconButton,
  InputAdornment,
  useTheme,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

export default function PasswordInput({
  placeholder,
  label,
  register,
  name,
  error,
  required,
  min,
  message,
  ...rest
}) {
  const [showPassword, setShowPassword] = useState(false);
  const theme = useTheme();

  const handleTogglePassword = () => setShowPassword((prev) => !prev);

  return (
    <div className="w-full">
      <label
        style={{
          display: "block",
          fontWeight: 600,
          marginBottom: 5,
          color: theme.palette.text.primary,
        }}
      >
        {label}
      </label>
      <TextField
        {...register(name, {
          required: { value: required, message },
          minLength: min
            ? { value: min, message: `Mật khẩu tối thiểu ${min} ký tự` }
            : null,
        })}
        {...rest}
        variant="outlined"
        placeholder={placeholder}
        size="small"
        type={showPassword ? "text" : "password"}
        error={!!error}
        helperText={error?.message || " "}
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
            color: error ? "#ff4d4d" : "gray",
          },
        }}
      />
    </div>
  );
}
