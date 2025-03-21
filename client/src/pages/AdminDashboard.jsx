import React, { useState, useContext, useEffect } from "react";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import hospitalLogo from "../assets/images/hospital-logo.png";
import {
  FaUserMd,
  FaCalendarAlt,
  FaClipboardList,
  FaFileMedical,
  FaSignOutAlt,
  FaUserCircle,
  FaUsers,
  FaChartLine,
  FaMoneyBillWave,
  FaFileInvoice,
  FaBars,
  FaTimes
} from "react-icons/fa";

const AdminDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [selectedMenu, setSelectedMenu] = useState("dashboard");
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [recentUsers, setRecentUsers] = useState([]);
  
  // Change from mobileMenuOpen to sidebarOpen to match DoctorDashboard
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Stats state
  const [stats, setStats] = useState({
    totalPatients: 0,
    appointmentsToday: 0,
    activeDoctors: 0,
    totalReceptionists: 0,
  });

  // Fetch data for dashboard
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token =
          localStorage.getItem("token") || sessionStorage.getItem("token");
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.id;
        if (!token) {
          navigate("/login");
          return;
        }

        // Fetch users data
        const usersResponse = await axios.get(
          "http://ec2-3-110-49-41.ap-south-1.compute.amazonaws.com:5000/users",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const currentUserName = usersResponse.data.find(
          (user) => user._id === userId
        )?.name;
        setUserName(currentUserName || "");

        // Set recent users for the table
        setRecentUsers(usersResponse.data.slice(0, 5));

        // Calculate total patients and doctors
        const patientCount = usersResponse.data.filter(
          (user) => user.role?.toLowerCase() === "patient"
        ).length;

        const doctorCount = usersResponse.data.filter(
          (user) => user.role?.toLowerCase() === "doctor"
        ).length;

        const receptionistCount = usersResponse.data.filter(
          (user) => user.role?.toLowerCase() === "receptionist"
        ).length;
        
        // Fetch appointments for today
        const today = new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD
        const appointmentsResponse = await axios.get(
          "http://ec2-3-110-49-41.ap-south-1.compute.amazonaws.com:5000/appointments",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Filter appointments for today
        const todayAppointments = appointmentsResponse.data.filter(
          (appointment) => appointment.status === "Pending"
        );

        // Update stats with real data
        setStats({
          totalPatients: patientCount,
          appointmentsToday: todayAppointments.length,
          activeDoctors: doctorCount,
          totalReceptionists: receptionistCount,
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        // Set fallback data if API calls fail
        setRecentUsers([
          {
            id: 1,
            name: "Sarah Williams",
            email: "sarah.w@example.com",
            role: "patient",
          },
          {
            id: 2,
            name: "James Anderson",
            email: "james.a@example.com",
            role: "patient",
          },
          {
            id: 3,
            name: "Dr. Elizabeth Parker",
            email: "elizabeth.p@example.com",
            role: "doctor",
          },
          {
            id: 4,
            name: "Dr. Robert Chen",
            email: "robert.c@example.com",
            role: "doctor",
          },
        ]);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  const handleMenuClick = (menuId) => {
    setSelectedMenu(menuId);
    setSidebarOpen(false); // Close sidebar when clicking an item
    
    switch (menuId) {
      case "appointments":
        navigate("/appointment");
        break;
      case "reports":
        navigate("/report");
        break;
      case "billing":
        navigate("/invoice");
        break;
      case "invoices":
        navigate("/invoice/all");
        break;
      case "users":
        navigate("/allusers");
        break;
      default:
        break;
    }
  };

  const handleLogout = () => {
    setShowUserDropdown(false);
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
      
      {/* Sidebar - Now matches DoctorDashboard */}
      <div 
        className={`
          fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-md transform 
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
          md:translate-x-0 md:static md:h-screen
          transition-transform duration-300 ease-in-out
        `}
      >
        {/* Sidebar Header */}
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
          {/* Admin Profile */}
          <div className="flex items-center mb-6">
            <FaUserCircle className="text-gray-400 text-4xl mr-3" />
            <div>
              <h2 className="text-lg font-medium">{userName || "Admin"}</h2>
              <p className="text-sm text-gray-600">Administrator</p>
            </div>
          </div>
          
          {/* Navigation Menu */}
          <nav className="mt-8">
            <div className="space-y-2">
              <button 
                onClick={() => handleMenuClick("dashboard")} 
                className={`w-full flex items-center px-4 py-3 rounded-lg ${
                  selectedMenu === "dashboard" 
                  ? "text-gray-900 bg-blue-50"
                  : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <FaChartLine className={`mr-3 ${selectedMenu === "dashboard" ? "text-blue-600" : "text-gray-500"}`} />
                <span>Dashboard</span>
              </button>
              
              <button 
                onClick={() => handleMenuClick("users")} 
                className={`w-full flex items-center px-4 py-3 rounded-lg ${
                  selectedMenu === "users" 
                  ? "text-gray-900 bg-blue-50"
                  : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <FaUserMd className={`mr-3 ${selectedMenu === "users" ? "text-blue-600" : "text-gray-500"}`} />
                <span>Users</span>
              </button>
              
              <button 
                onClick={() => handleMenuClick("appointments")} 
                className={`w-full flex items-center px-4 py-3 rounded-lg ${
                  selectedMenu === "appointments" 
                  ? "text-gray-900 bg-blue-50"
                  : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <FaCalendarAlt className={`mr-3 ${selectedMenu === "appointments" ? "text-blue-600" : "text-gray-500"}`} />
                <span>Appointments</span>
              </button>
              
              <button 
                onClick={() => handleMenuClick("reports")} 
                className={`w-full flex items-center px-4 py-3 rounded-lg ${
                  selectedMenu === "reports" 
                  ? "text-gray-900 bg-blue-50"
                  : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <FaClipboardList className={`mr-3 ${selectedMenu === "reports" ? "text-blue-600" : "text-gray-500"}`} />
                <span>Reports</span>
              </button>
              
              <button 
                onClick={() => handleMenuClick("billing")} 
                className={`w-full flex items-center px-4 py-3 rounded-lg ${
                  selectedMenu === "billing" 
                  ? "text-gray-900 bg-blue-50"
                  : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <FaMoneyBillWave className={`mr-3 ${selectedMenu === "billing" ? "text-blue-600" : "text-gray-500"}`} />
                <span>Billing</span>
              </button>
              
              <button 
                onClick={() => handleMenuClick("invoices")} 
                className={`w-full flex items-center px-4 py-3 rounded-lg ${
                  selectedMenu === "invoices" 
                  ? "text-gray-900 bg-blue-50"
                  : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <FaFileInvoice className={`mr-3 ${selectedMenu === "invoices" ? "text-blue-600" : "text-gray-500"}`} />
                <span>Invoices</span>
              </button>
            </div>
          </nav>
        </div>
        
        {/* Logout Button */}
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
            <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
          </div>
        </header>
        
        {/* Dashboard Content */}
        <main className="p-4 md:p-6 mt-0 md:mt-0">
          {/* Stats grid - responsive columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6">
            {[
              {
                title: "Total Patients",
                value: stats.totalPatients,
                icon: <FaUsers className="text-white text-xl sm:text-2xl" />,
                color: "bg-blue-500",
              },
              {
                title: "Appointments Pending",
                value: stats.appointmentsToday,
                icon: <FaCalendarAlt className="text-white text-xl sm:text-2xl" />,
                color: "bg-green-500",
              },
              {
                title: "Active Doctors",
                value: stats.activeDoctors,
                icon: <FaUserMd className="text-white text-xl sm:text-2xl" />,
                color: "bg-purple-500",
              },
              {
                title: "Total Receptionists",
                value: stats.totalReceptionists,
                icon: <FaUserCircle className="text-white text-xl sm:text-2xl" />,
                color: "bg-amber-500",
              },
            ].map((stat, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-4 sm:p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm sm:text-base text-gray-500 font-medium">
                      {stat.title}
                    </p>
                    <h3 className="text-2xl sm:text-4xl font-bold mt-2">{stat.value}</h3>
                  </div>
                  <div className={`${stat.color} text-white p-3 sm:p-4 rounded-full`}>
                    {stat.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Recent Users Table - with horizontal scroll on mobile */}
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-4">Recent Users</h2>
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentUsers.map((user) => (
                    <tr key={user._id || user.id}>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm">
                        {user.name}
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                        ${
                          user.role === "receptionist"
                            ? "bg-purple-100 text-purple-800"
                            : user.role === "doctor"
                            ? "bg-green-100 text-green-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                        >
                          {user.role &&
                            user.role.charAt(0).toUpperCase() +
                              user.role.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm truncate max-w-[150px] sm:max-w-none">
                        {user.email}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;