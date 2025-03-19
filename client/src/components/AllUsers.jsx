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
} from "react-icons/fa";

const AllUsers = () => {
  const navigate = useNavigate();
  const handleBack = () => {
    navigate(-1)
  };
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:5000/users", {
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
      </div>
    </div>
  );
};

export default AllUsers;