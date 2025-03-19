import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaCheck,
  FaTimes,
  FaSearch,
  FaFilter,
  FaSync,
  FaArrowLeft,
  FaPhoneAlt,
  FaUser,
  FaVenusMars,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const AdminAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const navigate = useNavigate();

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get("https://medcarehms.onrender.com/appointments", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAppointments(response.data);
      setFilteredAppointments(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  useEffect(() => {
    try {
      // Filter appointments based on search term and status filter
      let filtered = [...appointments];

      if (statusFilter !== "All") {
        filtered = filtered.filter(
          (appointment) => appointment.status === statusFilter
        );
      }

      if (searchTerm) {
        const searchTermLower = searchTerm.toLowerCase().trim();
        filtered = filtered.filter((appointment) => {
          // Check if patientName exists before trying to use it
          const patientNameMatch = 
            appointment.patientName && 
            typeof appointment.patientName === 'string' && 
            appointment.patientName.toLowerCase().includes(searchTermLower);
          
          // Check if patientId is an object with a name before trying to use it
          const patientIdMatch = 
            appointment.patientId && 
            typeof appointment.patientId === 'object' && 
            appointment.patientId.name && 
            appointment.patientId.name.toLowerCase().includes(searchTermLower);
          
          return patientNameMatch || patientIdMatch;
        });
      }

      setFilteredAppointments(filtered);
    } catch (error) {
      console.error("Error filtering appointments:", error);
      // If filtering fails, just show all appointments
      setFilteredAppointments(appointments);
    }
  }, [searchTerm, statusFilter, appointments]);

  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `https://medcarehms.onrender.com/appointments/${id}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update local state
      setAppointments(
        appointments.map((appointment) =>
          appointment._id === id ? { ...appointment, status } : appointment
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchAppointments();
    setTimeout(() => setIsRefreshing(false), 500); // Visual feedback
  };

  const handleBack = () => {
    navigate(-1); // Navigate back to the previous page
  };

  // ADD THIS MISSING FUNCTION - Function to handle calling a patient
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
      // If no contact found, show alert
      const patientName = appointment.patientName || 
        (appointment.patientId && typeof appointment.patientId === "object" 
          ? appointment.patientId.name 
          : "Unknown Patient");
            
      alert(`No contact information available for ${patientName}. Please update patient records.`);
    }
  };

  // Function to handle calling a patient
  const renderCallButton = (appointment) => {
    return (
      <button
        onClick={() => handleCallPatient(appointment)}
        className="p-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
        title="Call Patient"
      >
        <FaPhoneAlt />
      </button>
    );
  };
  
  // Function to render action buttons based on appointment status
  const renderActionButtons = (appointment) => {
    switch (appointment.status) {
      case "Pending":
        return (
          <div className="flex space-x-2">
            <button
              onClick={() => updateStatus(appointment._id, "Approved")}
              className="p-2 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors"
              title="Approve Appointment"
            >
              <FaCheck />
            </button>
            <button
              onClick={() => updateStatus(appointment._id, "Rejected")}
              className="p-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
              title="Reject Appointment"
            >
              <FaTimes />
            </button>
          </div>
        );
      case "Approved":
        return (
          <span className="text-gray-400 italic text-sm">
            Completed
          </span>
        );
      case "Rejected":
        return (
          <span className="text-gray-400 italic text-sm">
            Completed
          </span>
        );
      default:
        return (
          <div className="flex space-x-2">
            <button
              onClick={() => updateStatus(appointment._id, "Approved")}
              className="p-2 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors"
              title="Approve Appointment"
            >
              <FaCheck />
            </button>
            <button
              onClick={() => updateStatus(appointment._id, "Rejected")}
              className="p-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
              title="Reject Appointment"
            >
              <FaTimes />
            </button>
          </div>
        );
    }
  };

  // Function to get patient age if available
  const getPatientAge = (appointment) => {
    if (
      appointment.patientId &&
      typeof appointment.patientId === "object" &&
      appointment.patientId.age
    ) {
      return appointment.patientId.age;
    }
    return "N/A";
  };

  // Function to get patient gender if available
  const getPatientGender = (appointment) => {
    if (
      appointment.patientId &&
      typeof appointment.patientId === "object" &&
      appointment.patientId.gender
    ) {
      return appointment.patientId.gender;
    }
    return "N/A";
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white relative pl-8">
          <button
            onClick={handleBack}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
            title="Go back"
          >
            <FaArrowLeft className="text-white" />
          </button>
          <div className="ml-8">
            <h1 className="text-3xl font-bold">Appointments Management</h1>
            <p className="mt-2 text-blue-100">
              Manage all patient appointments
            </p>
          </div>
        </div>

        <div className="p-6">
          {/* Filters and Search */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by patient name..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex items-center space-x-2 w-full md:w-auto">
              <div className="relative flex items-center">
                <FaFilter className="absolute left-3 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                >
                  <option value="All">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <button
                onClick={handleRefresh}
                className={`p-2 rounded-lg text-white bg-blue-500 hover:bg-blue-600 transition ${
                  isRefreshing ? "animate-spin" : ""
                }`}
                disabled={isRefreshing}
              >
                <FaSync />
              </button>
            </div>
          </div>

          {/* Appointments Table */}
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            {loading ? (
              <div className="py-20 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
                <p className="mt-2 text-gray-500">Loading appointments...</p>
              </div>
            ) : filteredAppointments.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Patient Name
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center">
                        <FaUser className="mr-1" /> Age
                      </div>
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center">
                        <FaVenusMars className="mr-1" /> Gender
                      </div>
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                    {/* Column for call button */}
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center">
                        <FaPhoneAlt className="mr-1" /> Call
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAppointments.map((appointment) => (
                    <tr
                      key={appointment._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">
                          {appointment.patientName ||
                            (appointment.patientId &&
                            typeof appointment.patientId === "object"
                              ? appointment.patientId.name
                              : "Unknown Patient")}
                        </div>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-gray-700">
                        {getPatientAge(appointment)}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-gray-700">
                        {getPatientGender(appointment)}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-gray-700">
                        {new Date(appointment.date).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-gray-700">
                        {appointment.time}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            appointment.status === "Approved"
                              ? "bg-green-100 text-green-800"
                              : appointment.status === "Rejected"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {appointment.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-sm font-medium">
                        {renderActionButtons(appointment)}
                      </td>
                      {/* Cell for call button */}
                      <td className="py-3 px-4 whitespace-nowrap text-sm font-medium text-center">
                        {renderCallButton(appointment)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="py-20 text-center">
                <p className="text-gray-500">No appointments found.</p>
                <p className="text-gray-400 text-sm mt-1">
                  Try changing your filters or search term.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAppointment;