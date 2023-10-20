import React from "react";
import { useUserContext } from "../../contexts/UserContext";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const { currentUser } = useUserContext();

  if (!currentUser) {
    return <Navigate to="/sign-in" />;
  }
  if (currentUser.maLoaiNguoiDung !== "QuanTri") {
    localStorage.removeItem("currentUser");
    return <Navigate to="*" replace />;
  }

  return children || <Outlet />;
}
