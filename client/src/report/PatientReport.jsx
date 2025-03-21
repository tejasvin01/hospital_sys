import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const PatientReport = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedReport, setSelectedReport] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found");
        }

        const decodedToken = jwtDecode(token);
        const { id } = decodedToken;

        // Fetch reports
        const response = await axios.get(
          "http://ec2-3-110-49-41.ap-south-1.compute.amazonaws.com:5000/reports/my-reports",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Fetch all doctors in one request for efficiency
        const doctorsResponse = await axios.get("http://ec2-3-110-49-41.ap-south-1.compute.amazonaws.com:5000/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Create a map of doctor IDs to doctor objects for quick lookup
        const doctorsMap = {};
        doctorsResponse.data.forEach((doctor) => {
          if (doctor.role === "doctor") {
            doctorsMap[doctor._id] = doctor;
          }
        });

        // Process reports with doctor information
        const processedReports = response.data.map((report) => {
          let doctorInfo = null;
          let doctorId = null;

          // Handle doctorId whether it's an object or just an ID string
          if (report.doctorId) {
            // If doctorId is already a populated object with name
            if (typeof report.doctorId === "object" && report.doctorId.name) {
              doctorInfo = report.doctorId;
            } else {
              // If doctorId is a string or ObjectId
              doctorId =
                typeof report.doctorId === "object"
                  ? report.doctorId._id
                  : report.doctorId;
              doctorInfo = doctorsMap[doctorId] || {
                name: "Dr. Unknown",
                specialization: "Specialist",
              };
            }
          } else {
            doctorInfo = { name: "Dr. Unknown", specialization: "Specialist" };
          }

          // Determine report category based on diagnosis
          let category = "General";
          if (report.diagnosis) {
            const diagLower = report.diagnosis.toLowerCase();
            if (diagLower.includes("follow") || diagLower.includes("check")) {
              category = "Checkup";
            } else if (
              diagLower.includes("emergency") ||
              diagLower.includes("urgent")
            ) {
              category = "Emergency";
            } else {
              category = "Consultation";
            }
          }

          return {
            ...report,
            category,
            date: report.createdAt || new Date().toISOString(),
            doctor: doctorInfo,
          };
        });

        setReports(processedReports);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching reports", error);
        setError(
          "Failed to load your medical reports. Please try again later."
        );
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  // Add this function above the return statement
  const handleDownloadReport = (report) => {
    const printWindow = window.open('', '_blank');
    
    const reportHTML = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Medical Report ${report._id}</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
            .report-header { text-align: center; color: #005792; margin-bottom: 20px; }
            .report-details { margin-bottom: 20px; }
            .report-section { margin-bottom: 20px; border-left: 4px solid #005792; padding-left: 15px; }
            .section-title { font-size: 16px; text-transform: uppercase; color: #005792; margin-bottom: 8px; }
            .report-footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; }
            .category-badge { display: inline-block; padding: 5px 10px; border-radius: 15px; }
            .category-consultation { background-color: #e6f2ff; color: #005792; border: 1px solid #b3d7ff; }
            .category-checkup { background-color: #e6ffe6; color: #006600; border: 1px solid #b3ffb3; }
            .category-emergency { background-color: #ffe6e6; color: #990000; border: 1px solid #ffb3b3; }
            .category-general { background-color: #f2e6ff; color: #660099; border: 1px solid #d9b3ff; }
            .meta-info { display: flex; justify-content: space-between; margin-bottom: 20px; }
            .doctor-info { background-color: #f0f7ff; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
            .followup-info { background-color: #e6ffe6; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
            .divider { height: 1px; background-color: #ddd; margin: 20px 0; }
            @media print {
                body { margin: 0; padding: 15px; }
                button { display: none; }
            }
        </style>
    </head>
    <body>
        <div class="report-header">
            <h1>Hospital Management System</h1>
            <p>123 Healthcare Avenue, Medical District<br/>City, State, ZIP | Phone: 123-456-7890</p>
        </div>
        
        <h2 style="text-align: center;">MEDICAL REPORT</h2>
        
        <div class="meta-info">
            <div>
                <p><strong>Report ID:</strong> ${report._id}</p>
                <p><strong>Date:</strong> ${formatDate(report.date)}</p>
            </div>
            <div>
                <p><strong>Category:</strong> <span class="category-badge category-${report.category.toLowerCase()}">${report.category}</span></p>
            </div>
        </div>
        
        <div class="doctor-info">
            <h3>Doctor Information</h3>
            <p><strong>Name:</strong> ${report.doctor?.name || "Unknown"}</p>
            <p><strong>Specialization:</strong> ${report.doctor?.specialization || "Not specified"}</p>
        </div>
        
        <div class="report-section">
            <div class="section-title">Diagnosis</div>
            <p>${report.diagnosis || 'No diagnosis information available'}</p>
        </div>
        
        <div class="report-section">
            <div class="section-title">Prescription</div>
            <p>${report.prescription || 'No prescription information available'}</p>
        </div>
        
        ${report.notes ? `
        <div class="report-section">
            <div class="section-title">Doctor's Notes</div>
            <p>${report.notes}</p>
        </div>
        ` : ''}
        
        ${report.additionalInstructions ? `
        <div class="report-section">
            <div class="section-title">Additional Instructions</div>
            <p>${report.additionalInstructions}</p>
        </div>
        ` : ''}
        
        ${report.followUpDate ? `
        <div class="followup-info">
            <div class="section-title">Follow-up Appointment</div>
            <p><strong>${new Date(report.followUpDate).toLocaleDateString(undefined, {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })}</strong></p>
            <p>Please make sure to schedule this follow-up visit with your doctor.</p>
        </div>
        ` : ''}
        
        <div class="divider"></div>
        
        <div class="report-footer">
            <p>This is a computer-generated document. No signature is required.</p>
            <p>Generated on: ${new Date().toLocaleString()}</p>
        </div>
        
        <div style="text-align: center; margin-top: 30px;">
            <button onclick="window.print();" style="padding: 10px 20px; background-color: #005792; color: white; border: none; border-radius: 4px; cursor: pointer;">
                Print Report
            </button>
        </div>
        
        <script>
            // Auto-trigger print dialog after a small delay
            setTimeout(function() {
                window.print();
            }, 500);
        </script>
    </body>
    </html>
    `;
    
    printWindow.document.write(reportHTML);
    printWindow.document.close();
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleReportClick = (report) => {
    setSelectedReport(report);
  };

  const closeReportDetails = () => {
    setSelectedReport(null);
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  // Filter reports based on search and active tab
  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.diagnosis?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.prescription?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.doctor?.name?.toLowerCase().includes(searchTerm.toLowerCase());

    if (activeTab === "all") return matchesSearch;
    return (
      matchesSearch && report.category.toLowerCase() === activeTab.toLowerCase()
    );
  });

  // Get unique categories for tab filtering
  const categories = [
    "all",
    ...Array.from(new Set(reports.map((report) => report.category))),
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-t-4 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-xl text-gray-700">
            Loading your medical reports...
          </p>
          <p className="mt-2 text-gray-500">This may take a moment</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="bg-blue-600 rounded-xl p-4 mb-6 shadow-md">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-blue-700 rounded-full transition-colors text-white mr-4"
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
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl font-bold text-white sm:text-3xl">
                  Medical Reports
                </h1>
                <p className="mt-2 text-blue-100">
                  View and manage all your health records in one place
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white shadow-md rounded-xl overflow-hidden">
          {/* Search and Filters */}
          <div className="p-5 border-b border-gray-200 bg-gray-50">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0">
              <div className="w-full md:w-1/3">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search reports..."
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                </div>
              </div>
              <div className="flex space-x-1 overflow-x-auto">
                {categories.map((category) => (
                  <button
                    key={category}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      activeTab === category
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    onClick={() => handleTabChange(category)}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 m-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                  <button
                    className="mt-2 text-sm text-red-600 hover:text-red-800 font-medium"
                    onClick={() => window.location.reload()}
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          )}

          {filteredReports.length === 0 ? (
            <div className="py-12 px-4 text-center">
              <svg
                className="h-16 w-16 text-gray-300 mx-auto"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                No Reports Found
              </h3>
              <p className="mt-2 text-gray-500">
                {searchTerm
                  ? `No medical reports match your search '${searchTerm}'`
                  : "You don't have any medical reports yet."}
              </p>
              {searchTerm && (
                <button
                  className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
                  onClick={() => setSearchTerm("")}
                >
                  Clear search
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
              {filteredReports.map((report) => (
                <div
                  key={report._id}
                  onClick={() => handleReportClick(report)}
                  className="border border-gray-200 rounded-lg shadow-sm bg-white hover:shadow-md transition-shadow cursor-pointer overflow-hidden"
                >
                  <div
                    className={`p-1 ${getCategoryColor(report.category)}`}
                  ></div>
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mb-2">
                          {report.category}
                        </span>
                        <h3 className="text-lg font-medium text-gray-900 mb-1 line-clamp-1">
                          {report.diagnosis || "Diagnosis Not Available"}
                        </h3>
                      </div>
                      <span className="text-xs text-gray-500">
                        {formatDate(report.date)}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                      {report.prescription ||
                        "No prescription details available"}
                    </p>

                    <div className="flex items-center mt-2">
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-800 text-xs font-medium">
                          {report.doctor?.name?.substring(0, 2) || "Dr"}
                        </span>
                      </div>
                      <div className="ml-2">
                        <p className="text-xs font-medium text-gray-900">
                          {report.doctor?.name || "Doctor"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {report.doctor?.specialization || "Specialist"}
                        </p>
                      </div>
                    </div>

                    {/* Show follow-up indicator if present */}
                    {report.followUpDate && (
                      <div className="mt-3 flex items-center text-green-600">
                        <svg
                          className="h-3 w-3 mr-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-xs">Follow-up scheduled</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Report Details Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                Medical Report Details
              </h2>
              <button
                onClick={closeReportDetails}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {selectedReport.category}
                  </span>
                  <span className="text-sm text-gray-500">
                    {formatDate(selectedReport.date)}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm uppercase font-medium text-gray-500 mb-2">
                      Diagnosis
                    </h3>
                    <p className="text-gray-900 whitespace-pre-line">
                      {selectedReport.diagnosis ||
                        "No diagnosis information available"}
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm uppercase font-medium text-gray-500 mb-2">
                      Prescription
                    </h3>
                    <p className="text-gray-900 whitespace-pre-line">
                      {selectedReport.prescription ||
                        "No prescription information available"}
                    </p>
                  </div>
                </div>

                {/* Notes Section */}
                {selectedReport.notes && (
                  <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <h3 className="text-sm uppercase font-medium text-gray-500 mb-2">
                      Doctor's Notes
                    </h3>
                    <p className="text-gray-900 whitespace-pre-line">
                      {selectedReport.notes}
                    </p>
                  </div>
                )}

                {/* Additional Instructions Section */}
                {selectedReport.additionalInstructions && (
                  <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <h3 className="text-sm uppercase font-medium text-gray-500 mb-2">
                      Additional Instructions
                    </h3>
                    <p className="text-gray-900 whitespace-pre-line">
                      {selectedReport.additionalInstructions}
                    </p>
                  </div>
                )}

                {/* Follow-up Date Section */}
                {selectedReport.followUpDate && (
                  <div className="bg-green-50 p-4 rounded-lg mb-6">
                    <h3 className="text-sm uppercase font-medium text-gray-500 mb-2">
                      Follow-up Appointment
                    </h3>
                    <p className="text-gray-900 font-medium">
                      {new Date(selectedReport.followUpDate).toLocaleDateString(
                        undefined,
                        {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Please make sure to schedule this follow-up visit
                    </p>
                  </div>
                )}
              </div>

              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-200 flex items-center justify-center">
                    <span className="text-blue-800 font-medium">
                      {selectedReport.doctor?.name?.substring(0, 2) || "Dr"}
                    </span>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-md font-medium text-gray-900">
                      {selectedReport.doctor?.name || "Doctor"}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {selectedReport.doctor?.specialization || "Specialist"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-8">
                <button
                  onClick={closeReportDetails}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
                <button
                  onClick={() => handleDownloadReport(selectedReport)}
                  className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700"
                >
                  Download Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper function to get color based on report category
function getCategoryColor(category) {
  const colors = {
    Consultation: "bg-blue-500",
    Checkup: "bg-green-500",
    Emergency: "bg-red-500",
    General: "bg-purple-500",
  };

  return colors[category] || "bg-gray-500";
}

export default PatientReport;