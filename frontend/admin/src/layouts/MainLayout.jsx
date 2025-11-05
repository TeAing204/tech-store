import { useEffect, useState } from 'react'
import { Box, useMediaQuery } from '@mui/material'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import Footer from './Footer'
import { useDispatch, useSelector } from 'react-redux'
import { jwtDecode } from 'jwt-decode'
import { logout } from '../features/auth/authSlice'

const MainLayout = () => {
  const isNonMobile = useMediaQuery("(min-width: 960px)");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const {user} = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    const checkToken = () => {
      if (user?.token) {
        try {
          const decoded = jwtDecode(user.token);
          if (decoded.exp * 1000 < Date.now()) {
            dispatch(logout());
          }
        } catch {
          dispatch(logout());
        }
      }
    };
    checkToken();
    const interval = setInterval(checkToken, 10000); // kiểm tra mỗi 10s
    return () => clearInterval(interval);
  }, [user, dispatch]);
  return (
    <Box display={isNonMobile ? "flex" : "block"} width="100%" height="100%">
      <Sidebar 
        isNonMobile={isNonMobile}
        drawWidth="250px"
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      <Box flexGrow={1} >
        <Navbar isNonMobile={isNonMobile} user={user} isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen}/>
        <Outlet />
        <Footer />
      </Box>
    </Box>
  )
}

export default MainLayout