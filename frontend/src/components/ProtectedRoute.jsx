import { Navigate, Outlet } from "react-router-dom";
import { useApp } from "../context/AppContext";

export default function ProtectedRoute() {
  const { state } = useApp();
  const token = state.token || localStorage.getItem("token");

  if (!token || !token.startsWith("eyJ")) {
    return <Navigate to="/auth" replace />;
  }

  return <Outlet />;
}
