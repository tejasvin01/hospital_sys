import React, { useState, useContext, useEffect } from "react";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

const AdminDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");

  const [selectedMenu, setSelectedMenu] = useState("dashboard");
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const [recentUsers, setRecentUsers] = useState([]);
  // Add new state variables for dashboard stats
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
          "https://medcarehms.onrender.com/users",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        ); // Log the users data for debugging
        const currentUserName = usersResponse.data.find(
          (user) => user._id === userId
        )?.name; // Log the user name for debugging
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
          "https://medcarehms.onrender.com/appointments",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Filter appointments for today
        const todayAppointments = appointmentsResponse.data.filter(
          (appointment) =>  appointment.status === "Pending"
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

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-white shadow-sm flex-shrink-0">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center ">
            <img
              src="/src/assets/images/hospital-logo.png"
              alt="Hospital Logo"
              className="h-10 w-10"
            />
            <h1 className="text-xl font-semibold text-gray-800">MedCare HMS</h1>
          </div>
          <div className="flex items-center space-x-6">
            {/* User Profile */}
            <div className="relative">
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center space-x-3 cursor-pointer"
              >
                <img
                  src="https://public.readdy.ai/ai/img_res/4769923e2a4b10f063d40bf3f71c0205.jpg"
                  alt="Admin"
                  className="h-10 w-10 rounded-full object-cover"
                />
                <span className="text-gray-700">{userName || "Admin"}</span>
                <i className="fas fa-chevron-down text-gray-500"></i>
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
        </div>
      </header>
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-sm overflow-y-auto relative">
          <nav className="p-4 pb-20">
            <div className="space-y-2">
              {[
                {
                  icon: "fas fa-chart-line",
                  text: "Dashboard",
                  id: "dashboard",
                },
                { icon: "fas fa-user-md", text: "Users", id: "users" },
                {
                  icon: "fas fa-calendar-alt",
                  text: "Appointments",
                  id: "appointments",
                },
                { icon: "fas fa-file-medical", text: "Reports", id: "reports" },
                {
                  icon: "fas fa-money-bill-wave",
                  text: "Billing",
                  id: "billing",
                },
                {
                  icon: "fas fa-file-invoice",
                  text: "Invoices",
                  id: "invoices",
                },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleMenuClick(item.id)}
                  className={`flex items-center space-x-3 w-full p-3 rounded-lg cursor-pointer whitespace-nowrap
                  ${
                    selectedMenu === item.id
                      ? "bg-indigo-50 text-indigo-600"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <i className={`${item.icon} w-5`}></i>
                  <span>{item.text}</span>
                </button>
              ))}
            </div>
          </nav>

          {/* Fixed Logout Button */}
          <div className="fixed bottom-0 left-0 w-64 p-4 border-t bg-white shadow-md z-10">
            <button
              onClick={logout}
              className="flex items-center w-full text-gray-600 hover:text-red-600 transition-colors cursor-pointer p-2 rounded-lg hover:bg-gray-100"
            >
              <i className="fas fa-sign-out-alt text-xl w-8"></i>
              <span className="ml-3 font-medium">Logout</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="grid grid-cols-2 md:grid-cols-2 gap-6 mb-6">
            {[
              {
                title: "Total Patients",
                value: stats.totalPatients,
                icon: "fas fa-users",
                color: "bg-blue-500",
              },
              {
                title: "Appointments Pending",
                value: stats.appointmentsToday,
                icon: "fas fa-calendar-check",
                color: "bg-green-500",
              },
              {
                title: "Active Doctors",
                value: stats.activeDoctors,
                icon: "fas fa-user-md",
                color: "bg-purple-500",
              },
              {
                title: "Total Receptionists",
                value: stats.totalReceptionists,
                icon: "fas fa-id-card",
                color: "bg-amber-500",
              },
            ].map((stat, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-base text-gray-500 font-medium">
                      {stat.title}
                    </p>
                    <h3 className="text-4xl font-bold mt-2">{stat.value}</h3>
                  </div>
                  <div className={`${stat.color} text-white p-4 rounded-full`}>
                    <i className={`${stat.icon} text-2xl`}></i>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Users</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentUsers.map((user) => (
                    <tr key={user._id || user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
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
                      <td className="px-6 py-4 whitespace-nowrap">
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
