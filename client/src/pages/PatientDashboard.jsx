import React, { useContext, useState, useEffect } from "react";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import hospitalLogo from "../assets/images/hospital-logo.png";
import axios from "axios";
import {
  FaChevronDown,
  FaBars,
  FaTimes,
  FaHome,
  FaFileInvoiceDollar,
  FaCalendarAlt,
  FaFileMedical,
  FaSignOutAlt
} from "react-icons/fa";

const PatientDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [patientData, setPatientData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("dashboard");
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  // Add state for mobile sidebar
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        // Get the token
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        if (!token) {
          throw new Error("No token found");
        }
        
        // Decode the token to get the current user's ID
        const decoded = jwtDecode(token);
        const userId = decoded.id;
        // Fetch all users
        const response = await axios.get("https://medcarehms.onrender.com/users", {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Find the current user in the response
        const currentUser = response.data.find(user => user._id === userId);
        
        if (currentUser) {
          setPatientData(currentUser);
        }
      } catch (error) {
        console.error("Error fetching patient data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPatientData();
  }, []);
  
  // Close sidebar on mobile when clicking a navigation item
  const handleNavigation = (path) => {
    setSidebarOpen(false);
    navigate(path);
  };
  
  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      {/* Fixed Header - Updated for mobile */}
      <header className="fixed top-0 left-0 right-0 bg-white shadow-sm flex-shrink-0 z-30">
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center">
            {/* Mobile menu toggle button */}
            <button 
              className="mr-3 text-gray-500 md:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <img
                src={hospitalLogo}
                alt="Hospital Logo"
                className="h-8"
              />
              <h1 className="text-lg sm:text-xl font-semibold text-gray-800">MedCare HMS</h1>
            </div>
          </div>
          <div className="flex items-center">
            {/* Right side - User profile */}
            <div className="relative">
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center space-x-2 sm:space-x-3 cursor-pointer"
              >
                <img
                  src={user?.profileImage || "https://public.readdy.ai/ai/img_res/4769923e2a4b10f063d40bf3f71c0205.jpg"}
                  alt="User"
                  className="h-8 w-8 sm:h-10 sm:w-10 rounded-full object-cover"
                />
                <span className="text-gray-700 hidden sm:inline">{patientData?.name || user?.name || 'User'}</span>
                <FaChevronDown className="text-gray-500" />
              </button>
              {showUserDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-50">
                  <div className="py-2">
                    <button
                      onClick={logout}
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main content area with padding top for fixed header */}
      <div className="flex flex-1 pt-16 overflow-hidden">
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}
        
        {/* Sidebar navigation - Now responsive */}
        <aside 
          className={`fixed top-16 left-0 w-64 bg-white shadow-sm h-screen overflow-y-auto z-20 transform transition-transform duration-300 ease-in-out ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          }`}
        >
          <nav className="mt-4">
            <div
              className={`flex items-center px-4 py-3 cursor-pointer ${
                activeSection === "dashboard"
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600"
              }`}
              onClick={() => handleNavigation("/patient-dashboard")}
            >
              <FaHome className="text-xl w-8" />
              <span className="ml-3">Dashboard</span>
            </div>

            <div
              className={`flex items-center px-4 py-3 cursor-pointer ${
                activeSection === "reports"
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600"
              }`}
              onClick={() => handleNavigation("/my-report")}
            >
              <FaFileMedical className="text-xl w-8" />
              <span className="ml-3">My Report</span>
            </div>

            <div
              className={`flex items-center px-4 py-3 cursor-pointer ${
                activeSection === "invoices"
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600"
              }`}
              onClick={() => handleNavigation("/my-invoice")}
            >
              <FaFileInvoiceDollar className="text-xl w-8" />
              <span className="ml-3">My Invoice</span>
            </div>

            <div
              className={`flex items-center px-4 py-3 cursor-pointer ${
                activeSection === "appointments"
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600"
              }`}
              onClick={() => handleNavigation("/patient-appointment")}
            >
              <FaCalendarAlt className="text-xl w-8" />
              <span className="ml-3">Book Appointments</span>
            </div>
          </nav>

          <div className="fixed bottom-0 left-0 w-64 p-4 border-t bg-white shadow-md z-10">
            <button
              onClick={() => {
                setSidebarOpen(false);
                logout();
              }}
              className="flex items-center w-full text-gray-600 hover:text-red-600 transition-colors cursor-pointer p-2 rounded-lg hover:bg-gray-100"
            >
              <FaSignOutAlt className="text-xl w-8" />
              <span className="ml-3 font-medium">Logout</span>
            </button>
          </div>
        </aside>

        {/* Main content with responsive margin-left */}
        <div className={`flex-1 ${sidebarOpen ? 'ml-0' : 'ml-0 md:ml-64'} flex flex-col transition-all duration-300`}>
          <main className="p-4 sm:p-6 flex-1 overflow-y-auto">
            {/* Welcome section with responsive layout */}
            <div className="bg-white rounded-lg shadow mt-4">
              <div className="p-4 sm:p-8 border-b">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center">
                  Welcome to Your Health Portal
                </h2>
                <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto mt-3 text-center">
                  Access your reports, schedule appointments, and manage your
                  healthcare needs from one convenient place.
                </p>
              </div>

              <div className="px-4 sm:px-8 py-4 sm:py-6">
                <h3 className="text-xl font-semibold mb-4">
                  Healthcare in India
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h4 className="font-medium text-blue-600 mb-2">
                      Hospital Infrastructure
                    </h4>
                    <ul className="list-disc pl-5 space-y-1 text-gray-700">
                      <li>
                        India has over 69,000 hospitals with approximately 1.9
                        million beds
                      </li>
                      <li>
                        Public hospitals account for 60% of all hospitalizations
                        in rural areas
                      </li>
                      <li>
                        Over 25,000 Ayushman Bharat Health and Wellness Centers
                        established
                      </li>
                      <li>Telemedicine services growing at 20% annually</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-600 mb-2">
                      Medical Professionals
                    </h4>
                    <ul className="list-disc pl-5 space-y-1 text-gray-700">
                      <li>Over 1.2 million registered doctors in India</li>
                      <li>
                        Doctor-to-patient ratio of 1:1,457 (WHO recommendation is
                        1:1,000)
                      </li>
                      <li>More than 3.3 million registered nursing personnel</li>
                      <li>
                        750,000+ AYUSH practitioners (Ayurveda, Yoga, Naturopathy,
                        etc.)
                      </li>
                    </ul>
                  </div>
                </div>

                <h3 className="text-xl font-semibold mb-4 mt-8">
                  Common Laboratory Tests
                </h3>

                {/* Responsive table with horizontal scroll on mobile */}
                <div className="overflow-x-auto -mx-4 sm:mx-0">
                  <table className="min-w-full bg-white">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="py-2 px-4 border-b text-left">
                          Test Name
                        </th>
                        <th className="py-2 px-4 border-b text-left">Purpose</th>
                        <th className="py-2 px-4 border-b text-left">
                          Recommended Frequency
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="py-2 px-4 border-b">
                          Complete Blood Count (CBC)
                        </td>
                        <td className="py-2 px-4 border-b">
                          Screens for anemia, infection, and other disorders
                        </td>
                        <td className="py-2 px-4 border-b">Once a year</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-b">Blood Glucose Test</td>
                        <td className="py-2 px-4 border-b">
                          Measures blood sugar levels
                        </td>
                        <td className="py-2 px-4 border-b">
                          Every 3 years (more frequently for at-risk patients)
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-b">Lipid Profile</td>
                        <td className="py-2 px-4 border-b">
                          Measures cholesterol levels
                        </td>
                        <td className="py-2 px-4 border-b">
                          Every 5 years (annually for those with risk factors)
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-b">
                          Liver Function Test
                        </td>
                        <td className="py-2 px-4 border-b">
                          Checks liver health and function
                        </td>
                        <td className="py-2 px-4 border-b">
                          Annually for those over 45
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-b">Thyroid Profile</td>
                        <td className="py-2 px-4 border-b">
                          Evaluates thyroid function
                        </td>
                        <td className="py-2 px-4 border-b">
                          Every 5 years after age 35
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="bg-blue-50 p-4 sm:p-5 mt-8 rounded-lg">
                  <h4 className="text-lg font-medium text-blue-700 mb-2">
                    Did You Know?
                  </h4>
                  <ul className="list-disc pl-5 space-y-1 text-gray-700">
                    <li>
                      India is a popular destination for medical tourism, with
                      over 4.95 lakh medical tourists visiting annually
                    </li>
                    <li>
                      Indian pharmaceutical industry produces over 20% of the
                      world's generic medicines
                    </li>
                    <li>
                      Ayushman Bharat is one of the world's largest health
                      insurance schemes, covering over 500 million citizens
                    </li>
                    <li>
                      India has made significant progress in reducing infant
                      mortality rates by over 60% since 1990
                    </li>
                  </ul>
                </div>
              </div>

              {/* Action buttons - now stacked on mobile */}
              <div className="p-4 sm:p-6 bg-gray-50 rounded-b-lg border-t">
                <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
                  <button
                    onClick={() => handleNavigation("/patient-appointment")}
                    className="px-4 sm:px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors w-full sm:w-auto"
                  >
                    Book an Appointment
                  </button>
                  <button
                    onClick={() => handleNavigation("/my-report")}
                    className="px-4 sm:px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors w-full sm:w-auto"
                  >
                    View Reports
                  </button>
                  <button
                    onClick={() => handleNavigation("/my-invoice")}
                    className="px-4 sm:px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors w-full sm:w-auto"
                  >
                    View Invoices
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;