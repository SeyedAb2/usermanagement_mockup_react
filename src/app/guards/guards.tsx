import { Navigate, Outlet } from "react-router";
import { useAuthStore } from "../../store/auth.store";

export function ProtectedRoute() {
  const isLogined = useAuthStore((s) => s.isLogined());
  return isLogined ? <Outlet /> : <Navigate to="/login" replace />;
}

export function GuestRoute() {
  const isLogined = useAuthStore((s) => s.isLogined());
  return !isLogined ? <Outlet /> : <Navigate to="/dashboard" replace />;
}
