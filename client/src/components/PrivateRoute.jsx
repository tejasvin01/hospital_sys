import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const PrivateRoute = ({ element, role }) => {
  const { user } = useContext(AuthContext);
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  if (Array.isArray(role)) {
    return role.includes(user.role) ? element : <Navigate to="/login" />;
  }
  
  return user.role === role ? element : <Navigate to="/login" />;
};

export default PrivateRoute;