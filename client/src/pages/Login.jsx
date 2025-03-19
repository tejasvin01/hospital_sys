import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { loginUser } from "../api/auth";
import { jwtDecode } from "jwt-decode";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faSpinner } from "@fortawesome/free-solid-svg-icons";


const Login = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (!email || !password) {
        throw new Error("Please fill in all fields");
      }
      const data = await loginUser(email, password);
      if (data.token) {
        login(data.token);
        const decoded = jwtDecode(data.token);
        if (decoded.role === "admin") navigate("/admin-dashboard");
        else if (decoded.role === "doctor") navigate("/doctor-dashboard");
        else if (decoded.role === "receptionist") navigate("/receptionist-dashboard");
        else if (decoded.role === "patient") navigate("/patient-dashboard");
        else navigate("/login");
      } else {
        setError("Login failed. No token received.");
      }
    } catch (err) {
      setError(err.message || "Login failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-[400px] bg-white rounded-2xl shadow-lg p-8">
        <div className="flex justify-center mb-8">
          <img 
            src="/images/hospital-logo.png"
            alt="Hospital Logo"
            className="w-[120px] h-[120px] object-contain"
          />
        </div>
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Login to access your dashboard</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full h-12 px-4 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2B84EA] text-sm"
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full h-12 px-4 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2B84EA] text-sm"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
            >
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </button>
          </div>
          <div className="flex items-center justify-between">
            
            <button type="button" className="text-sm text-[#2B84EA] hover:text-[#2876D0] cursor-pointer" onClick={() => navigate("/signup")}>
              Already have account? Signup
            </button>
          </div>
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 bg-gradient-to-r from-[#2B84EA] to-[#2876D0] text-white font-medium rounded-lg transition-all hover:opacity-90 flex items-center justify-center cursor-pointer"
          >
           {isLoading ? <FontAwesomeIcon icon={faSpinner} spin /> : "Login to Dashboard"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
