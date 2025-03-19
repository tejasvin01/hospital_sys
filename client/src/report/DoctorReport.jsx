import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import {
  FaUser,
  FaStethoscope,
  FaPrescriptionBottleAlt,
  FaSpinner,
  FaExclamationTriangle,
  FaCheck,
  FaSearch,
  FaArrowLeft,
  FaNotesMedical,
  FaCalendarAlt,
  FaClipboardList,
} from "react-icons/fa";

const DoctorReport = () => {
  const [patientId, setPatientId] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [prescription, setPrescription] = useState("");
  const [isDoctor, setIsDoctor] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    type: "",
    message: "",
  });
  const [patients, setPatients] = useState([]);
  const Navigate = useNavigate();

  // New state variables for additional fields
  const [notes, setNotes] = useState("");

  // Search states
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const dropdownRef = useRef(null);

  // Handle clicks outside the dropdown to close it
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const token =
          localStorage.getItem("token") || sessionStorage.getItem("token");
        if (token) {
          const decodedToken = jwtDecode(token);
          const { role } = decodedToken;
          setIsDoctor(role === "doctor");

          if (role !== "doctor") {
            setNotification({
              show: true,
              type: "error",
              message: "You must be a doctor to submit medical reports.",
            });
          } else {
            fetchPatients(token);
          }
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
        setNotification({
          show: true,
          type: "error",
          message: "Authentication error. Please log in again.",
        });
      }
    };

    fetchUserRole();
  }, []);

  const fetchPatients = async (token) => {
    try {
      const response = await axios.get(
        "https://medcarehms.onrender.com/users?role=patient",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Filter to only include users with patient role
      const patientUsers = response.data.filter(
        (user) => user.role?.toLowerCase() === "patient"
      );
      setPatients(patientUsers);
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  };

  // Filter patients based on search input
  const filteredPatients = patients.filter(
    (patient) =>
      (patient.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.email?.toLowerCase().includes(searchTerm.toLowerCase())) &&
      patient.role?.toLowerCase() === "patient"
  );

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setShowDropdown(true);
    if (e.target.value === "") {
      setPatientId("");
      setSelectedPatient(null);
    }
  };

  // Handle patient selection from dropdown
  const handlePatientSelect = (patient) => {
    setPatientId(patient._id);
    setSelectedPatient(patient);
    setSearchTerm(patient.name);
    setShowDropdown(false);
  };

  // Calculate minimum date for follow-up (today)
  const getTodayString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isDoctor) {
      setNotification({
        show: true,
        type: "error",
        message: "Only doctors are allowed to submit reports.",
      });
      return;
    }

    if (!patientId || !diagnosis.trim() || !prescription.trim()) {
      setNotification({
        show: true,
        type: "error",
        message: "Patient, diagnosis and prescription are required fields.",
      });
      return;
    }

    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) {
      setNotification({
        show: true,
        type: "error",
        message: "No token found. Please log in.",
      });
      return;
    }

    const report = {
      patientId,
      diagnosis,
      prescription,
      notes: notes.trim() || undefined,
      date: new Date().toISOString(),
    };

    setLoading(true);
    try {
      await axios.post("https://medcarehms.onrender.com/reports", report, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setNotification({
        show: true,
        type: "success",
        message: "Report submitted successfully!",
      });

      // Reset form
      setPatientId("");
      setSearchTerm("");
      setSelectedPatient(null);
      setDiagnosis("");
      setPrescription("");
      setNotes("");

      setTimeout(() => {
        Navigate("/doctor-dashboard");
      }, 2000);
    } catch (error) {
      setNotification({
        show: true,
        type: "error",
        message: error.response?.data?.message || "Error submitting report.",
      });
      console.error("Error submitting report:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8 bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white rounded-lg shadow">
          <div className="flex items-center">
            <button
              onClick={() => Navigate(-1)}
              className="mr-4 p-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-full transition-colors flex items-center"
              title="Go back"
            >
              <FaArrowLeft />
            </button>
            <div>
              <h1 className="text-3xl font-bold">Medical Report</h1>
              <p className="mt-2">
                Create a new medical report for your patient
              </p>
            </div>
          </div>
        </div>

        {/* Notification */}
        {notification.show && (
          <div
            className={`mb-6 p-4 rounded-lg flex items-center ${
              notification.type === "success"
                ? "bg-green-50 text-green-800"
                : "bg-red-50 text-red-800"
            }`}
          >
            {notification.type === "success" ? (
              <FaCheck className="mr-3 text-green-500" />
            ) : (
              <FaExclamationTriangle className="mr-3 text-red-500" />
            )}
            <span>{notification.message}</span>
            <button
              onClick={() => setNotification({ ...notification, show: false })}
              className="ml-auto text-gray-500 hover:text-gray-700"
            >
              &times;
            </button>
          </div>
        )}

        {/* Form Card */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="bg-blue-600 py-4 px-6 text-white">
            <div className="flex items-center">
              <FaStethoscope className="text-2xl mr-3" />
              <h2 className="text-xl font-semibold">Patient Diagnosis</h2>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Patient Search Input */}
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-2"
                htmlFor="patient-search"
              >
                Patient <span className="text-red-500">*</span>
              </label>
              <div className="relative" ref={dropdownRef}>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  id="patient-search"
                  type="text"
                  placeholder="Search patient by name or email"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  onFocus={() => setShowDropdown(true)}
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-4 py-3 sm:text-sm border border-gray-300 rounded-md"
                  disabled={loading || !isDoctor}
                  autoComplete="off"
                />

                {/* Dropdown results */}
                {showDropdown && searchTerm && (
                  <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg max-h-60 overflow-auto">
                    {filteredPatients.length > 0 ? (
                      filteredPatients.map((patient) => (
                        <div
                          key={patient._id}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b last:border-0"
                          onClick={() => handlePatientSelect(patient)}
                        >
                          <div className="flex items-start">
                            <FaUser className="text-gray-400 mt-0.5 mr-2" />
                            <div>
                              <div className="font-medium text-gray-700">
                                {patient.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {patient.email}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-sm text-gray-500">
                        No patients found
                      </div>
                    )}
                  </div>
                )}
              </div>
              {/* Selected patient indicator */}
              {selectedPatient && (
                <div className="mt-2 flex">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    Selected: {selectedPatient.name}
                  </span>
                </div>
              )}
            </div>

            {/* Diagnosis */}
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-2"
                htmlFor="diagnosis"
              >
                Diagnosis <span className="text-red-500">*</span>
              </label>
              <div className="relative rounded-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaStethoscope className="text-gray-400" />
                </div>
                <textarea
                  id="diagnosis"
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-4 py-3 sm:text-sm border border-gray-300 rounded-md"
                  placeholder="Enter detailed diagnosis..."
                  rows="4"
                  disabled={loading || !isDoctor}
                  required
                ></textarea>
              </div>
            </div>

            {/* Prescription */}
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-2"
                htmlFor="prescription"
              >
                Prescription <span className="text-red-500">*</span>
              </label>
              <div className="relative rounded-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaPrescriptionBottleAlt className="text-gray-400" />
                </div>
                <textarea
                  id="prescription"
                  value={prescription}
                  onChange={(e) => setPrescription(e.target.value)}
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-4 py-3 sm:text-sm border border-gray-300 rounded-md"
                  placeholder="Enter prescription details..."
                  rows="4"
                  disabled={loading || !isDoctor}
                  required
                ></textarea>
              </div>
            </div>

            {/* Notes - NEW FIELD */}
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-2"
                htmlFor="notes"
              >
                Medical Notes
              </label>
              <div className="relative rounded-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaNotesMedical className="text-gray-400" />
                </div>
                <textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-4 py-3 sm:text-sm border border-gray-300 rounded-md"
                  placeholder="Enter additional medical notes and observations..."
                  rows="3"
                  disabled={loading || !isDoctor}
                ></textarea>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                                ${
                                  !isDoctor || loading
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                }`}
                disabled={loading || !isDoctor}
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    Processing...
                  </>
                ) : (
                  "Submit Medical Report"
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Additional Information */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>
            Reports are confidential and will be securely stored in our system.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DoctorReport;
