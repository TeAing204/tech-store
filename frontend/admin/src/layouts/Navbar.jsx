import {
  AppBar,
  Box,
  Button,
  IconButton,
  InputBase,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";
import {
  DarkModeOutlined,
  LightModeOutlined,
  Search,
  Menu as MenuIcon,
  SettingsOutlined,
  ArrowDropDownOutlined,
} from "@mui/icons-material";
import { useState } from "react";
import FlexBetween from "../components/share/FlexBetween";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { setMode } from "../features/global/globalSlice";
import { login, logout } from "../features/auth/authSlice";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";

const Navbar = ({ user, isSidebarOpen, setIsSidebarOpen, isNonMobile }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const isOpen = Boolean(anchorEl);
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleLogout = () => {
    dispatch(logout());
    navigate(login());
  };
  const profileImage =
    user?.image && user.image.trim() !== ""
      ? user.image
      : "/default_avatar.jpg";

  // 🔹 Hiển thị quyền theo role
  const getRoleLabel = (roles = []) => {
    if (roles.includes("admin")) return "Admin";
    if (roles.includes("manager")) return "Manager";
    return "Người dùng";
  };
  return (
    <AppBar
      sx={{
        position: "sticky",
        background: theme.palette.background.default,
        boxShadow: "none",
        top: 0,
        zIndex: 50,
        left: 0,
        borderBottom: 1,
        borderColor: theme.palette.background.alt,
      }}
    >
      <Toolbar sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
        {isNonMobile && (
          <FlexBetween
            backgroundColor={theme.palette.background.alt}
            borderRadius="9px"
            gap="3rem"
            p="0.1rem 1.5rem"
          >
            <InputBase placeholder="Tìm kiếm ..." />
            <IconButton>
              <Search />
            </IconButton>
          </FlexBetween>
        )}
        <FlexBetween gap={"1.5rem"} width={isNonMobile ? "auto" : "100%"}>
          <IconButton onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <MenuIcon />
          </IconButton>
          <IconButton onClick={() => dispatch(setMode())}>
            {theme.palette.mode === "dark" ? (
              <DarkModeOutlined sx={{ fontSize: "25px" }} />
            ) : (
              <LightModeOutlined sx={{ fontSize: "25px" }} />
            )}
          </IconButton>
          <IconButton>
            <SettingsOutlined sx={{ fontSize: "25px" }} />
          </IconButton>
          <FlexBetween>
            <Button
              onClick={handleClick}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                textTransform: "none",
                gap: "1rem",
              }}
            >
              <Box
                component="img"
                alt="profile"
                src={profileImage}
                height="32px"
                width="32px"
                borderRadius="50%"
                sx={{ objectFit: "cover" }}
              />
              <Box textAlign="left">
                <Typography
                  fontWeight="bold"
                  fontSize="0.85rem"
                  sx={{ color: theme.palette.secondary[100] }}
                >
                  {user.username}
                </Typography>
                <Typography
                  fontSize="0.75rem"
                  sx={{ color: theme.palette.secondary[200] }}
                >
                  {getRoleLabel(user.roles)}
                </Typography>
              </Box>
              <ArrowDropDownOutlined
                sx={{ color: theme.palette.secondary[300], fontSize: "25px" }}
              />
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={isOpen}
              onClose={handleClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
            >
              <Link to={"/profile"}>
                <MenuItem className="flex gap-2" onClick={handleClose}>
                  <PersonIcon className="text-xl" />
                  <span className="font-bold text-[16px] mt-1">
                    {user?.username}
                  </span>
                </MenuItem>
              </Link>
              <MenuItem className="flex gap-2" onClick={handleLogout}>
                <div className="font-semibold bg-red-500 w-full flex gap-2 items-center px-4 py-1 text-white rounded-sm">
                  <LogoutIcon className="text-xl" />
                  <span className="font-medium text-[16px] mt-1">
                    Đăng xuất
                  </span>
                </div>
              </MenuItem>
            </Menu>
          </FlexBetween>
        </FlexBetween>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
