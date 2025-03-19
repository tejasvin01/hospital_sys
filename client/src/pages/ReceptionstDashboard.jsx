import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import hospitalLogo from "../assets/images/hospital-logo.png";
import {
  FaCalendarAlt,
  FaClipboardList,
  FaSignOutAlt,
  FaUserCircle,
  FaUsers,
  FaPhoneAlt,
  FaFileInvoiceDollar,
  FaReceipt,
  FaFileAlt,
} from "react-icons/fa";

const ReceptionistDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const [userName, setUserName] = useState("");
  const [stats, setStats] = useState({
    todayAppointments: 0,
    totalDoctors: 0,
    totalPatients: 0,
  });
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const token =
          localStorage.getItem("token") || sessionStorage.getItem("token");
        const decoded = jwtDecode(token);
        const id= decoded.id;
        if (!token) {
          throw new Error("No token found");
        }

        // Fix endpoint from "appointments" to "appointment"
        const appointmentsRes = await axios.get(
          "https://medcarehms.onrender.com/appointments",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const today = new Date().toISOString().split("T")[0];

        // Filter today's appointments
        const todayAppointments = appointmentsRes.data.filter(
          (appointment) =>  appointment.status === "Pending"
        );

        // Get recent appointments for display
        const recent = appointmentsRes.data
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 5);

        // Fetch users
        const usersRes = await axios.get("https://medcarehms.onrender.com/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const currentUserName = usersRes.data.find((user) => user._id === id)?.name;
        setUserName(currentUserName || "User"); // Log the user name for debugging
        const doctors = usersRes.data.filter(
          (user) => user.role?.toLowerCase() === "doctor"
        );
        const patients = usersRes.data.filter(
          (user) => user.role?.toLowerCase() === "patient"
        );

        setStats({
          todayAppointments: todayAppointments.length,
          totalDoctors: doctors.length,
          totalPatients: patients.length,
        });

        setRecentAppointments(recent);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setError("Error fetching dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);
  // Add this function inside the component, before the return statement

  const handleCallPatient = (appointment) => {
    let contactNumber;

    // Check if patient info is available as an object
    if (appointment.patientId && typeof appointment.patientId === "object") {
      contactNumber = appointment.patientId.contactNumber;
    }

    // If we couldn't get the contact number directly, try to get it from the appointment
    if (!contactNumber && appointment.patientContactNumber) {
      contactNumber = appointment.patientContactNumber;
    }

    if (contactNumber) {
      // Use tel: protocol to initiate call
      window.location.href = `tel:${contactNumber}`;
    } else {
      // If no contact found, show modal or alert
      const patientName =
        appointment.patientName ||
        (appointment.patientId && typeof appointment.patientId === "object"
          ? appointment.patientId.name
          : "Patient");

      alert(
        `No contact information available for ${patientName}. Please update patient records.`
      );
    }
  };


  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md z-10">
        <div className="p-4 border-b">
          <div className="flex items-center justify-center">
          <img src={hospitalLogo}
              alt="Hospital Logo"
              className="h-10 w-10" />
            <h1 className="text-xl font-bold text-gray-800">MedCare HMS</h1>
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-center mb-6">
            <FaUserCircle className="text-gray-400 text-4xl mr-3" />
            <div>
              <h2 className="text-lg font-medium">
                { userName || "Receptionist"}
              </h2>
              <p className="text-sm text-gray-600">Receptionist</p>
            </div>
          </div>

          <nav className="mt-8">
            <div className="space-y-2">
              <button
                onClick={() => {}}
                className="w-full flex items-center px-4 py-3 text-gray-900 bg-blue-50 rounded-lg"
              >
                <FaClipboardList className="mr-3 text-blue-600" />
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
                onClick={() => navigate("/report")}
                className="w-full flex items-center px-4 py-3 text-gray-600 rounded-lg hover:bg-gray-50"
              >
                <FaFileAlt className="mr-3 text-gray-500" />
                <span>Patient Reports</span>
              </button>

              <button
                onClick={() => navigate("/invoice")}
                className="w-full flex items-center px-4 py-3 text-gray-600 rounded-lg hover:bg-gray-50"
              >
                <FaFileInvoiceDollar className="mr-3 text-gray-500" />
                <span>Create Invoice</span>
              </button>

              <button
                onClick={() => navigate("/invoice/all")}
                className="w-full flex items-center px-4 py-3 text-gray-600 rounded-lg hover:bg-gray-50"
              >
                <FaReceipt className="mr-3 text-gray-500" />
                <span>Patient Invoices</span>
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
          <div className="flex items-center justify-between px-6 py-4">
            <h1 className="text-2xl font-bold text-gray-800">
              Reception Dashboard
            </h1>
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
              {/* Stats Cards - Modified to use 3 columns and removed Pending Check-ins card */}
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center">
                    <div className="bg-blue-100 p-3 rounded-full">
                      <FaCalendarAlt className="text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-500">
                        Appointments Pending
                      </h3>
                      <p className="text-2xl font-semibold">
                        {stats.todayAppointments}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center">
                    <div className="bg-purple-100 p-3 rounded-full">
                      <FaUsers className="text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-500">
                        Total Doctors
                      </h3>
                      <p className="text-2xl font-semibold">
                        {stats.totalDoctors}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center">
                    <div className="bg-yellow-100 p-3 rounded-full">
                      <FaUserCircle className="text-yellow-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-500">
                        Total Patients
                      </h3>
                      <p className="text-2xl font-semibold">
                        {stats.totalPatients}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Appointments */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-4">
                  Recent Appointments
                </h2>
                {recentAppointments.length > 0 ? (
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
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {recentAppointments.map((appointment) => (
                          <tr
                            key={appointment._id}
                            className="hover:bg-gray-50"
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <FaUserCircle className="text-gray-400 mr-2" />
                                <span>
                                  {appointment.patientName ||
                                    (appointment.patientId &&
                                    typeof appointment.patientId === "object"
                                      ? appointment.patientId.name
                                      : "Patient")}
                                </span>
                              </div>
                            </td>
                            
                            <td className="px-6 py-4 whitespace-nowrap">
                              {appointment.date
                                ? new Date(
                                    appointment.date
                                  ).toLocaleDateString()
                                : "N/A"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {appointment.time || "N/A"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                ${
                                  appointment.status=== "Approved"
                                    ? "bg-green-100 text-green-800"
                                    : appointment.status === "Rejected"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }`}
                              >
                                {appointment.checkedIn
                                  ? "Checked In"
                                  : appointment.status || "Scheduled"}
                              </span>
                            </td>

                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <div className="flex items-center space-x-3">
                                {/* Removed the View button */}

                                {!appointment.checkedIn &&
                                  appointment.date ===
                                    new Date().toISOString().split("T")[0] && (
                                    <button
                                      className="text-green-600 hover:text-green-900 flex items-center"
                                      onClick={() =>
                                        handleCheckIn(appointment._id)
                                      }
                                    >
                                      <svg
                                        className="w-4 h-4 mr-1"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth="2"
                                          d="M5 13l4 4L19 7"
                                        ></path>
                                      </svg>
                                      Check In
                                    </button>
                                  )}

                                {/* Enhanced phone button */}
                                <button
                                  className="text-blue-600 hover:text-blue-900 flex items-center"
                                  onClick={() => handleCallPatient(appointment)}
                                  title="Call patient"
                                >
                                  <FaPhoneAlt className="mr-1" />
                                  Call
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="py-8 text-center text-gray-500">
                    No recent appointments
                  </div>
                )}

                <div className="mt-4 flex justify-center">
                  <button
                    onClick={() => navigate("/appointment")}
                    className="px-4 py-2 text-sm text-blue-600 hover:text-blue-800"
                  >
                    View All Appointments
                  </button>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default ReceptionistDashboard;
