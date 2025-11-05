import { Navigate, Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {jwtDecode} from "jwt-decode";
import { logout } from "../features/auth/authSlice";

const PrivateRoute = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  if (!user || !user.token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = jwtDecode(user.token);

    // kiểm tra token hết hạn
    if (decoded.exp * 1000 < Date.now()) {
      dispatch(logout());
      return <Navigate to="/login" replace />;
    }

    // kiểm tra role hợp lệ
    const allowedRoles = ["admin", "manager"];
    const hasPermission = user.roles?.some((r) => allowedRoles.includes(r));

    if (!hasPermission) {
      return <Navigate to="/login" replace />;
    }

    return <Outlet />;
  } catch {
    dispatch(logout());
    return <Navigate to="/login" replace />;
  }
};

export default PrivateRoute;
