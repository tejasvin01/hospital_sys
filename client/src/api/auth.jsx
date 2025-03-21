import axios from "axios";

const API_URL = "http://ec2-3-110-49-41.ap-south-1.compute.amazonaws.com:5000"; 

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
