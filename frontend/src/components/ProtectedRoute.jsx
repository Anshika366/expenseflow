import { Navigate, Outlet } from "react-router-dom";
import { useApp } from "../context/AppContext";

export default function ProtectedRoute() {
  const { state } = useApp();
  const token = state.token || localStorage.getItem("token");

  // Require a real JWT (starts with "eyJ") — no demo bypass
  if (!token || !token.startsWith("eyJ")) {
    return <Navigate to="/auth" replace />;
  }

  return <Outlet />;
}
