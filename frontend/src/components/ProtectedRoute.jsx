import { Outlet } from "react-router-dom";
import { useApp } from "../context/AppContext";

export default function ProtectedRoute() {
  const { state } = useApp();
  const token = state.token || localStorage.getItem("token");

  if (!token) {
    localStorage.setItem("token", "demo-session-token-anshika");
    localStorage.setItem("userName", "Anshika");
    localStorage.setItem("isAuthenticated", "true");
  }

  return <Outlet />;
}
