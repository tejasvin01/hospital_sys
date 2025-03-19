import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { 
    FaSearch, FaFilter, FaEdit, FaArrowLeft, FaEye, FaEyeSlash, 
    FaCalendarAlt, FaNotesMedical, FaClipboardList, FaStethoscope, 
    FaPrescriptionBottleAlt, FaUser, FaEnvelope, FaPhone, FaCalendarDay 
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const AdminReport = () => {
    const [reports, setReports] = useState([]);
    const [filteredReports, setFilteredReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortField, setSortField] = useState('createdAt');
    const [sortDirection, setSortDirection] = useState('desc');
    const [userRole, setUserRole] = useState('');
    const [filterOpen, setFilterOpen] = useState(false);
    const [filters, setFilters] = useState({
        dateRange: 'all',
        diagnosisType: '',
        doctorId: ''
    });
    const [doctors, setDoctors] = useState([]);
    const navigate = useNavigate();
    
    // State to track which report is expanded
    const [expandedReportId, setExpandedReportId] = useState(null);

    useEffect(() => {
        const fetchReport = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('No token found');
                }

                const decodedToken = jwtDecode(token);
                const { id, role } = decodedToken;
                setUserRole(role); // Save the role for later use

                if (role !== 'admin' && role !== 'doctor' && role !== 'receptionist') {
                    throw new Error('Access denied');
                }

                // Fetch reports
                const response = await axios.get('http://localhost:5000/reports', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setReports(response.data);
                setFilteredReports(response.data);
                
                // Fetch doctors for filter dropdown
                const doctorsResponse = await axios.get('http://localhost:5000/users', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                
                const doctorsList = doctorsResponse.data.filter(user => 
                    user.role?.toLowerCase() === 'doctor'
                );
                setDoctors(doctorsList);
                
                setLoading(false);
            } catch (error) {
                console.error('Error fetching report', error);
                setError('Error fetching report: ' + error.message);
                setLoading(false);
            }
        };

        fetchReport();
    }, []);

    useEffect(() => {
        // Apply filters and search
        let result = [...reports];
        
        // Apply search term
        if (searchTerm) {
            result = result.filter(report => 
                (report.patientId?.name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (report.doctorId?.name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (report.diagnosis?.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }
        
        // Apply date range filter
        if (filters.dateRange !== 'all') {
            const now = new Date();
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            
            switch (filters.dateRange) {
                case 'today':
                    result = result.filter(report => {
                        const reportDate = new Date(report.createdAt);
                        return reportDate >= today;
                    });
                    break;
                case 'thisWeek':
                    const weekStart = new Date(today);
                    weekStart.setDate(today.getDate() - today.getDay());
                    result = result.filter(report => {
                        const reportDate = new Date(report.createdAt);
                        return reportDate >= weekStart;
                    });
                    break;
                case 'thisMonth':
                    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
                    result = result.filter(report => {
                        const reportDate = new Date(report.createdAt);
                        return reportDate >= monthStart;
                    });
                    break;
                default:
                    break;
            }
        }
        
        // Apply diagnosis type filter
        if (filters.diagnosisType) {
            result = result.filter(report => 
                report.diagnosis?.toLowerCase().includes(filters.diagnosisType.toLowerCase())
            );
        }
        
        // Apply doctor filter
        if (filters.doctorId) {
            result = result.filter(report => {
                if (typeof report.doctorId === 'object') {
                    return report.doctorId._id === filters.doctorId;
                }
                return report.doctorId === filters.doctorId;
            });
        }
        
        setFilteredReports(result);
    }, [searchTerm, reports, filters]);

    const handleSort = (field) => {
        const isAsc = sortField === field && sortDirection === 'asc';
        setSortDirection(isAsc ? 'desc' : 'asc');
        setSortField(field);
        
        const sorted = [...filteredReports].sort((a, b) => {
            // Handle nested properties
            if (field.includes('.')) {
                const [parent, child] = field.split('.');
                if (isAsc) {
                    return a[parent][child] > b[parent][child] ? -1 : 1;
                } else {
                    return a[parent][child] < b[parent][child] ? -1 : 1;
                }
            }
            
            // Handle regular properties
            if (isAsc) {
                return a[field] > b[field] ? -1 : 1;
            } else {
                return a[field] < b[field] ? -1 : 1;
            }
        });
        
        setFilteredReports(sorted);
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleString(undefined, options);
    };

    const formatSimpleDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const handleFilterChange = (name, value) => {
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleBack = () => {
        navigate(-1); // Navigate back to the previous page
    };

    const handleEditReport = (reportId) => {
        navigate(`/reports/${reportId}`);
    };

    // Toggle report details visibility
    const toggleReportDetails = (reportId) => {
        if (expandedReportId === reportId) {
            setExpandedReportId(null); // Collapse if already expanded
        } else {
            setExpandedReportId(reportId); // Expand this report
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4 md:p-8">
            <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white relative rounded-t-lg">
                    <button 
                        onClick={handleBack}
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                        title="Go back"
                    >
                        <FaArrowLeft className="text-white" />
                    </button>
                    <div className="ml-8 pl-4">
                        <h1 className="text-3xl font-bold">Patient Reports</h1>
                        <p className="mt-2 text-blue-100">View and manage all patient medical reports</p>
                    </div>
                </div>
                
                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 m-6">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-red-700">{error}</p>
                            </div>
                        </div>
                    </div>
                )}
                
                <div className="p-6">
                    {/* Search and Filter */}
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <div className="flex-1 relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaSearch className="text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search by patient name, doctor or diagnosis..."
                                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        
                        <div className="relative">
                            <button 
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center space-x-2"
                                onClick={() => setFilterOpen(!filterOpen)}
                            >
                                <FaFilter />
                                <span>Filter</span>
                            </button>
                            
                            {filterOpen && (
                                <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-10 p-4">
                                    <h3 className="font-medium text-gray-700 mb-3">Filter Reports</h3>
                                    
                                    <div className="mb-3">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
                                        <select
                                            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            value={filters.dateRange}
                                            onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                                        >
                                            <option value="all">All Time</option>
                                            <option value="today">Today</option>
                                            <option value="thisWeek">This Week</option>
                                            <option value="thisMonth">This Month</option>
                                        </select>
                                    </div>
                                    
                                    <div className="mb-3">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Diagnosis</label>
                                        <input
                                            type="text"
                                            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Filter by diagnosis"
                                            value={filters.diagnosisType}
                                            onChange={(e) => handleFilterChange('diagnosisType', e.target.value)}
                                        />
                                    </div>
                                    
                                    <div className="mb-3">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Doctor</label>
                                        <select
                                            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            value={filters.doctorId}
                                            onChange={(e) => handleFilterChange('doctorId', e.target.value)}
                                        >
                                            <option value="">All Doctors</option>
                                            {doctors.map(doctor => (
                                                <option key={doctor._id} value={doctor._id}>
                                                    {doctor.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    
                                    <div className="flex justify-end">
                                        <button 
                                            className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded-md mr-2"
                                            onClick={() => setFilters({
                                                dateRange: 'all',
                                                diagnosisType: '',
                                                doctorId: ''
                                            })}
                                        >
                                            Reset
                                        </button>
                                        <button 
                                            className="px-3 py-1 text-sm bg-blue-500 text-white hover:bg-blue-600 rounded-md"
                                            onClick={() => setFilterOpen(false)}
                                        >
                                            Apply
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    {/* Reports Table */}
                    <div className="overflow-x-auto rounded-lg border border-gray-200">
                        {loading ? (
                            <div className="py-20 text-center">
                                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
                                <p className="mt-2 text-gray-500">Loading reports...</p>
                            </div>
                        ) : filteredReports.length > 0 ? (
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th 
                                            className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                            onClick={() => handleSort('patientId.name')}
                                        >
                                            Patient Name
                                            {sortField === 'patientId.name' && (
                                                <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                                            )}
                                        </th>
                                        <th 
                                            className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                            onClick={() => handleSort('doctorId.name')}
                                        >
                                            Doctor Name
                                            {sortField === 'doctorId.name' && (
                                                <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                                            )}
                                        </th>
                                        <th 
                                            className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                            onClick={() => handleSort('createdAt')}
                                        >
                                            Created At
                                            {sortField === 'createdAt' && (
                                                <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                                            )}
                                        </th>
                                        <th className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredReports.map((report) => (
                                        <React.Fragment key={report._id}>
                                            {/* Regular row */}
                                            <tr className={`hover:bg-gray-50 transition-colors ${expandedReportId === report._id ? 'bg-blue-50' : ''}`}>
                                                <td className="py-3 px-4 whitespace-nowrap">
                                                    <div className="font-medium text-gray-900">{report.patientId?.name || 'Unknown'}</div>
                                                </td>
                                                <td className="py-3 px-4 whitespace-nowrap">
                                                    <div className="font-medium text-gray-900">{report.doctorId?.name || 'Unknown'}</div>
                                                </td>
                                                <td className="py-3 px-4 whitespace-nowrap text-gray-700">
                                                    {formatSimpleDate(report.createdAt)}
                                                </td>
                                                <td className="py-3 px-4 whitespace-nowrap text-center">
                                                    <div className="flex items-center justify-center space-x-3">
                                                        <button
                                                            onClick={() => toggleReportDetails(report._id)}
                                                            className={`p-2 ${expandedReportId === report._id ? 'bg-blue-200 text-blue-800' : 'bg-blue-100 text-blue-700'} rounded-md hover:bg-blue-200 transition-colors`}
                                                            title={expandedReportId === report._id ? "Hide Details" : "View Details"}
                                                        >
                                                            {expandedReportId === report._id ? <FaEyeSlash /> : <FaEye />}
                                                        </button>
                                                        {userRole === 'doctor' && (
                                                            <button
                                                                onClick={() => handleEditReport(report._id)}
                                                                className="p-2 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 transition-colors"
                                                                title="Edit Report"
                                                            >
                                                                <FaEdit />
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                            
                                            {/* Expanded details row */}
                                            {expandedReportId === report._id && (
                                                <tr>
                                                    <td colSpan="4" className="bg-blue-50 px-4 py-6 border-t border-blue-100">
                                                        <div className="space-y-6">
                                                            {/* Patient and Doctor Information */}
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-blue-200">
                                                                <div className="bg-white p-4 rounded-lg shadow-sm">
                                                                    <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
                                                                        <FaUser className="mr-2 text-blue-600" />
                                                                        Patient Information
                                                                    </h3>
                                                                    <div className="space-y-2">
                                                                        <p className="flex items-center text-gray-700">
                                                                            <span className="font-medium w-20">Name:</span> 
                                                                            {report.patientId?.name || 'Unknown'}
                                                                        </p>
                                                                        <p className="flex items-center text-gray-700">
                                                                            <FaEnvelope className="mr-2 text-gray-500" />
                                                                            <span className="font-medium">Email:</span> 
                                                                            <span className="ml-2">{report.patientId?.email || 'Unknown'}</span>
                                                                        </p>
                                                                        {report.patientId?.contactNumber && (
                                                                            <p className="flex items-center text-gray-700">
                                                                                <FaPhone className="mr-2 text-gray-500" />
                                                                                <span className="font-medium">Contact:</span> 
                                                                                <span className="ml-2">{report.patientId.contactNumber}</span>
                                                                            </p>
                                                                        )}
                                                                        {report.patientId?.age && (
                                                                            <p className="flex items-center text-gray-700">
                                                                                <span className="font-medium w-20">Age:</span> 
                                                                                {report.patientId.age}
                                                                            </p>
                                                                        )}
                                                                        {report.patientId?.gender && (
                                                                            <p className="flex items-center text-gray-700">
                                                                                <span className="font-medium w-20">Gender:</span> 
                                                                                {report.patientId.gender}
                                                                            </p>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                
                                                                <div className="bg-white p-4 rounded-lg shadow-sm">
                                                                    <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
                                                                        <FaUser className="mr-2 text-indigo-600" />
                                                                        Doctor Information
                                                                    </h3>
                                                                    <div className="space-y-2">
                                                                        <p className="flex items-center text-gray-700">
                                                                            <span className="font-medium w-20">Name:</span> 
                                                                            {report.doctorId?.name || 'Unknown'}
                                                                        </p>
                                                                        <p className="flex items-center text-gray-700">
                                                                            <FaEnvelope className="mr-2 text-gray-500" />
                                                                            <span className="font-medium">Email:</span> 
                                                                            <span className="ml-2">{report.doctorId?.email || 'Unknown'}</span>
                                                                        </p>
                                                                        <p className="flex items-center text-gray-700">
                                                                            <FaCalendarDay className="mr-2 text-gray-500" />
                                                                            <span className="font-medium">Report Date:</span> 
                                                                            <span className="ml-2">{formatDate(report.createdAt)}</span>
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            
                                                            {/* Medical Details */}
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                <div className="bg-white p-4 rounded-lg shadow-sm">
                                                                    <div className="flex items-center mb-2 text-blue-700">
                                                                        <FaStethoscope className="mr-2" />
                                                                        <h3 className="text-lg font-semibold">Diagnosis</h3>
                                                                    </div>
                                                                    <p className="text-gray-700 whitespace-pre-line">{report.diagnosis}</p>
                                                                </div>
                                                                
                                                                <div className="bg-white p-4 rounded-lg shadow-sm">
                                                                    <div className="flex items-center mb-2 text-green-700">
                                                                        <FaPrescriptionBottleAlt className="mr-2" />
                                                                        <h3 className="text-lg font-semibold">Prescription</h3>
                                                                    </div>
                                                                    <p className="text-gray-700 whitespace-pre-line">{report.prescription}</p>
                                                                </div>
                                                            </div>
                                                            
                                                            {/* Additional Information */}
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                {report.notes && (
                                                                    <div className="bg-white p-4 rounded-lg shadow-sm">
                                                                        <div className="flex items-center mb-2 text-purple-700">
                                                                            <FaNotesMedical className="mr-2" />
                                                                            <h3 className="text-lg font-semibold">Medical Notes</h3>
                                                                        </div>
                                                                        <p className="text-gray-700 whitespace-pre-line">{report.notes}</p>
                                                                    </div>
                                                                )}
                                                                
                                                                {report.additionalInstructions && (
                                                                    <div className="bg-white p-4 rounded-lg shadow-sm">
                                                                        <div className="flex items-center mb-2 text-indigo-700">
                                                                            <FaClipboardList className="mr-2" />
                                                                            <h3 className="text-lg font-semibold">Additional Instructions</h3>
                                                                        </div>
                                                                        <p className="text-gray-700 whitespace-pre-line">{report.additionalInstructions}</p>
                                                                    </div>
                                                                )}
                                                                
                                                                {report.followUpDate && (
                                                                    <div className="bg-white p-4 rounded-lg shadow-sm">
                                                                        <div className="flex items-center mb-2 text-red-700">
                                                                            <FaCalendarAlt className="mr-2" />
                                                                            <h3 className="text-lg font-semibold">Follow-up Date</h3>
                                                                        </div>
                                                                        <p className="text-gray-700">{new Date(report.followUpDate).toLocaleDateString(undefined, {
                                                                            weekday: 'long',
                                                                            year: 'numeric',
                                                                            month: 'long',
                                                                            day: 'numeric'
                                                                        })}</p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            
                                                            {/* Actions */}
                                                            {userRole === 'doctor' && (
                                                                <div className="flex justify-end mt-4">
                                                                    <button
                                                                        onClick={() => handleEditReport(report._id)}
                                                                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                                                                    >
                                                                        Edit Report
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="py-20 text-center">
                                <p className="text-gray-500">No reports found.</p>
                                <p className="text-gray-400 text-sm mt-1">Try changing your search term or filters.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminReport;