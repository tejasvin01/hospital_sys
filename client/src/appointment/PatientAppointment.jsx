import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCalendar, FaClock } from 'react-icons/fa';

const PatientAppointment = () => {
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [name, setName] = useState('');
    const [userId, setUserId] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    
    // Add state for users data
    const [users, setUsers] = useState([]);
    
    // Initialize state from localStorage if available
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
    const [showSummary, setShowSummary] = useState(false);

    // Function to fetch users data
    const fetchUsers = async (token) => {
        try {
            const response = await axios.get('http://ec2-3-110-49-41.ap-south-1.compute.amazonaws.com:5000/users', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setUsers(response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching users:', error);
            return [];
        }
    };

    // Function to get patient name from user ID
    const getPatientName = (patientId) => {
        const user = users.find(user => user._id === patientId);
        return user ? user.name : '';
    };

    // Fetch patient data from token and users API on component mount
    useEffect(() => {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                
                // Extract user information from token
                const id = decodedToken.id || decodedToken.userId || '';
                setUserId(id);
                
                // Set a temporary name from token while we fetch from API
                if (decodedToken.name) {
                    setName(decodedToken.name);
                }
                
                // Fetch users data and update name
                const loadUserData = async () => {
                    const usersData = await fetchUsers(token);
                    if (usersData.length > 0 && id) {
                        const user = usersData.find(user => user._id === id);
                        if (user && user.name) {
                            setName(user.name); // Update name from API data
                        }
                    }
                };
                
                loadUserData();
            } catch (error) {
                console.error('Error decoding token:', error);
                setError('Authentication error. Please log in again.');
            }
        } else {
            setError('Please log in to book an appointment');
        }
    }, []);

    const timeSlots = [
        { id: 1, time: '09:00 AM', period: 'Morning', available: true },
        { id: 2, time: '10:00 AM', period: 'Morning', available: true },
        { id: 3, time: '11:00 AM', period: 'Morning', available: true },
        { id: 4, time: '02:00 PM', period: 'Afternoon', available: true },
        { id: 5, time: '03:00 PM', period: 'Afternoon', available: true },
        { id: 6, time: '04:00 PM', period: 'Afternoon', available: true },
        { id: 7, time: '05:00 PM', period: 'Evening', available: true },
        { id: 8, time: '06:00 PM', period: 'Evening', available: true },
    ];

    const generateCalendarDays = () => {
        const today = new Date();
        const days = [];
        for (let i = 0; i < 7; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            days.push(date);
        }
        return days;
    };

    const handleShowSummary = () => {
        if (selectedDate && selectedTimeSlot) {
            setShowSummary(true);
        } else {
            setError('Please select both date and time before proceeding.');
            setTimeout(() => setError(''), 3000);
        }
    };

    const handleBack = () => {
        if (showSummary) {
            setShowSummary(false);
        } else {
            navigate('/patient-dashboard');
        }
    };

    // Booking function with verified patient name from API
    const handleBooking = async () => {
        setLoading(true);
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        
        if (!token) {
            setError('No token found. Please login again.');
            setLoading(false);
            return;
        }

        try {
            // Get userId from state or try to get it from token
            let patientId = userId;
            if (!patientId) {
                const decodedToken = jwtDecode(token);
                patientId = decodedToken.id || decodedToken.userId || '';
                if (!patientId) {
                    setError('Patient ID not found. Please login again.');
                    setLoading(false);
                    return;
                }
            }
            
            // Get patient name from users data if available
            let patientName = name;
            if (users.length > 0 && patientId) {
                const apiName = getPatientName(patientId);
                if (apiName) {
                    patientName = apiName; // Use name from API if available
                }
            }
            
            // Format date from the selected date
            const formattedDate = selectedDate ? selectedDate.toISOString().split('T')[0] : '';
            
            // Complete appointment data with all required fields
            const appointmentData = {
                patientId: patientId,
                patientName: patientName,
                date: formattedDate,
                time: selectedTimeSlot?.time,
                department: "General Medicine", // Default department
                status: "Pending"
            };
            
            // Check if all required fields are present
            const requiredFields = ['patientId', 'date', 'time'];
            const missingFields = requiredFields.filter(field => !appointmentData[field]);
            
            if (missingFields.length > 0) {
                setError(`Missing required fields: ${missingFields.join(', ')}`);
                setLoading(false);
                return;
            }
            
            const response = await axios.post('http://ec2-3-110-49-41.ap-south-1.compute.amazonaws.com:5000/appointments', appointmentData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            setError('');
            setSuccess('Appointment booked successfully!');
            
            // Reset form after successful booking
            setTimeout(() => {
                setSelectedDate(null);
                setSelectedTimeSlot(null);
                setShowSummary(false);
                navigate('/patient-dashboard');
            }, 1500);
        } catch (error) {
            console.error("Error booking appointment:", error);
            setError(error.response?.data?.message || 'Error booking appointment. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Rest of the component remains the same */}
            <div className="max-w-[1440px] mx-auto px-4 sm:px-8 py-6">
                {/* Unified Header */}
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white rounded-lg shadow-md mb-6 relative">
                    <button 
                        onClick={handleBack}
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                        title={showSummary ? "Back to appointment selection" : "Go back to dashboard"}
                    >
                        <FaArrowLeft className="text-white" />
                    </button>
                    <div className="ml-8">
                        <h1 className="text-3xl font-bold">
                            {showSummary ? "Appointment Summary" : "Book an Appointment"}
                        </h1>
                        <p className="mt-2 text-blue-100">
                            {showSummary ? "Review your appointment details" : "Choose your preferred date and time"}
                        </p>
                    </div>
                </div>

                {/* Alert Messages */}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex justify-between items-center">
                        <p>{error}</p>
                        <button onClick={() => setError('')} className="text-red-700 font-bold">×</button>
                    </div>
                )}
                
                {success && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 flex justify-between items-center">
                        <p>{success}</p>
                        <button onClick={() => setSuccess('')} className="text-green-700 font-bold">×</button>
                    </div>
                )}
                
                {/* Welcome message with patient name */}
                {name && !success && (
                    <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded mb-6">
                        <p>Welcome, {name}! Please select your appointment date and time.</p>
                        
                    </div>
                )}

                {/* Main Content */}
                {showSummary ? (
                    <div className="bg-white p-8 rounded-xl border border-gray-200 mb-8 shadow-sm">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Appointment Details</h2>
                        <div className="space-y-6">
                            <div className="flex items-center">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                                    <FaCalendar className="text-blue-600 text-xl" />
                                </div>
                                <div>
                                    <p className="text-gray-600 text-sm">Date</p>
                                    <p className="font-semibold text-lg">
                                        {selectedDate?.toLocaleDateString('en-US', { 
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex items-center">
                                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                                    <FaClock className="text-purple-600 text-xl" />
                                </div>
                                <div>
                                    <p className="text-gray-600 text-sm">Time</p>
                                    <p className="font-semibold text-lg">
                                        {selectedTimeSlot?.time} <span className="text-gray-500">({selectedTimeSlot?.period})</span>
                                    </p>
                                </div>
                            </div>
                            
                            <div className="border-t pt-6 mt-6">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Consultation Fee</span>
                                    <span className="font-semibold text-lg">₹150</span>
                                </div>
                                <p className="text-gray-500 text-sm mt-1">
                                    Payment will be collected at the hospital
                                </p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {/* Date Selection */}
                        <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                                <FaCalendar className="text-blue-600 mr-2" /> Select Date
                            </h2>
                            <div className="flex gap-3 overflow-x-auto pb-4">
                                {generateCalendarDays().map((date) => (
                                    <div
                                        key={date.toISOString()}
                                        onClick={() => setSelectedDate(date)}
                                        className={`flex-shrink-0 flex flex-col items-center p-4 rounded-lg cursor-pointer transition-all ${
                                            selectedDate?.toDateString() === date.toDateString()
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-white border border-gray-200 hover:border-blue-400'
                                        }`}
                                    >
                                        <span className="text-sm">{date.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                                        <span className="text-2xl font-semibold my-1">{date.getDate()}</span>
                                        <span className="text-sm">{date.toLocaleDateString('en-US', { month: 'short' })}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Time Slots */}
                        <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                                <FaClock className="text-blue-600 mr-2" /> Select Time
                            </h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {timeSlots.map((slot) => (
                                    <button
                                        key={slot.id}
                                        onClick={() => slot.available && setSelectedTimeSlot(slot)}
                                        disabled={!slot.available}
                                        className={`p-4 rounded-lg text-center transition-all ${
                                            !slot.available 
                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                                : selectedTimeSlot?.id === slot.id
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-white border border-gray-200 hover:border-blue-400'
                                        }`}
                                    >
                                        <div className="text-lg font-semibold">{slot.time}</div>
                                        <div className="text-sm">{slot.period}</div>
                                    </button>
                                ))}
                            </div>
                        </section>
                    </div>
                )}

                {/* Bottom Action Bar */}
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-md">
                    <div className="max-w-[1440px] mx-auto flex justify-between items-center">
                        <div className="text-gray-600">
                            <span className="font-semibold text-xl">₹150</span>
                            <span className="ml-2">Consultation Fee</span>
                        </div>
                        {showSummary ? (
                            <button
                                onClick={handleBooking}
                                disabled={loading}
                                className="px-8 py-3 rounded-lg font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center"
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Processing...
                                    </>
                                ) : "Confirm Booking"}
                            </button>
                        ) : (
                            <button
                                onClick={handleShowSummary}
                                disabled={!selectedDate || !selectedTimeSlot}
                                className={`px-8 py-3 rounded-lg font-semibold transition-all ${
                                    selectedDate && selectedTimeSlot
                                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                }`}
                            >
                                Continue to Summary
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientAppointment;