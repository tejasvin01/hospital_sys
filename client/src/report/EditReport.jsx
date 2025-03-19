import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { 
  FaArrowLeft, 
  FaSave, 
  FaTimesCircle, 
  FaExclamationTriangle,
  FaUserMd,
  FaFileMedical,
  FaUserInjured
} from 'react-icons/fa';

const EditReport = () => {
  const { reportId } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [savingChanges, setSavingChanges] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [formTouched, setFormTouched] = useState(false);
  
  const [report, setReport] = useState({
    diagnosis: '',
    prescription: '',
    notes: ''
  });
  
  const [patientInfo, setPatientInfo] = useState({
    name: '',
    email: '',
    age: '',
    gender: '',
    bloodGroup: '',
    contactNumber: ''
  });

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }

        // Verify user is a doctor
        const decodedToken = jwtDecode(token);
        if (decodedToken.role !== 'doctor') {
          throw new Error('Only doctors can edit medical reports');
        }

        // Fetch the report
        const response = await axios.get(`https://medcarehms.onrender.com/reports/${reportId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        const reportData = response.data;
        
        // Set the report data
        setReport({
          diagnosis: reportData.diagnosis || '',
          prescription: reportData.prescription || '',
          notes: reportData.notes || ''
        });
        
        // If patient data is nested, fetch more details
        if (reportData.patientId && typeof reportData.patientId === 'object') {
          setPatientInfo({
            name: reportData.patientId.name || '',
            email: reportData.patientId.email || '',
            age: reportData.patientId.age || '',
            gender: reportData.patientId.gender || '',
            bloodGroup: reportData.patientId.bloodGroup || '',
            contactNumber: reportData.patientId.contactNumber || ''
          });
        } else if (reportData.patientId) {
          // Fetch patient details if only ID is available
          const patientResponse = await axios.get(`https://medcarehms.onrender.com/users`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          
          const patient = patientResponse.data.find(p => p._id === reportData.patientId);
          setPatientInfo({
            name: patient.name || '',
            email: patient.email || '',
            age: patient.age || '',
            gender: patient.gender || '',
            bloodGroup: patient.bloodGroup || '',
            contactNumber: patient.contactNumber || ''
          });
        }
        
      } catch (error) {
        console.error('Error fetching report', error);
        setError(error.response?.data?.message || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [reportId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReport(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (!formTouched) {
      setFormTouched(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formTouched) {
      return;
    }
    
    try {
      setSavingChanges(true);
      setError('');
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }
      
      // Update the report
      await axios.put(`https://medcarehms.onrender.com/reports/${reportId}`, report, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setSuccessMessage('Report updated successfully');
      setFormTouched(false);
      
      // Show success message for a short time then navigate back
      setTimeout(() => {
        navigate(-1);
      }, 2000);
      
    } catch (error) {
      console.error('Error updating report', error);
      setError(error.response?.data?.message || error.message);
    } finally {
      setSavingChanges(false);
    }
  };

  const handleCancel = () => {
    if (formTouched) {
      if (window.confirm('You have unsaved changes. Are you sure you want to leave?')) {
        navigate(-1);
      }
    } else {
      navigate(-1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            <p className="mt-4 text-gray-600">Loading report data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Fixed Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow mb-6 p-6 ">
          <div className="flex items-center ">
            <button
              type="button"
              onClick={handleCancel}
              className="p-2 mr-4 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
            >
              <FaArrowLeft className="text-white" />
            </button>
            <div className="text-center flex-1">
              <h1 className="text-2xl font-bold">Edit Medical Report</h1>
              <p className="text-sm mt-1 text-blue-100">
                Editing report for patient: {patientInfo.name}
              </p>
            </div>
          </div>
        </div>
        
        {/* Error message */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
            <div className="flex">
              <FaExclamationTriangle className="text-red-500 flex-shrink-0 mt-0.5" />
              <p className="ml-3 text-red-700">{error}</p>
            </div>
          </div>
        )}
        
        {/* Success message */}
        {successMessage && (
          <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-md">
            <div className="flex">
              <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <p className="ml-3 text-green-700">{successMessage}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Patient Information */}
          <div className="md:col-span-1">
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-4 py-5 sm:p-6">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <FaUserInjured className="mr-2 text-blue-500" />
                  Patient Information
                </h2>
                <div className="mt-5 space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Name</p>
                    <p className="mt-1 text-gray-900">{patientInfo.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="mt-1 text-gray-900">{patientInfo.email}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Age</p>
                      <p className="mt-1 text-gray-900">{patientInfo.age || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Gender</p>
                      <p className="mt-1 text-gray-900">{patientInfo.gender || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Blood Group</p>
                      <p className="mt-1 text-gray-900">{patientInfo.bloodGroup || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Contact</p>
                      <p className="mt-1 text-gray-900">{patientInfo.contactNumber || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Report Form */}
          <div className="md:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-4 py-5 sm:p-6">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <FaFileMedical className="mr-2 text-blue-500" />
                  Medical Report Details
                </h2>
                
                <div className="mt-5 space-y-6">
                  <div>
                    <label htmlFor="diagnosis" className="block text-sm font-medium text-gray-700">
                      Diagnosis <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="diagnosis"
                      name="diagnosis"
                      rows="3"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Enter patient diagnosis"
                      value={report.diagnosis}
                      onChange={handleInputChange}
                      required
                    ></textarea>
                  </div>
                  
                  <div>
                    <label htmlFor="prescription" className="block text-sm font-medium text-gray-700">
                      Prescription <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="prescription"
                      name="prescription"
                      rows="3"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Enter prescription details"
                      value={report.prescription}
                      onChange={handleInputChange}
                      required
                    ></textarea>
                  </div>
                  
                  <div>
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                      Notes
                    </label>
                    <textarea
                      id="notes"
                      name="notes"
                      rows="2"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Enter any additional notes"
                      value={report.notes}
                      onChange={handleInputChange}
                    ></textarea>
                  </div>
                 
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-4 sm:px-6 flex justify-end">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="mr-3 inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  disabled={savingChanges}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white ${formTouched ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-400 cursor-not-allowed'}`}
                  disabled={savingChanges || !formTouched}
                >
                  {savingChanges ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditReport;