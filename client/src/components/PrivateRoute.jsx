import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const PrivateRoute = ({ element, role }) => {
  const { user } = useContext(AuthContext);
  
  // Check if user exists
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  // Handle array of roles
  if (Array.isArray(role)) {
    // If role is an array, check if the user's role is included in the array
    return role.includes(user.role) ? element : <Navigate to="/login" />;
  }
  
  // Handle single role (string)
  return user.role === role ? element : <Navigate to="/login" />;
};

export default PrivateRoute;