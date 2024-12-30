import React from "react";
import { Navigate, useNavigate } from "react-router-dom";

/**
 * @param {Object} props - Component props.
 * @param {React.Element} props.children - The component to render if access is allowed.
 * @param {string[]} props.allowedRoles - An array of roles allowed to access this route.
 * @param {string[]} [props.requiredOptions] - An array of options required to access this route (for users).
 */
const ProtectedRoute = ({ children, allowedRoles, requiredOptions = [] }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const options = JSON.parse(localStorage.getItem("options")) || [];

  // If no token or role is found, redirect to login page
  if (!token || !role) {
    alert('You need to log in to access this page.');
    return <Navigate to="/resources" replace />;
  }

  // If the user's role is not in the allowed roles, redirect to login page
  if (!allowedRoles.includes(role)) {
    alert('You do not have permission to access this page.');
    return <Navigate to="/resources" replace />;
  }

  // If the user is a 'User', check if they have the required options and if the deadline has not passed
  if (role === 'User' && requiredOptions.length > 0) {
    const userOptions = options.map(option => option.option);
    const hasRequiredOptions = requiredOptions.every(option => userOptions.includes(option));

    if (!hasRequiredOptions) {
      alert('You do not have the required permissions to access this page.');
      navigate('/resources/Userdashboard');
      return null;
    }

    // Check if the deadline has passed for any required option
    const currentDate = new Date();
    const hasValidDeadline = requiredOptions.every(option => {
      const optionData = options.find(opt => opt.option === option);
      return optionData && new Date(optionData.deadline) > currentDate;
    });

    if (!hasValidDeadline) {
      alert('Your access to this page has expired.');
      navigate('/resources/Userdashboard');
      return null;
    }
  }

  // Render the children (protected component)
  return children;
};

export default ProtectedRoute;