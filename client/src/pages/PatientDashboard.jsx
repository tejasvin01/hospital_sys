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
  FaSignOutAlt,
  FaUserCircle
} from "react-icons/fa";

const PatientDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [patientData, setPatientData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("dashboard");
  const [showUserDropdown, setShowUserDropdown] = useState(false);
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
  
  const handleMenuClick = (sectionId) => {
    setActiveSection(sectionId);
    setSidebarOpen(false); // Close sidebar on mobile
    
    // Navigate based on menu item
    switch (sectionId) {
      case "dashboard":
        navigate("/patient-dashboard");
        break;
      case "reports":
        navigate("/my-report");
        break;
      case "invoices":
        navigate("/my-invoice");
        break;
      case "appointments":
        navigate("/patient-appointment");
        break;
      default:
        break;
    }
  };
  
  const handleLogout = () => {
    setShowUserDropdown(false);
    setSidebarOpen(false);
    logout();
    navigate("/login");
  };
  
  const closeSidebar = () => {
    setSidebarOpen(false);
  };
  
  return (
    <div className="flex flex-col h-screen bg-gray-100 md:flex-row">
      {/* Mobile Header - Only visible on mobile */}
      <header className="bg-white shadow-sm md:hidden z-10">
        <div className="flex items-center justify-between p-4">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none"
          >
            {sidebarOpen ? <FaTimes /> : <FaBars />}
          </button>
          <div className="flex items-center">
            <img 
              src={hospitalLogo}
              alt="Hospital Logo"
              className="h-8 w-8 mr-2" 
            />
            <h1 className="text-lg font-bold text-gray-800">MedCare HMS</h1>
          </div>
          <div className="w-8">
            {/* Placeholder for alignment */}
          </div>
        </div>
      </header>

      {/* Sidebar Overlay - Only visible on mobile when sidebar is open */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar - Now matches DoctorDashboard layout */}
      <div 
        className={`
          fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-md transform 
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
          md:translate-x-0 md:static md:h-screen
          transition-transform duration-300 ease-in-out
        `}
      >
        {/* Sidebar Header with Logo */}
        <div className="p-4 border-b md:block">
          <div className="flex items-center justify-center">
            <img 
              src={hospitalLogo}
              alt="Hospital Logo"
              className="h-10 w-10 mr-2" 
            />
            <h1 className="text-xl font-bold text-gray-800">MedCare HMS</h1>
          </div>
        </div>
        
        <div className="p-4">
          {/* Patient Profile Section */}
          <div className="flex items-center mb-6">
            <FaUserCircle className="text-gray-400 text-4xl mr-3" />
            <div>
              <h2 className="text-lg font-medium">{patientData?.name || "Patient"}</h2>
              <p className="text-sm text-gray-600">Patient</p>
            </div>
          </div>
          
          {/* Navigation Menu */}
          <nav className="mt-8">
            <div className="space-y-2">
              <button 
                onClick={() => handleMenuClick("dashboard")} 
                className={`w-full flex items-center px-4 py-3 rounded-lg ${
                  activeSection === "dashboard" 
                  ? "text-gray-900 bg-blue-50"
                  : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <FaHome className={`mr-3 ${activeSection === "dashboard" ? "text-blue-600" : "text-gray-500"}`} />
                <span>Dashboard</span>
              </button>
              
              <button 
                onClick={() => handleMenuClick("reports")} 
                className={`w-full flex items-center px-4 py-3 rounded-lg ${
                  activeSection === "reports" 
                  ? "text-gray-900 bg-blue-50"
                  : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <FaFileMedical className={`mr-3 ${activeSection === "reports" ? "text-blue-600" : "text-gray-500"}`} />
                <span>My Reports</span>
              </button>
              
              <button 
                onClick={() => handleMenuClick("invoices")} 
                className={`w-full flex items-center px-4 py-3 rounded-lg ${
                  activeSection === "invoices" 
                  ? "text-gray-900 bg-blue-50"
                  : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <FaFileInvoiceDollar className={`mr-3 ${activeSection === "invoices" ? "text-blue-600" : "text-gray-500"}`} />
                <span>My Invoices</span>
              </button>
              
              <button 
                onClick={() => handleMenuClick("appointments")} 
                className={`w-full flex items-center px-4 py-3 rounded-lg ${
                  activeSection === "appointments" 
                  ? "text-gray-900 bg-blue-50"
                  : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <FaCalendarAlt className={`mr-3 ${activeSection === "appointments" ? "text-blue-600" : "text-gray-500"}`} />
                <span>Book Appointments</span>
              </button>
            </div>
          </nav>
        </div>
        
        {/* Logout Button - Fixed at Bottom */}
        <div className="absolute bottom-0 w-64 p-4 border-t bg-white">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-2 text-red-600 rounded-lg hover:bg-red-50"
          >
            <FaSignOutAlt className="mr-3" />
            <span>Logout</span>
          </button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto pt-0 md:pt-0">
        {/* Desktop Header - Hidden on mobile */}
        <header className="bg-white shadow-sm hidden md:block">
          <div className="flex items-center justify-between px-6 py-5">
            <h1 className="text-2xl font-bold text-gray-800">Patient Dashboard</h1>
            
            {/* Optional User Menu on Desktop */}
            <div className="relative">
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center space-x-3 cursor-pointer"
              >
                <img
                  src={user?.profileImage || "https://public.readdy.ai/ai/img_res/4769923e2a4b10f063d40bf3f71c0205.jpg"}
                  alt="User"
                  className="h-10 w-10 rounded-full object-cover"
                />
                <span className="text-gray-700">{patientData?.name || user?.name || 'User'}</span>
                <FaChevronDown className="text-gray-500" />
              </button>
              {showUserDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-50">
                  <div className="py-2">
                    <button
                      onClick={handleLogout}
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>
        
        {/* Dashboard Content */}
        <main className="p-4 md:p-6 mt-0 md:mt-0">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              <p className="ml-3 text-gray-600">Loading dashboard data...</p>
            </div>
          ) : (
            /* Welcome section with responsive layout */
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
                    onClick={() => handleMenuClick("appointments")}
                    className="px-4 sm:px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors w-full sm:w-auto"
                  >
                    Book an Appointment
                  </button>
                  <button
                    onClick={() => handleMenuClick("reports")}
                    className="px-4 sm:px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors w-full sm:w-auto"
                  >
                    View Reports
                  </button>
                  <button
                    onClick={() => handleMenuClick("invoices")}
                    className="px-4 sm:px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors w-full sm:w-auto"
                  >
                    View Invoices
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default PatientDashboard;