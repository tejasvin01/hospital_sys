import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const PatientInvoice = () => {
    const [invoices, setInvoices] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchInvoices = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('No token found');
                }

                const decodedToken = jwtDecode(token);
                // User ID from token is available if needed
                // const { id } = decodedToken;

                const response = await axios.get(`http://localhost:5000/invoices/my-invoices`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setInvoices(response.data);
            } catch (error) {
                console.error('Error fetching invoices:', error);
                setError('Failed to load your invoices. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchInvoices();
    }, []);
    // Add this function above the return statement
const handleDownloadInvoice = (invoice) => {
    const printWindow = window.open('', '_blank');
    
    const invoiceHTML = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Invoice ${invoice._id}</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
            .invoice-header { text-align: center; color: #003366; margin-bottom: 20px; }
            .invoice-details { margin-bottom: 20px; }
            .invoice-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            .invoice-table th, .invoice-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            .invoice-table th { background-color: #003366; color: white; }
            .invoice-footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; }
            .total-row { font-weight: bold; background-color: #f2f2f2; }
            .status-badge { display: inline-block; padding: 5px 10px; border-radius: 15px; }
            .status-paid { background-color: #e6ffe6; color: #006600; border: 1px solid #b3ffb3; }
            .status-pending { background-color: #fff9e6; color: #996600; border: 1px solid #ffe680; }
            .status-overdue { background-color: #ffe6e6; color: #990000; border: 1px solid #ffb3b3; }
            @media print {
                body { margin: 0; padding: 15px; }
                button { display: none; }
            }
        </style>
    </head>
    <body>
        <div class="invoice-header">
            <h1>Medcare HMS</h1>
            <p>123 Healthcare Avenue, <br/>Chennai, TamilNadu | Phone: 123-456-7890</p>
        </div>
        
        <h2 style="text-align: center;">INVOICE</h2>
        
        <div class="invoice-details">
            <p><strong>Invoice #:</strong> ${invoice._id}</p>
            <p><strong>Date:</strong> ${formatDate(invoice.createdAt)}</p>
            <p><strong>Due Date:</strong> ${invoice.dueDate ? formatDate(invoice.dueDate) : "Not specified"}</p>
            <p><strong>Status:</strong> <span class="status-badge status-${invoice.status.toLowerCase()}">${invoice.status}</span></p>
        </div>
        
        <h3>Bill To:</h3>
        <p>Patient ID: ${invoice.patientId || "Unknown"}</p>
        
        <table class="invoice-table">
            <thead>
                <tr>
                    <th>Description</th>
                    <th>Qty</th>
                    <th>Price</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Consultation</td>
                    <td>1</td>
                    <td>${formatCurrency(invoice.amount * 0.7)}</td>
                    <td>${formatCurrency(invoice.amount * 0.7)}</td>
                </tr>
                <tr>
                    <td>Lab Tests</td>
                    <td>2</td>
                    <td>${formatCurrency(invoice.amount * 0.15)}</td>
                    <td>${formatCurrency(invoice.amount * 0.3)}</td>
                </tr>
            </tbody>
            <tfoot>
                <tr class="total-row">
                    <td colspan="3" style="text-align: right;">Total</td>
                    <td>${formatCurrency(invoice.amount)}</td>
                </tr>
            </tfoot>
        </table>
        
        <div>
            <h3>Payment Instructions:</h3>
            <p>Please make payment by the due date through one of our accepted payment methods.<br/>
            For questions regarding this invoice, please contact our billing department.</p>
        </div>
        
        <div class="invoice-footer">
            <p>This is a computer-generated document. No signature is required.</p>
            <p>Generated on: ${new Date().toLocaleString()}</p>
        </div>
        
        <div style="text-align: center; margin-top: 30px;">
            <button onclick="window.print();" style="padding: 10px 20px; background-color: #003366; color: white; border: none; border-radius: 4px; cursor: pointer;">
                Print Invoice
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
    
    printWindow.document.write(invoiceHTML);
    printWindow.document.close();
};
    const getStatusBadge = (status) => {
        const statusStyles = {
            paid: 'bg-green-100 text-green-800 border border-green-200',
            pending: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
            overdue: 'bg-red-100 text-red-800 border border-red-200',
            default: 'bg-gray-100 text-gray-800 border border-gray-200'
        };
        
        const style = statusStyles[status.toLowerCase()] || statusStyles.default;
        return <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${style}`}>{status}</span>;
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
    };

    const formatDate = (dateString) => {
        // Handle case when date might be in createdAt field
        const date = new Date(dateString);
        
        if (isNaN(date.getTime())) {
            return 'Invalid date';
        }
        
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    };

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const sortedInvoices = [...invoices].sort((a, b) => {
        if (sortConfig.key === 'amount') {
            return sortConfig.direction === 'asc' 
                ? a.amount - b.amount 
                : b.amount - a.amount;
        }
        
        if (sortConfig.key === 'date') {
            return sortConfig.direction === 'asc'
                ? new Date(a.date || a.createdAt) - new Date(b.date || b.createdAt)
                : new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt);
        }

        if (sortConfig.key === 'dueDate') {
            return sortConfig.direction === 'asc'
                ? new Date(a.dueDate || '') - new Date(b.dueDate || '')
                : new Date(b.dueDate || '') - new Date(a.dueDate || '');
        }

        // For string-based columns
        if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
    });

    const filteredInvoices = sortedInvoices.filter(invoice => 
        invoice._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (invoice.description && invoice.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const viewInvoiceDetails = (invoice) => {
        setSelectedInvoice(invoice);
        setShowModal(true);
    };

    const renderSortIcon = (key) => {
        if (sortConfig.key !== key) return null;
        return sortConfig.direction === 'asc' ? '▲' : '▼';
    };

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
                        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-lg p-6 mb-8">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <button 
                                        onClick={() => navigate('/patient-dashboard')} 
                                        className="p-2 hover:bg-blue-700 rounded-full transition-colors"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                        </svg>
                                    </button>
                                    <div className="p-3 bg-white rounded-full">
                                        <div className="text-blue-500 text-2xl">📄</div>
                                    </div>
                                    <div>
                                        <h1 className="text-2xl md:text-3xl font-bold">My Invoices</h1>
                                        <p className="mt-1 text-blue-100">View and manage all your medical bills</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-100 text-red-700 p-4 rounded-lg mb-6 flex items-center">
                    <svg className="w-6 h-6 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    {error}
                </div>
            )}

            {/* Content Area */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                {/* Search Bar */}
                <div className="p-4 border-b border-gray-200">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Search invoices..."
                            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Loading State */}
                {loading ? (
                    <div className="flex flex-col justify-center items-center h-64 bg-gray-50">
                        <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent mb-4"></div>
                        <p className="text-gray-600">Loading your invoices...</p>
                    </div>
                ) : filteredInvoices.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 bg-gray-50 p-8 text-center">
                        <div className="text-6xl mb-4">📋</div>
                        <h3 className="text-xl font-medium text-gray-700 mb-2">No invoices found</h3>
                        <p className="text-gray-500 max-w-md">
                            {searchTerm 
                                ? `No invoices matched your search "${searchTerm}". Try a different search term.` 
                                : "You don't have any invoices yet. They will appear here once you receive them."}
                        </p>
                        {searchTerm && (
                            <button 
                                className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
                                onClick={() => setSearchTerm('')}
                            >
                                Clear search
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th 
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                        onClick={() => handleSort('_id')}
                                    >
                                        <div className="flex items-center">
                                            Invoice # {renderSortIcon('_id')}
                                        </div>
                                    </th>
                                    <th 
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                        onClick={() => handleSort('date')}
                                    >
                                        <div className="flex items-center">
                                            Date {renderSortIcon('date')}
                                        </div>
                                    </th>
                                    <th 
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        <div className="flex items-center">
                                            Description
                                        </div>
                                    </th>
                                    <th 
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                        onClick={() => handleSort('dueDate')}
                                    >
                                        <div className="flex items-center">
                                            Due Date {renderSortIcon('dueDate')}
                                        </div>
                                    </th>
                                    <th 
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                        onClick={() => handleSort('amount')}
                                    >
                                        <div className="flex items-center">
                                            Amount {renderSortIcon('amount')}
                                        </div>
                                    </th>
                                    <th 
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                        onClick={() => handleSort('status')}
                                    >
                                        <div className="flex items-center">
                                            Status {renderSortIcon('status')}
                                        </div>
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredInvoices.map((invoice) => (
                                    <tr key={invoice._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">#{invoice._id.substring(0, 6)}</div>
                                            <div className="text-xs text-gray-500">ID: {invoice._id}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{formatDate(invoice.createdAt)}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900 truncate max-w-xs">
                                                {invoice.description || "Medical services"}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {invoice.dueDate ? formatDate(invoice.dueDate) : "Not specified"}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{formatCurrency(invoice.amount)}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getStatusBadge(invoice.status)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <button 
                                                className="bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors font-medium text-sm flex items-center"
                                                onClick={() => viewInvoiceDetails(invoice)}
                                            >
                                                <span>View Details</span>
                                                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Invoice Detail Modal */}
            {showModal && selectedInvoice && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex justify-between items-center">
                                <h3 className="text-xl font-bold text-gray-900">Invoice #{selectedInvoice._id.substring(0, 6)}</h3>
                                <button 
                                    className="text-gray-400 hover:text-gray-600" 
                                    onClick={() => setShowModal(false)}
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        
                        <div className="p-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500">Invoice Date</h4>
                                    <p className="text-gray-900">{formatDate(selectedInvoice.createdAt)}</p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500">Due Date</h4>
                                    <p className="text-gray-900">
                                        {selectedInvoice.dueDate ? formatDate(selectedInvoice.dueDate) : "Not specified"}
                                    </p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500">Status</h4>
                                    <div className="mt-1">{getStatusBadge(selectedInvoice.status)}</div>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500">Amount</h4>
                                    <p className="text-gray-900 font-semibold">{formatCurrency(selectedInvoice.amount)}</p>
                                </div>
                            </div>

                            <div className="mb-6">
                                <h4 className="text-sm font-medium text-gray-500 mb-1">Description</h4>
                                <p className="text-gray-900 bg-gray-50 p-3 rounded-lg border border-gray-200">
                                    {selectedInvoice.description || "Medical services"}
                                </p>
                            </div>

                            <div className="mb-6">
                                <h4 className="text-sm font-medium text-gray-500 mb-2">Services</h4>
                                <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Description</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Qty</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Price</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {/* Example service items - you'll need to adapt this to your actual data structure */}
                                        <tr>
                                            <td className="px-4 py-2 text-sm">Consultation</td>
                                            <td className="px-4 py-2 text-sm">1</td>
                                            <td className="px-4 py-2 text-sm">{formatCurrency(selectedInvoice.amount * 0.7)}</td>
                                            <td className="px-4 py-2 text-sm">{formatCurrency(selectedInvoice.amount * 0.7)}</td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-2 text-sm">Lab Tests</td>
                                            <td className="px-4 py-2 text-sm">2</td>
                                            <td className="px-4 py-2 text-sm">{formatCurrency(selectedInvoice.amount * 0.15)}</td>
                                            <td className="px-4 py-2 text-sm">{formatCurrency(selectedInvoice.amount * 0.3)}</td>
                                        </tr>
                                    </tbody>
                                    <tfoot className="bg-gray-50">
                                        <tr>
                                            <td colSpan="3" className="px-4 py-2 text-sm font-medium text-right">Total</td>
                                            <td className="px-4 py-2 text-sm font-bold">{formatCurrency(selectedInvoice.amount)}</td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>

                            <div className="border-t border-gray-200 pt-4 flex justify-end mt-6">
                                <button
                                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg mr-2"
                                    onClick={() => setShowModal(false)}
                                >
                                    Close
                                </button>
                                <button
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                                    onClick={() =>  handleDownloadInvoice(selectedInvoice)}
                                >
                                    Download Invoice
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PatientInvoice;