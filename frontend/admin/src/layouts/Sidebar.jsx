import { useTheme } from "@emotion/react";
import {
  ChevronLeft,
  ChevronRightOutlined,
  ExpandLess,
  ExpandMore,
  Group,
  Groups2Outlined,
  HomeOutlined,
  ShoppingCartOutlined,
  Settings,
  LocalShipping
} from "@mui/icons-material";
import {
  Box,
  Collapse,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography
} from "@mui/material";
import { Fragment, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import FlexBetween from "../components/share/FlexBetween";
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';

const navItems = [
  {
    text: "Tổng quan",
    pathname: "admin",
    icon: <HomeOutlined />,
  },
  {
    text: "Người dùng",
    icon: null,
  },
  {
    text: "Sản phẩm",
    icon: <ShoppingCartOutlined />,
    children: [
      { text: "Danh sách sản phẩm", pathname: "admin/products" },
      { text: "Thêm sản phẩm", pathname: "admin/products/add" },
      { text: "Danh mục", pathname: "admin/categories" },
      { text: "Thương hiệu", pathname: "admin/brands" },
    ],
  },
  {
    text: "Đơn hàng",
    icon: <LocalShipping />,
    children: [
      { text: "Danh sách đơn hàng", pathname: "admin/orders/list" },
      { text: "Chi tiết đơn hàng", pathname: "admin/orders/detail" },
    ],
  },
  {
    text: "Nhân sự",
    icon: <Group />,
    children: [
      { text: "Nhân viên", pathname: "admin/users"},
      { text: "Phân quyền", pathname: "admin/roles" },
    ],
  },
  {
    text: "Tài khoản", pathname: "admin/account", icon: <ManageAccountsIcon />,
  },
  {
    text: "Khách hàng",
    icon: <Groups2Outlined />,
    children: [
      { text: "Danh sách khách hàng", pathname: "admin/customers/list" },
      { text: "Chi tiết khách hàng", pathname: "admin/customers/detail" },
    ],
  },
  {
    text: "Cài đặt",
    icon: <Settings />,
    children: [
      { text: "Thông tin", pathname: "admin/store-info" },
      { text: "Địa điểm", pathname: "admin/local" },
    ],
  },
];

const Sidebar = ({
  drawWidth,
  isSidebarOpen,
  setIsSidebarOpen,
  isNonMobile,
}) => {
  const { pathname } = useLocation();
  const [active, setActive] = useState("");
  const [openMenus, setOpenMenus] = useState({});
  const navigate = useNavigate();
  const theme = useTheme();
  useEffect(() => {
    setActive(pathname.substring(1));
  }, [pathname]);
  const toggleMenu = (menuText) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menuText]: !prev[menuText],
    }));
  };
  return (
    <Box component="nav">
      {isSidebarOpen && (
        <Drawer
          open={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          variant="persistent"
          anchor="left"
          sx={{
            width: drawWidth,
            "& .MuiDrawer-paper": {
              color: theme.palette.secondary[200],
              backgroundColor: theme.palette.background.alt,
              boxSizing: "border-box",
              borderWidth: isNonMobile ? 0 : "2px",
              width: drawWidth,
            },
          }}
        >
          <Box width={"100%"}>
            <Box m={"1.5rem 2rem 2rem 3rem"}>
              <FlexBetween color={theme.palette.secondary.main}>
                <Box display={"flex"} alignItems={"center"} gap={"0.5rem"}>
                  <Typography variant="h4" fontWeight={"bold"}>
                    ECOMTECH
                  </Typography>
                </Box>
                {!isNonMobile && (
                  <IconButton onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                    <ChevronLeft />
                  </IconButton>
                )}
              </FlexBetween>
            </Box>
            <List>
              {navItems.map(({ text, pathname, icon, children }) => {
                if (!icon) {
                  return (
                    <Typography key={text} sx={{ m: "2.25rem 0 1rem 3rem" }}>
                      {text}
                    </Typography>
                  );
                }
                if (children) {
                  return (
                    <Fragment key={text}>
                      <ListItem disablePadding>
                        <ListItemButton onClick={() => toggleMenu(text)}>
                          <ListItemIcon sx={{ ml: "2rem" }}>
                            {icon}
                          </ListItemIcon>
                          <ListItemText primary={text} />
                          {openMenus[text] ? <ExpandLess /> : <ExpandMore />}
                        </ListItemButton>
                      </ListItem>
                      <Collapse
                        in={openMenus[text]}
                        timeout="auto"
                        unmountOnExit
                      >
                        <List component="div" disablePadding>
                          {children.map((child) => {
                            const lcText = child.pathname.toLowerCase();
                            return (
                              <ListItemButton
                                key={child.text}
                                sx={{
                                  backgroundColor:
                                    active === lcText
                                      ? theme.palette.secondary[300]
                                      : "transparent",
                                  color:
                                    active === lcText
                                      ? theme.palette.primary[600]
                                      : theme.palette.secondary[200],
                                  pl: 8,
                                }}
                                onClick={() => {
                                  navigate(`/${lcText}`);
                                  setActive(lcText);
                                }}
                              >
                                <ListItemText primary={child.text} />
                              </ListItemButton>
                            );
                          })}
                        </List>
                      </Collapse>
                    </Fragment>
                  );
                }
                const lcText = pathname.toLowerCase();
                return (
                  <ListItem key={text} disablePadding>
                    <ListItemButton
                      onClick={() => {
                        navigate(`/${lcText}`);
                        setActive(lcText);
                      }}
                      sx={{
                        backgroundColor:
                          active === lcText
                            ? theme.palette.secondary[300]
                            : "transparent",
                        color:
                          active === lcText
                            ? theme.palette.primary[600]
                            : theme.palette.secondary[200],
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          ml: "2rem",
                          color:
                            active === lcText
                              ? theme.palette.primary[600]
                              : theme.palette.secondary[200],
                        }}
                      >
                        {icon}
                      </ListItemIcon>
                      <ListItemText primary={text} />
                      {active === lcText && children && (
                        <ChevronRightOutlined sx={{ ml: "auto" }} />
                      )}
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </Box>
          
        </Drawer>
      )}
    </Box>
  );
};

export default Sidebar;
