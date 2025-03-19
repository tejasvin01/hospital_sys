import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import axios from "axios";
import {jwtDecode} from "jwt-decode";
import {
  FaUserMd,
  FaCalendarAlt,
  FaClipboardList,
  FaFileMedical,
  FaSignOutAlt,
  FaUserCircle,
  FaUsers,
  FaRegClock
} from "react-icons/fa";

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const [userName, setUserName] = useState("");
  const [stats, setStats] = useState({
    appointments: 0,
    pendingAppointments: 0,
    totalPatients: 0,
    reportsCreated: 0
  });
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    
    const fetchDashboardData = async () => {
     
      try {
        setLoading(true);
        
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        
        if (!token) {
          throw new Error("No token found");
        }
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.id;
        // Fetch appointments
        const appointmentsRes = await axios.get("https://medcarehms.onrender.com/appointments", {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const today = new Date().toISOString().split('T')[0];
        
        // Filter appointments for this doctor
        const doctorAppointments = appointmentsRes.data.filter(appointment => {
          if (appointment.doctorId && typeof appointment.doctorId === 'object') {
            return appointment.doctorId._id === user._id;
          } else {
            return appointment.doctorId === user._id;
          }
        });
        
        
        // Check for different status names that might be used
        const pendingAppointments = doctorAppointments.filter(
          appointment => {
            const status = appointment.status ? appointment.status.toLowerCase() : '';
            return status === "pending" || status === "scheduled";
          }
        );
        
        const upcoming = pendingAppointments
          .filter(appointment => {
            const appointmentDate = appointment.date || '';
            return appointmentDate >= today;
          })
          .sort((a, b) => new Date(a.date) - new Date(b.date))
          .slice(0, 5);
        
        
        // Fetch patients - modify endpoint as needed
        const usersRes = await axios.get("https://medcarehms.onrender.com/users", {
          headers: { Authorization: `Bearer ${token}` }
        });
      
      // Get the current user's name and store it in state
      const currentUserName = usersRes.data.find((user) => user._id === userId)?.name;
      setUserName(currentUserName || "");
        // Filter only patients - Fix: store the array first, then get length
        const patientsList = usersRes.data.filter(user => user.role?.toLowerCase() === 'patient');
        const patientCount = patientsList.length;
        
        // Fetch reports
        const reportsRes = await axios.get("https://medcarehms.onrender.com/reports", {
          headers: { Authorization: `Bearer ${token}` }
        });
        

        
        // Fix doctor report filtering
        const doctorReports = reportsRes.data.filter(report => {
          if (report.doctorId && typeof report.doctorId === 'object') {
            return report.doctorId._id === userId;
          } else {
            return report.doctorId === user._id;
          }
        });
        
        
        const updatedStats = {
          appointments: doctorAppointments.length,
          pendingAppointments: pendingAppointments.length,
          totalPatients: patientCount, // Fix: use the correctly calculated patient count
          reportsCreated: doctorReports.length
        };
        
        setStats(updatedStats);
        setUpcomingAppointments(upcoming);
        
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setError("Error fetching dashboard data: " + (error.response?.data?.message || error.message));
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [user]);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md z-10">
        <div className="p-4 border-b">
          <div className="flex items-center justify-center">
          <img src="/src/assets/images/hospital-logo.png"
              alt="Hospital Logo"
              className="h-10 w-10" />
            <h1 className="text-xl font-bold text-gray-800">MedCare HMS</h1>
          </div>
        </div>
        
        <div className="p-4">
          <div className="flex items-center mb-6">
            <FaUserCircle className="text-gray-400 text-4xl mr-3" />
            <div>
              <h2 className="text-lg font-medium">{userName || "Doctor"}</h2>
              <p className="text-sm text-gray-600">Doctor</p>
            </div>
          </div>
          
          <nav className="mt-8">
            <div className="space-y-2">
              <button 
                onClick={() => {}} 
                className="w-full flex items-center px-4 py-3 text-gray-900 bg-blue-50 rounded-lg"
              >
                <FaUserMd className="mr-3 text-blue-600" />
                <span>Dashboard</span>
              </button>
              
              <button 
                onClick={() => navigate("/appointment")} 
                className="w-full flex items-center px-4 py-3 text-gray-600 rounded-lg hover:bg-gray-50"
              >
                <FaCalendarAlt className="mr-3 text-gray-500" />
                <span>Appointments</span>
              </button>
              
              <button 
                onClick={() => navigate("/createreport")} 
                className="w-full flex items-center px-4 py-3 text-gray-600 rounded-lg hover:bg-gray-50"
              >
                <FaFileMedical className="mr-3 text-gray-500" />
                <span>Create Report</span>
              </button>
              
              <button 
                onClick={() => navigate("/report")} 
                className="w-full flex items-center px-4 py-3 text-gray-600 rounded-lg hover:bg-gray-50"
              >
                <FaClipboardList className="mr-3 text-gray-500" />
                <span>Medical Reports</span>
              </button>
            </div>
          </nav>
        </div>
        
        <div className="absolute bottom-0 w-64 p-4 border-t bg-white">
          <button
            onClick={logout}
            className="w-full flex items-center px-4 py-2 text-red-600 rounded-lg hover:bg-red-50"
          >
            <FaSignOutAlt className="mr-3" />
            <span>Logout</span>
          </button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between px-6 py-5">
            <h1 className="text-2xl font-bold text-gray-800">Doctor Dashboard</h1>
            
          </div>
        </header>
        
        {/* Dashboard Content */}
        <main className="p-6">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              <p className="ml-3 text-gray-600">Loading dashboard data...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6">
              <p>{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="mt-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-md"
              >
                Retry
              </button>
            </div>
          ) : (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center">
                    <div className="bg-blue-100 p-3 rounded-full">
                      <FaCalendarAlt className="text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-500">Total Appointments</h3>
                      <p className="text-2xl font-semibold">{stats.appointments}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center">
                    <div className="bg-green-100 p-3 rounded-full">
                      <FaRegClock className="text-green-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-500">Pending Appointments</h3>
                      <p className="text-2xl font-semibold">{stats.pendingAppointments}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center">
                    <div className="bg-purple-100 p-3 rounded-full">
                      <FaUsers className="text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-500">Total Patients</h3>
                      <p className="text-2xl font-semibold">{stats.totalPatients}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center">
                    <div className="bg-yellow-100 p-3 rounded-full">
                      <FaFileMedical className="text-yellow-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-500">Reports Created</h3>
                      <p className="text-2xl font-semibold">{stats.reportsCreated}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              
              {/* Upcoming Appointments */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-4">Upcoming Appointments</h2>
                {upcomingAppointments.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Patient
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Time
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {upcomingAppointments.map((appointment) => (
                          <tr key={appointment._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <FaUserCircle className="text-gray-400 mr-2" />
                                <span>
                                  {appointment.patientName || 
                                   (appointment.patientId && typeof appointment.patientId === 'object' 
                                    ? appointment.patientId.name 
                                    : "Patient")}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {appointment.date ? new Date(appointment.date).toLocaleDateString() : "N/A"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {appointment.time || "N/A"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                {appointment.status || "Scheduled"}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="py-8 text-center text-gray-500">
                    No upcoming appointments
                  </div>
                )}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default DoctorDashboard;