import axios from "axios";

const API_URL = "http://localhost:5000"; 

export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(
      `${API_URL}/auth/login`, { email, password }, );

      if (response.data.token) {
        return response.data;
      } else {
        throw new Error("No token received");
      }
  
  } catch (error) {
    console.error("Login error:", error.response?.data || error.message);
    throw error.response?.data || { message: "Server error" };
  }
};
