import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Createbill = () => {
  const [patientId, setPatientId] = useState("");
  const [patientName, setPatientName] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const suggestionsRef = useRef(null);
  const navigate = useNavigate();

  // Set default due date (30 days from now)
  useEffect(() => {
    const date = new Date();
    date.setDate(date.getDate() + 30);
    setDueDate(date.toISOString().split("T")[0]);
  }, []);

  // Handle clicks outside the suggestions box
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch patients when component mounts
  useEffect(() => {
    const fetchPatients = async () => {
      setIsLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        setMessage("No token found. Please log in.");
        setMessageType("error");
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.get("http://ec2-3-110-49-41.ap-south-1.compute.amazonaws.com:5000/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Filter users who are patients
        const patientUsers = response.data.filter(
          (user) => user.role === "patient" || !user.role
        );
        setPatients(patientUsers);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching patients:", error);
        setMessage("Could not load patients. Please refresh the page.");
        setMessageType("error");
        setIsLoading(false);
      }
    };

    fetchPatients();
  }, []);

  // Filter patients based on search input
  const handlePatientSearch = (e) => {
    const searchTerm = e.target.value;
    setPatientName(searchTerm);

    if (searchTerm.trim() === "") {
      setFilteredPatients([]);
      setShowSuggestions(false);
      setPatientId("");
      return;
    }

    const filtered = patients.filter(
      (patient) =>
        patient.name &&
        patient.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPatients(filtered);
    setShowSuggestions(true);
  };

  // Select patient from suggestions
  const selectPatient = (patient) => {
    setPatientName(patient.name);
    setPatientId(patient._id);
    setShowSuggestions(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!patientId) {
      setMessage("Please select a valid patient from the suggestions.");
      setMessageType("error");
      return;
    }

    setIsSubmitting(true);

    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("No token found. Please log in.");
      setMessageType("error");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://ec2-3-110-49-41.ap-south-1.compute.amazonaws.com:5000/invoices",
        {
          patientId,
          amount: parseFloat(amount),
          description: description || "Medical services",
          dueDate: dueDate || null,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage("bill created successfully!");
      setMessageType("success");

      // Reset form
      setPatientId("");
      setPatientName("");
      setAmount("");
      setDescription("");

      // Optional: redirect after success
      setTimeout(() => {
        navigate(-1);
      }, 2000);
    } catch (error) {
      console.error("Error creating bill:", error);
      setMessage(error.response?.data?.message || "Error creating bill.");
      setMessageType("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-blue-700 rounded-full transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
              </button>
              <div className="p-3 bg-white rounded-full">
                <div className="text-blue-500 text-2xl">📄</div>
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">
                  Create New Bills
                </h1>
                <p className="mt-1 text-blue-100">
                  Generate a new bill for patient
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Form */}
        <div className="bg-white shadow-sm rounded-lg p-6">
          {message && (
            <div
              className={`mb-6 p-4 rounded-md flex items-start ${
                messageType === "success"
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              <div className="mr-3 mt-0.5">
                {messageType === "success" ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
              <span>{message}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Patient Information Section */}
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-4">
                  Patient Information
                </h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Patient Name<span className="text-red-500">*</span>
                    </label>
                    {isLoading ? (
                      <div className="flex items-center text-gray-500">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Loading patients...
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center border border-gray-300 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
                          <div className="pl-3 py-2 text-gray-500">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                              />
                            </svg>
                          </div>
                          <input
                            type="text"
                            value={patientName}
                            onChange={handlePatientSearch}
                            onFocus={() =>
                              patientName && setShowSuggestions(true)
                            }
                            className="w-full px-3 py-2 outline-none"
                            placeholder="Type to search for patients..."
                            required
                          />
                        </div>

                        {showSuggestions && filteredPatients.length > 0 && (
                          <div
                            ref={suggestionsRef}
                            className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md overflow-auto"
                          >
                            <ul className="py-1">
                              {filteredPatients.map((patient) => (
                                <li
                                  key={patient._id}
                                  onClick={() => selectPatient(patient)}
                                  className="px-4 py-2 hover:bg-blue-50 cursor-pointer flex items-center"
                                >
                                  <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3">
                                    {patient.name.charAt(0).toUpperCase()}
                                  </span>
                                  <div>
                                    <p className="font-medium">
                                      {patient.name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      ID: {patient._id}
                                    </p>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {showSuggestions &&
                          patientName &&
                          filteredPatients.length === 0 && (
                            <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md">
                              <p className="px-4 py-3 text-gray-500 flex items-center">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-5 w-5 mr-2 text-gray-400"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                                No matching patients found
                              </p>
                            </div>
                          )}
                      </>
                    )}

                    {patientId && (
                      <div className="mt-2 text-sm text-green-600 flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        Patient selected: ID {patientId}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* bill Details Section */}
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-4">
                  bill Details
                </h3>
                <div className="bg-gray-50 p-4 rounded-md space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Amount (₹)<span className="text-red-500">*</span>
                      </label>
                      <div className="flex items-center border border-gray-300 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
                        <div className="pl-3 py-2 text-gray-500">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                        <input
                          type="number"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          className="w-full px-3 py-2 outline-none"
                          placeholder="0.00"
                          step="0.01"
                          min="0"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Due Date
                      </label>
                      <div className="flex items-center border border-gray-300 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
                        <div className="pl-3 py-2 text-gray-500">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                        <input
                          type="date"
                          value={dueDate}
                          onChange={(e) => setDueDate(e.target.value)}
                          className="w-full px-3 py-2 outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter details of medical services provided..."
                      rows="3"
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="w-full sm:w-auto px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full sm:w-auto px-6 py-2 bg-blue-600 text-white font-medium rounded-md shadow-sm ${
                    isSubmitting
                      ? "opacity-70 cursor-not-allowed"
                      : "hover:bg-blue-700"
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Creating...
                    </span>
                  ) : (
                    "Create bill"
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Createbill;
