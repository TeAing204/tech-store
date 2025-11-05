import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const PublicRoute = () => {
  const { user } = useSelector((state) => state.auth);
  const allowedRoles = ["admin", "manager", "superadmin"];
  const hasPermission = user?.token && user?.roles?.some((r) => allowedRoles.includes(r));

  if (hasPermission) {
    return <Navigate to="/admin" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
