import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaUserMd,
  FaEye,
  FaEyeSlash,
  FaSpinner,
  FaArrowLeft,
  FaPlus,
  FaCalendarAlt,
  FaPhoneAlt,
  FaVenusMars,
  FaMapMarkerAlt,
  FaTint,
} from "react-icons/fa";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [bloodGroup, setBloodGroup] = useState(""); // Added blood group
  const [address, setAddress] = useState(""); // Added address
  const [role, setRole] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const navigate = useNavigate();

  const validateForm = () => {
    const errors = {};

    if (!name.trim()) errors.name = "Name is required";

    if (!email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Email address is invalid";
    }

    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    if (!role) {
      errors.role = "Please select a role";
    }

    // Validations for age, gender, and contact number
    if (age && (isNaN(age) || age < 1 || age > 120)) {
      errors.age = "Please enter a valid age between 1 and 120";
    }

    if (!gender) {
      errors.gender = "Please select your gender";
    }

    if (
      contactNumber &&
      !/^\+?[0-9]{10,15}$/.test(contactNumber.replace(/[\s-]/g, ""))
    ) {
      errors.contactNumber = "Please enter a valid phone number";
    }

    // If patient role is selected, require blood group
    if (role === "patient" && !bloodGroup) {
      errors.bloodGroup = "Blood group is required for patients";
    }

    // Address validation - only validate if something is entered
    if (address && address.trim().length < 5) {
      errors.address = "Please enter a complete address";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;

    // Include all fields in the payload
    const payload = {
      name,
      email,
      password,
      role,
      age: age || undefined,
      gender: gender || undefined,
      contactNumber: contactNumber || undefined,
      bloodGroup: bloodGroup || undefined,
      address: address || undefined,
    };

    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/auth/signup",
        payload
      );
      setSuccess("Signup successful! Redirecting to login...");
      window.scrollTo(0, 0);
      alert("Signup successful! Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (err) {
      console.error("Signup error:", err.response);

      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err.response?.data?.errors) {
        // Handle multiple validation errors
        const errorMessages = Object.values(err.response.data.errors).join(
          ", "
        );
        setError(`Validation errors: ${errorMessages}`);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError("Signup failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = () => {
    if (!password) return { width: "0%", color: "bg-gray-200" };

    if (password.length < 6) {
      return { width: "33%", color: "bg-red-500", text: "Weak" };
    } else if (password.length < 10) {
      return { width: "66%", color: "bg-yellow-500", text: "Medium" };
    } else {
      return { width: "100%", color: "bg-green-500", text: "Strong" };
    }
  };

  const passwordStrength = getPasswordStrength();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">
        {/* Left Side - Info Section */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-8 md:p-12 text-white md:w-2/5 flex flex-col justify-between">
          <div>
            <div className="flex items-center mb-8">
              <FaPlus className="text-3xl mr-3" />
              <h1 className="text-2xl font-bold">MedCare HMS</h1>
            </div>

            <h2 className="text-3xl font-bold mb-6">
              Join Our Healthcare Platform
            </h2>
            <p className="text-blue-100 mb-6">
              Create an account to access our hospital management system and
              experience seamless healthcare services.
            </p>

            <div className="space-y-4">
              <div className="flex items-center">
                <div className="bg-blue-500 bg-opacity-30 p-2 rounded-full mr-3">
                  <FaUserMd className="text-xl" />
                </div>
                <div>
                  <h3 className="font-semibold">
                    For Healthcare Professionals
                  </h3>
                  <p className="text-sm text-blue-100">
                    Manage patient records, appointments, and more
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="bg-blue-500 bg-opacity-30 p-2 rounded-full mr-3">
                  <FaUser className="text-xl" />
                </div>
                <div>
                  <h3 className="font-semibold">For Patients</h3>
                  <p className="text-sm text-blue-100">
                    Book appointments, view medical records, and get
                    prescriptions
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <p className="text-blue-100 mt-8">Already have an account?</p>
            <button
              onClick={() => navigate("/login")}
              className="inline-flex items-center text-white hover:underline font-medium mt-2 cursor-pointer bg-transparent border-0"
            >
              <FaArrowLeft className="mr-2 text-sm" />
              Back to Login
            </button>
          </div>
        </div>

        {/* Right Side - Form Section */}
        <div className="p-8 md:p-12 md:w-3/5 overflow-y-auto max-h-screen">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Create Your Account
            </h2>
            <p className="text-gray-500">
              Fill in your information to get started
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
              <div className="flex items-center">
                <svg
                  className="h-5 w-5 text-red-500 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-red-700 font-medium">{error}</p>
              </div>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded animate-pulse">
              <div className="flex items-center">
                <svg
                  className="h-5 w-5 text-green-500 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-green-700 font-medium">{success}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Role Selection - Moved to top to conditionally show fields */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Role <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUserMd className="text-gray-400" />
                </div>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className={`pl-10 w-full py-3 border ${
                    formErrors.role ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:ring-blue-500 focus:border-blue-500 appearance-none bg-no-repeat`}
                  style={{
                    backgroundImage:
                      'url(\'data:image/svg+xml;charset=US-ASCII,<svg width="24" height="24" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z" fill="%23555"/></svg>\')',
                    backgroundPosition: "right 0.5rem center",
                  }}
                >
                  <option value="">Select Your Role</option>
                  <option value="admin">Administrator</option>
                  <option value="doctor">Doctor</option>
                  <option value="receptionist">Receptionist</option>
                  <option value="patient">Patient</option>
                </select>
              </div>
              {formErrors.role && (
                <p className="mt-1 text-sm text-red-600">{formErrors.role}</p>
              )}
            </div>

            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`pl-10 w-full py-3 border ${
                    formErrors.name ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:ring-blue-500 focus:border-blue-500`}
                />
              </div>
              {formErrors.name && (
                <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="text-gray-400" />
                </div>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`pl-10 w-full py-3 border ${
                    formErrors.email ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:ring-blue-500 focus:border-blue-500`}
                />
              </div>
              {formErrors.email && (
                <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Age Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Age
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaCalendarAlt className="text-gray-400" />
                  </div>
                  <input
                    type="number"
                    min="1"
                    max="120"
                    placeholder="Enter your age"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className={`pl-10 w-full py-3 border ${
                      formErrors.age ? "border-red-500" : "border-gray-300"
                    } rounded-lg focus:ring-blue-500 focus:border-blue-500`}
                  />
                </div>
                {formErrors.age && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.age}</p>
                )}
              </div>

              {/* Contact Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaPhoneAlt className="text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    placeholder="Enter your phone number"
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    className={`pl-10 w-full py-3 border ${
                      formErrors.contactNumber
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-lg focus:ring-blue-500 focus:border-blue-500`}
                  />
                </div>
                {formErrors.contactNumber && (
                  <p className="mt-1 text-sm text-red-600">
                    {formErrors.contactNumber}
                  </p>
                )}
              </div>
            </div>

            {/* Gender Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gender
              </label>
              <div className="relative flex items-center pl-3">
                <FaVenusMars className="text-gray-400 mr-3" />
                <div className="flex flex-wrap gap-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="gender"
                      value="Male"
                      checked={gender === "Male"}
                      onChange={() => setGender("Male")}
                      className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-gray-700">Male</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="gender"
                      value="Female"
                      checked={gender === "Female"}
                      onChange={() => setGender("Female")}
                      className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-gray-700">Female</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="gender"
                      value="Other"
                      checked={gender === "Other"}
                      onChange={() => setGender("Other")}
                      className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-gray-700">Other</span>
                  </label>
                </div>
              </div>
              {formErrors.gender && (
                <p className="mt-1 text-sm text-red-600">{formErrors.gender}</p>
              )}
            </div>

            {/* Blood Group - NEW FIELD */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Blood Group{" "}
                {role === "patient" && <span className="text-red-500">*</span>}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaTint className="text-gray-400" />
                </div>
                <select
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  className={`pl-10 w-full py-3 border ${
                    formErrors.bloodGroup ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:ring-blue-500 focus:border-blue-500 appearance-none bg-no-repeat`}
                  style={{
                    backgroundImage:
                      'url(\'data:image/svg+xml;charset=US-ASCII,<svg width="24" height="24" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z" fill="%23555"/></svg>\')',
                    backgroundPosition: "right 0.5rem center",
                  }}
                >
                  <option value="">Select Blood Group</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
              {formErrors.bloodGroup && (
                <p className="mt-1 text-sm text-red-600">
                  {formErrors.bloodGroup}
                </p>
              )}
            </div>

            {/* Address - NEW FIELD */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <div className="relative">
                <div className="absolute top-3 left-3 pointer-events-none">
                  <FaMapMarkerAlt className="text-gray-400" />
                </div>
                <textarea
                  placeholder="Enter your full address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows="3"
                  className={`pl-10 w-full py-3 border ${
                    formErrors.address ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:ring-blue-500 focus:border-blue-500`}
                ></textarea>
              </div>
              {formErrors.address && (
                <p className="mt-1 text-sm text-red-600">
                  {formErrors.address}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`pl-10 w-full py-3 border ${
                    formErrors.password ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:ring-blue-500 focus:border-blue-500`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <FaEyeSlash className="text-gray-400" />
                  ) : (
                    <FaEye className="text-gray-400" />
                  )}
                </button>
              </div>
              {formErrors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {formErrors.password}
                </p>
              )}

              {/* Password Strength Indicator */}
              {password && (
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`${passwordStrength.color} h-2 rounded-full transition-all duration-300`}
                      style={{ width: passwordStrength.width }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Password strength: {passwordStrength.text}
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`pl-10 w-full py-3 border ${
                    formErrors.confirmPassword
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-lg focus:ring-blue-500 focus:border-blue-500`}
                />
              </div>
              {formErrors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {formErrors.confirmPassword}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="mt-8">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <FaSpinner className="animate-spin mr-2" />
                    Creating Account...
                  </span>
                ) : (
                  "Create Account"
                )}
              </button>
            </div>
          </form>

          <p className="text-center mt-8 text-sm text-gray-500">
            By signing up, you agree to our
            <a href="#" className="text-blue-600 hover:underline">
              {" "}
              Terms of Service
            </a>{" "}
            and
            <a href="#" className="text-blue-600 hover:underline">
              {" "}
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
