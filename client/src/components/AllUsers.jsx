import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaSpinner,
  FaUserCircle,
  FaEnvelope,
  FaUserTag,
  FaFilter,
  FaTimes,
  FaArrowLeft,
  FaEye,
  FaPhoneAlt,
  FaIdCard,
  FaCalendarAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";

const AllUsers = () => {
  const navigate = useNavigate();
  const handleBack = () => {
    navigate(-1);
  };
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  // Add state for selected user and modal visibility
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserDetails, setShowUserDetails] = useState(false);

  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://ec2-3-110-49-41.ap-south-1.compute.amazonaws.com:5000/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setUsers(response.data);
        setFilteredUsers(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("There was an error fetching the users!", error);
        setError("Failed to load users. Please try again later.");
        setLoading(false);
      });
  }, [token]);

  // Updated function to handle viewing user details
  const handleViewUser = (userId) => {
    const user = users.find((user) => user._id === userId);
    setSelectedUser(user);
    setShowUserDetails(true);
  };

  // Close user details modal
  const closeUserDetails = () => {
    setShowUserDetails(false);
    setSelectedUser(null);
  };

  // Extract available roles from users data
  const availableRoles = React.useMemo(() => {
    const roles = [...new Set(users.map((user) => user.role))];
    return roles.filter((role) => role); // Filter out undefined/null
  }, [users]);

  // Handle search and filter functionality
  useEffect(() => {
    let result = users;

    // Apply role filter
    if (roleFilter !== "all") {
      result = result.filter(
        (user) => user.role?.toLowerCase() === roleFilter.toLowerCase()
      );
    }

    // Apply search term
    if (searchTerm.trim() !== "") {
      result = result.filter(
        (user) =>
          user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.role?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredUsers(result);
  }, [searchTerm, users, roleFilter]);

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm("");
    setRoleFilter("all");
    setShowFilters(false);
  };

  // Get user role badge color
  const getRoleBadgeColor = (role) => {
    switch (role?.toLowerCase()) {
      case "receptionist":
        return "bg-purple-100 text-purple-800";
      case "doctor":
        return "bg-blue-100 text-blue-800";
      case "patient":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white relative rounded-lg mb-6 pl-8">
          <button
            onClick={handleBack}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
            title="Go back"
          >
            <FaArrowLeft className="text-white" />
          </button>
          <div className="ml-8">
            <h1 className="text-3xl font-bold">User Management</h1>
            <p className="mt-2 text-lg">Manage all users in the system</p>
          </div>
        </div>
        {/* Search Controls Container */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          {/* Search Bar and Filter Toggle in the same row */}
          <div className="flex items-center gap-4">
            {/* Search Bar - take most of the space */}
            <div className="relative flex-1">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search users by name, email or role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Filter Toggle Button with Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center text-sm bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <FaFilter className="mr-2" />
                {showFilters ? "Hide" : "Filters"}
              </button>

              {/* Filter Panel as Dropdown */}
              {showFilters && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg border border-gray-200 shadow-lg z-10">
                  <div className="p-4">
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Filter by Role
                      </label>
                      <select
                        value={roleFilter}
                        onChange={(e) => {
                          setRoleFilter(e.target.value);
                          setShowFilters(false); // Close dropdown after selection
                        }}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="all">All Roles</option>
                        {availableRoles.map((role) => (
                          <option key={role} value={role}>
                            {role}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Active Filters Tags */}
                    <div className="mt-4 flex flex-wrap gap-2">
                      {roleFilter !== "all" && (
                        <div className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full flex items-center">
                          Role: {roleFilter}
                          <button
                            onClick={() => {
                              setRoleFilter("all");
                              setShowFilters(false); // Close dropdown after clearing
                            }}
                            className="ml-2 text-blue-600 hover:text-blue-800"
                          >
                            <FaTimes />
                          </button>
                        </div>
                      )}
                      {searchTerm && (
                        <div className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full flex items-center">
                          Search: {searchTerm}
                          <button
                            onClick={() => {
                              setSearchTerm("");
                              setShowFilters(false); // Close dropdown after clearing
                            }}
                            className="ml-2 text-blue-600 hover:text-blue-800"
                          >
                            <FaTimes />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Clear Filters Button */}
            {(searchTerm || roleFilter !== "all") && (
              <button
                onClick={() => {
                  resetFilters();
                }}
                className="flex items-center text-sm text-red-600 hover:text-red-800 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors"
              >
                <FaTimes className="mr-2" />
                Clear
              </button>
            )}
          </div>
        </div>
        {/* User List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center p-12">
              <FaSpinner className="text-blue-500 text-4xl animate-spin mb-4" />
              <p className="text-gray-500">Loading users...</p>
            </div>
          ) : error ? (
            <div className="p-6 text-center">
              <p className="text-red-500">{error}</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-gray-500">
                No users found matching your criteria.
              </p>
              <button
                onClick={resetFilters}
                className="mt-2 text-blue-600 hover:text-blue-800"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-4 text-sm font-medium text-gray-500">
                      Name
                    </th>
                    <th className="px-6 py-4 text-sm font-medium text-gray-500">
                      Email
                    </th>
                    <th className="px-6 py-4 text-sm font-medium text-gray-500">
                      Role
                    </th>
                    <th className="px-6 py-4 text-sm font-medium text-gray-500">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FaUserCircle className="text-gray-400 mr-3 text-lg" />
                          <span className="text-gray-800 font-medium">
                            {user.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FaEnvelope className="text-gray-400 mr-2" />
                          <span className="text-gray-600">{user.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FaUserTag className="text-gray-400 mr-2" />
                          <span
                            className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadgeColor(
                              user.role
                            )}`}
                          >
                            {user.role}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleViewUser(user._id)}
                          className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-full transition-colors"
                          title="View user details"
                        >
                          <FaEye />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Statistics */}
          <div className="bg-gray-50 px-6 py-4 border-t">
            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
              <div>Total Users: {users.length}</div>
              <div>Filtered Results: {filteredUsers.length}</div>
              <div>
                Receptionist:{" "}
                {
                  users.filter(
                    (user) => user.role?.toLowerCase() === "receptionist"
                  ).length
                }
              </div>
              <div>
                Doctors:{" "}
                {
                  users.filter((user) => user.role?.toLowerCase() === "doctor")
                    .length
                }
              </div>
              <div>
                Patients:{" "}
                {
                  users.filter((user) => user.role?.toLowerCase() === "patient")
                    .length
                }
              </div>
            </div>
          </div>
        </div>
        {/* Enhanced User Details Modal */}
        {showUserDetails && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-200">
              <div className="p-0">
                {/* Header with gradient background */}
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-t-xl p-5">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-white flex items-center">
                      <FaUserCircle className="mr-3 text-white/80" />
                      User Details
                    </h2>
                    <button
                      onClick={closeUserDetails}
                      className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-full transition-all"
                    >
                      <FaTimes />
                    </button>
                  </div>
                </div>

                {/* User basic info banner */}
                <div className="bg-gray-50 p-4 border-b border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="bg-blue-100 p-3 rounded-full">
                      <FaUserCircle className="text-blue-600 text-3xl" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">
                        {selectedUser.name}
                      </h3>
                      <span
                        className={`mt-1 px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadgeColor(
                          selectedUser.role
                        )}`}
                      >
                        {selectedUser.role}
                      </span>
                    </div>
                  </div>
                </div>

                {/* User details content */}
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* ID field takes full width due to potentially long value */}
                    <div className="col-span-1 md:col-span-2 bg-gray-50 rounded-lg p-4 border border-gray-100 hover:border-blue-200 transition-colors">
                      <div className="flex items-start">
                        <FaIdCard className="text-blue-500 mt-0.5 mr-3 w-5 h-5 flex-shrink-0" />
                        <div className="flex-1">
                          <span className="text-gray-500 text-sm font-medium block mb-1">
                            ID
                          </span>
                          <span className="text-gray-700 break-all font-mono text-sm">
                            {selectedUser._id}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Left column */}
                    <div className="space-y-4">
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 hover:border-blue-200 transition-colors">
                        <div className="flex items-start">
                          <FaUserCircle className="text-blue-500 mt-0.5 mr-3 w-5 h-5 flex-shrink-0" />
                          <div>
                            <span className="text-gray-500 text-sm font-medium block mb-1">
                              Name
                            </span>
                            <span className="text-gray-700">
                              {selectedUser.name}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 hover:border-blue-200 transition-colors">
                        <div className="flex items-start">
                          <FaEnvelope className="text-blue-500 mt-0.5 mr-3 w-5 h-5 flex-shrink-0" />
                          <div>
                            <span className="text-gray-500 text-sm font-medium block mb-1">
                              Email
                            </span>
                            <span className="text-gray-700">
                              {selectedUser.email}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 hover:border-blue-200 transition-colors">
                        <div className="flex items-start">
                          <FaUserTag className="text-blue-500 mt-0.5 mr-3 w-5 h-5 flex-shrink-0" />
                          <div>
                            <span className="text-gray-500 text-sm font-medium block mb-1">
                              Role
                            </span>
                            <span className="text-gray-700">
                              {selectedUser.role}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 hover:border-blue-200 transition-colors">
                        <div className="flex items-start">
                          <FaCalendarAlt className="text-blue-500 mt-0.5 mr-3 w-5 h-5 flex-shrink-0" />
                          <div>
                            <span className="text-gray-500 text-sm font-medium block mb-1">
                              Age
                            </span>
                            <span className="text-gray-700">
                              {selectedUser.age || "Not specified"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right column */}
                    <div className="space-y-4">
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 hover:border-blue-200 transition-colors">
                        <div className="flex items-start">
                          <div className="text-blue-500 mt-0.5 mr-3 w-5 h-5 flex items-center justify-center flex-shrink-0">
                            {selectedUser.gender === "Male"
                              ? "♂"
                              : selectedUser.gender === "Female"
                              ? "♀"
                              : "⚧"}
                          </div>
                          <div>
                            <span className="text-gray-500 text-sm font-medium block mb-1">
                              Gender
                            </span>
                            <span className="text-gray-700">
                              {selectedUser.gender || "Not specified"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 hover:border-blue-200 transition-colors">
                        <div className="flex items-start">
                          <FaPhoneAlt className="text-blue-500 mt-0.5 mr-3 w-5 h-5 flex-shrink-0" />
                          <div>
                            <span className="text-gray-500 text-sm font-medium block mb-1">
                              Contact Number
                            </span>
                            <span className="text-gray-700">
                              {selectedUser.contactNumber || "Not specified"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 hover:border-blue-200 transition-colors">
                        <div className="flex items-start">
                          <span className="text-blue-500 mt-0.5 mr-3 w-5 h-5 flex-shrink-0">
                            🩸
                          </span>
                          <div>
                            <span className="text-gray-500 text-sm font-medium block mb-1">
                              Blood Group
                            </span>
                            <span className="text-gray-700">
                              {selectedUser.bloodGroup || "Not specified"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 hover:border-blue-200 transition-colors">
                        <div className="flex items-start">
                          <FaMapMarkerAlt className="text-blue-500 mt-0.5 mr-3 w-5 h-5 flex-shrink-0" />
                          <div>
                            <span className="text-gray-500 text-sm font-medium block mb-1">
                              Address
                            </span>
                            <span className="text-gray-700">
                              {selectedUser.address || "Not specified"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-6 py-4 rounded-b-xl border-t border-gray-200">
                  <div className="flex justify-end">
                    <button
                      onClick={closeUserDetails}
                      className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center"
                    >
                      <FaTimes className="mr-2" /> Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllUsers;
