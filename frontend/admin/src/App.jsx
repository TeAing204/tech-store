import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import { useMemo } from "react";
import { themeSettings } from "./utils/theme";
import MainLayout from "./layouts/MainLayout";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import PublicRoute from "./routes/PublicRoute";
import PrivateRoute from "./routes/PrivateRoute";
import { Toaster } from "react-hot-toast";
import Page404 from "./pages/Page404";
import Products from "./pages/Products";
import AddProduct from "./pages/AddProduct";
import EditProduct from "./pages/EditProduct";
import Categories from "./pages/Categories";
import Brands from "./pages/Brands";
import TrashProducts from "./pages/TrashProducts";
import Users from "./pages/Users";
import TrashUsers from "./pages/TrashUsers";
import UserDetail from "./pages/UserDetail";
import Account from "./pages/Account";
import StoreInfo from "./pages/StoreInfo";

function App() {
  const mode = useSelector((state) => state.global.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

  return (
    <>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            {/* login - ai cũng vào được */}
            <Route path="/login" element={<PublicRoute />}>
              <Route index element={<Login />} />
            </Route>

            {/* phần admin - cần quyền */}
            <Route element={<PrivateRoute />}>
              <Route element={<MainLayout />}>
                <Route path="/admin" element={<Dashboard />} />
                <Route path="/admin/products" element={<Products/>}/>
                <Route path="/admin/products/trash" element={<TrashProducts/>}/>
                <Route path="/admin/products/add" element={<AddProduct/>}/>
                <Route path="/admin/products/edit/:productId" element={<EditProduct/>}/>
                <Route path="/admin/categories" element={<Categories/>}/>
                <Route path="/admin/brands" element={<Brands/>}/>
                <Route path="/admin/users" element={<Users/>}/>
                <Route path="/admin/users/trash" element={<TrashUsers/>}/>
                <Route path="/admin/users/user/:userId" element={<UserDetail/>}/>
                <Route path="/admin/account" element={<Account/>}/>
                <Route path="/admin/store-info" element={<StoreInfo/>}/>
              </Route>
            </Route>
            {/* mặc định */}
            <Route path="/" element={<Navigate to="/admin" replace />} />
            <Route path="*" element={<Page404/>} />
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
      <Toaster position="top-right" reverseOrder={false} />
    </>
  );
}

export default App;
