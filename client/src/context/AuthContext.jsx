import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      
      const decoded = jwtDecode(token);

      setUser(decoded);
    }
  }, []);

  const login = (token) => {
    localStorage.setItem("token", token);
    const decoded = jwtDecode(token);
    setUser(decoded);
    if (!decoded.role) {
    }
    redirectUser(decoded.role);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  const redirectUser = (role) => {
    switch (role) {
      case "admin":
        navigate("/admin-dashboard");
        break;
      case "doctor":
        navigate("/doctor-dashboard");
        break;
      case "receptionist":
        navigate("/receptionist-dashboard");
        break;
      case "patient":
        navigate("/patient-dashboard");
        break;
      default:
        navigate("/login");
    }
  };

  return (
    <AuthContext.Provider value={{ user, login,logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
