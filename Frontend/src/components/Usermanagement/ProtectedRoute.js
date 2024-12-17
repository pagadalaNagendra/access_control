// src/components/ProtectedRoute.js
import React from "react";
import { Navigate } from "react-router-dom";

/**
 * A protected route component that checks user role and token to allow access.
 * @param {Object} props - Component props.
 * @param {React.Element} props.children - The component to render if access is allowed.
 * @param {string[]} props.allowedRoles - An array of roles allowed to access this route.
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // If no token or role is found, redirect to login page
  if (!token || !role) {
    return <Navigate to="/" replace />;
  }

  // If the user's role is not in the allowed roles, show "Not Found" or redirect
  if (!allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  // Render the children (protected component)
  return children;
};

export default ProtectedRoute;