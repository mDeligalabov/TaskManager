import React from "react";
import { Navigate, useLocation } from "react-router-dom";

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem("token");
  const location = useLocation();

  if (!token) {
    // Redirect to login, preserving the current location for after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}