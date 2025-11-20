// frontend/src/app/components/admin/PaymentsTab.js
'use client';
import React, { useState } from 'react';
import { Search, Eye, CheckCircle, XCircle, Clock, Download, ExternalLink } from 'lucide-react';

export default function PaymentsTab({
  payments,
  loading,
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  onUpdateStatus
}) {
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const getStatusBadge = (status) => {
    const badges = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: <Clock className="w-3 h-3" /> },
      completed: { bg: 'bg-green-100', text: 'text-green-800', icon: <CheckCircle className="w-3 h-3" /> },
      failed: { bg: 'bg-red-100', text: 'text-red-800', icon: <XCircle className="w-3 h-3" /> }
    };
    const badge = badges[status] || badges.pending;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
        {badge.icon}
        <span className="ml-1 capitalize">{status}</span>
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    if (!amount) return '₹0';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleViewDetails = (payment) => {
    setSelectedPayment(payment);
    setShowDetailsModal(true);
  };

  const handleStatusUpdate = async (paymentId, newStatus) => {
    if (confirm(`Are you sure you want to mark this payment as ${newStatus}?`)) {
      await onUpdateStatus(paymentId, newStatus);
      setShowDetailsModal(false);
    }
  };

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex items-center space-x-4 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search payments..."
              className="text-black pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full md:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-black px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
          </select>
        </div>

        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <span>Total: {payments?.length || 0} payments</span>
        </div>
      </div>

      {/* Payments Table */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading payments...</p>
        </div>
      ) : !payments || payments.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-lg">No payments found</p>
          <p className="text-gray-400 text-sm mt-2">
            {statusFilter !== 'all' ? 'Try changing the filter' : 'Payments will appear here once students enroll'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-300">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Method
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  PaymentScreenshot
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {payments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{payment.payment_id}</div>
                    <div className="text-xs text-gray-500">{payment.course_code}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{payment.student_name}</div>
                    <div className="text-xs text-gray-500">{payment.email}</div>
                    <div className="text-xs text-gray-500">{payment.mobile}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{payment.course_title}</div>
                    <div className="text-xs text-gray-500">{payment.training_mode}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">
                      {formatCurrency(payment.amount)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900 uppercase">{payment.payment_method}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(payment.payment_status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(payment.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleViewDetails(payment)}
                      className="text-blue-600 hover:text-blue-900 flex items-center"
                      title="View details">
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Payment Details Modal */}
      {showDetailsModal && selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">Payment Details</h3>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-white hover:text-gray-200"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Payment Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Payment ID</label>
                  <p className="text-gray-900 font-mono">{selectedPayment.payment_id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Status</label>
                  <div className="mt-1">{getStatusBadge(selectedPayment.payment_status)}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Amount</label>
                  <p className="text-gray-900 font-semibold">{formatCurrency(selectedPayment.amount)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Payment Method</label>
                  <p className="text-gray-900 uppercase">{selectedPayment.payment_method}</p>
                </div>
              </div>

              {/* Student Info */}
              <div className="border-t pt-4">
                <h4 className="font-semibold text-gray-900 mb-3">Student Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Name</label>
                    <p className="text-gray-900">{selectedPayment.student_name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Email</label>
                    <p className="text-gray-900">{selectedPayment.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Mobile</label>
                    <p className="text-gray-900">{selectedPayment.mobile}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Training Mode</label>
                    <p className="text-gray-900">{selectedPayment.training_mode}</p>
                  </div>
                </div>
              </div>

              {/* Course Info */}
              <div className="border-t pt-4">
                <h4 className="font-semibold text-gray-900 mb-3">Course Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Course Title</label>
                    <p className="text-gray-900">{selectedPayment.course_title}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Course Code</label>
                    <p className="text-gray-900">{selectedPayment.course_code}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Start Date</label>
                    <p className="text-gray-900">{formatDate(selectedPayment.preferred_start_date)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Created At</label>
                    <p className="text-gray-900">{formatDate(selectedPayment.created_at)}</p>
                  </div>
                </div>
              </div>

              {/* Payment Screenshot */}
              {selectedPayment.payment_screenshot && (
                <div className="border-t pt-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Payment Screenshot</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <img
                      src={selectedPayment.payment_screenshot}
                      alt="Payment Screenshot"
                      className="w-full h-auto max-h-96 object-contain rounded border border-gray-200"
                    />
                    <a
                      href={selectedPayment.payment_screenshot}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center text-blue-600 hover:text-blue-800"
                    >
                      <ExternalLink className="w-4 h-4 mr-1" />
                      View Full Size
                    </a>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="border-t pt-4 flex justify-end space-x-3">
                {selectedPayment.payment_status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleStatusUpdate(selectedPayment.id, 'completed')}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Mark as Completed
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(selectedPayment.id, 'failed')}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Mark as Failed
                    </button>
                  </>
                )}
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
// import React, { useState } from 'react';
// import { Search, Check, X, Eye, ChevronLeft, ChevronRight, Calendar, DollarSign, Clock, CheckCircle, XCircle, FileImage } from 'lucide-react';

// export default function PaymentsTab({ 
//   payments, 
//   loading, 
//   searchTerm, 
//   setSearchTerm, 
//   statusFilter, 
//   setStatusFilter, 
//   onUpdateStatus,
//   pagination,
//   stats,
//   onPageChange
// }) {
//   const [viewingScreenshot, setViewingScreenshot] = useState(null);

//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-IN', { 
//       year: 'numeric', 
//       month: 'short', 
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   const getStatusColor = (status) => {
//     switch(status) {
//       case 'completed':
//         return 'bg-green-100 text-green-800';
//       case 'pending':
//         return 'bg-yellow-100 text-yellow-800';
//       case 'failed':
//         return 'bg-red-100 text-red-800';
//       default:
//         return 'bg-gray-100 text-gray-800';
//     }
//   };

//   const getMethodColor = (method) => {
//     switch(method?.toLowerCase()) {
//       case 'neft':
//         return 'bg-blue-100 text-blue-800';
//       case 'gpay':
//         return 'bg-purple-100 text-purple-800';
//       case 'razorpay':
//         return 'bg-indigo-100 text-indigo-800';
//       default:
//         return 'bg-gray-100 text-gray-800';
//     }
//   };

//   return (
//     <div>
//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//         <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white shadow-lg">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-blue-100 text-sm font-medium">Total Payments</p>
//               <p className="text-3xl font-bold mt-2">{stats?.total || 0}</p>
//             </div>
//             <div className="bg-white/20 p-3 rounded-full">
//               <DollarSign className="w-8 h-8" />
//             </div>
//           </div>
//         </div>

//         <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg p-6 text-white shadow-lg">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-yellow-100 text-sm font-medium">Pending Payments</p>
//               <p className="text-3xl font-bold mt-2">{stats?.pending || 0}</p>
//             </div>
//             <div className="bg-white/20 p-3 rounded-full">
//               <Clock className="w-8 h-8" />
//             </div>
//           </div>
//         </div>

//         <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white shadow-lg">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-green-100 text-sm font-medium">Completed Payments</p>
//               <p className="text-3xl font-bold mt-2">{stats?.completed || 0}</p>
//             </div>
//             <div className="bg-white/20 p-3 rounded-full">
//               <CheckCircle className="w-8 h-8" />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Filters */}
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
//         <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-4 w-full md:w-auto">
//           <div className="relative w-full md:w-auto">
//             <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
//             <input
//               type="text"
//               placeholder="Search payments..."
//               className="text-black pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full md:w-64"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </div>

//           <select
//             value={statusFilter}
//             onChange={(e) => setStatusFilter(e.target.value)}
//             className="text-black border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full md:w-auto"
//           >
//             <option value="all">All Status</option>
//             <option value="pending">Pending</option>
//             <option value="completed">Completed</option>
//             <option value="failed">Failed</option>
//           </select>
//         </div>

//         <div className="flex items-center text-sm text-gray-600">
//           <Calendar className="w-4 h-4 mr-2" />
//           Showing payments by date (newest first)
//         </div>
//       </div>

//       {loading ? (
//         <div className="text-center py-8">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
//           <p className="text-gray-600 mt-2">Loading payments...</p>
//         </div>
//       ) : !payments || payments.length === 0 ? (
//         <div className="text-center py-12 bg-gray-50 rounded-lg">
//           <XCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
//           <p className="text-gray-500 text-lg">No payments found</p>
//           <p className="text-gray-400 text-sm mt-2">
//             {statusFilter !== 'all' ? `No ${statusFilter} payments found` : 'No payments have been submitted yet'}
//           </p>
//         </div>
//       ) : (
//         <>
//           <div className="overflow-x-auto shadow-lg rounded-lg">
//             <table className="min-w-full border-collapse">
//               <thead className="bg-gradient-to-r from-gray-700 to-gray-800 text-white">
//                 <tr>
//                   <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider border border-gray-600">
//                     Payment ID
//                   </th>
//                   <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider border border-gray-600">
//                     Student
//                   </th>
//                   <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider border border-gray-600">
//                     Course
//                   </th>
//                   <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider border border-gray-600">
//                     Method
//                   </th>
//                   <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider border border-gray-600">
//                     Amount
//                   </th>
//                   <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider border border-gray-600">
//                     Date
//                   </th>
//                   <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider border border-gray-600">
//                     Screenshot
//                   </th>
//                   <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider border border-gray-600">
//                     Status
//                   </th>
//                   <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider border border-gray-600">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {payments.map((payment) => (
//                   <tr key={payment.id} className="hover:bg-blue-50 transition-colors">
//                     <td className="px-6 py-4 border border-gray-200">
//                       <div className="text-sm font-mono font-semibold text-blue-600">
//                         {payment.payment_id}
//                       </div>
//                       <div className="text-xs text-gray-500 mt-1">
//                         {payment.course_code}
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 border border-gray-200">
//                       <div>
//                         <div className="text-sm font-medium text-gray-900">
//                           {payment.student_name}
//                         </div>
//                         <div className="text-sm text-gray-500">{payment.email}</div>
//                         <div className="text-xs text-gray-400">{payment.mobile}</div>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 border border-gray-200">
//                       <div className="text-sm text-gray-900 font-medium">
//                         {payment.course_title}
//                       </div>
//                       <div className="text-xs text-gray-500 mt-1">
//                         {payment.training_mode}
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 border border-gray-200">
//                       <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getMethodColor(payment.payment_method)}`}>
//                         {payment.payment_method?.toUpperCase()}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 border border-gray-200">
//                       <div className="text-sm font-bold text-gray-900">₹{payment.amount}</div>
//                     </td>
//                     <td className="px-6 py-4 border border-gray-200">
//                       <div className="text-xs text-gray-600">
//                         {formatDate(payment.created_at)}
//                       </div>
//                       {payment.preferred_start_date && (
//                         <div className="text-xs text-blue-600 mt-1">
//                           Start: {new Date(payment.preferred_start_date).toLocaleDateString('en-IN')}
//                         </div>
//                       )}
//                     </td>
//                     <td className="px-6 py-4 border border-gray-200">
//                       {payment.payment_screenshot ? (
//                         <button
//                           onClick={() => setViewingScreenshot(payment.payment_screenshot)}
//                           className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
//                           title="View payment screenshot"
//                         >
//                           <Eye className="w-4 h-4 mr-1" />
//                           View
//                         </button>
//                       ) : (
//                         <span className="text-xs text-gray-400 flex items-center">
//                           <FileImage className="w-4 h-4 mr-1" />
//                           No screenshot
//                         </span>
//                       )}
//                     </td>
//                     <td className="px-6 py-4 border border-gray-200">
//                       <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(payment.payment_status)}`}>
//                         {payment.payment_status?.toUpperCase()}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 border border-gray-200">
//                       {payment.payment_status === 'pending' && (
//                         <div className="flex space-x-2">
//                           <button
//                             onClick={() => {
//                               if (window.confirm(`Mark payment ${payment.payment_id} as completed?`)) {
//                                 onUpdateStatus(payment.id, 'completed');
//                               }
//                             }}
//                             className="text-green-600 hover:text-green-900 p-2 rounded-lg hover:bg-green-50 transition-colors"
//                             title="Mark as Completed"
//                           >
//                             <Check className="w-5 h-5" />
//                           </button>
//                           <button
//                             onClick={() => {
//                               if (window.confirm(`Mark payment ${payment.payment_id} as failed?`)) {
//                                 onUpdateStatus(payment.id, 'failed');
//                               }
//                             }}
//                             className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50 transition-colors"
//                             title="Mark as Failed"
//                           >
//                             <X className="w-5 h-5" />
//                           </button>
//                         </div>
//                       )}
//                       {payment.payment_status === 'completed' && (
//                         <span className="text-xs text-green-600 font-medium flex items-center">
//                           <CheckCircle className="w-4 h-4 mr-1" />
//                           Verified
//                         </span>
//                       )}
//                       {payment.payment_status === 'failed' && (
//                         <span className="text-xs text-red-600 font-medium flex items-center">
//                           <XCircle className="w-4 h-4 mr-1" />
//                           Failed
//                         </span>
//                       )}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {/* Pagination */}
//           {pagination && pagination.pages > 1 && (
//             <div className="mt-6 flex items-center justify-between bg-white px-6 py-4 rounded-lg shadow">
//               <div className="text-sm text-gray-700">
//                 Showing page <span className="font-semibold">{pagination.page}</span> of{' '}
//                 <span className="font-semibold">{pagination.pages}</span> ({pagination.total} total payments)
//               </div>
//               <div className="flex space-x-2">
//                 <button
//                   onClick={() => onPageChange(pagination.page - 1)}
//                   disabled={pagination.page === 1}
//                   className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
//                 >
//                   <ChevronLeft className="w-4 h-4 mr-1" />
//                   Previous
//                 </button>
                
//                 {/* Page numbers */}
//                 <div className="flex space-x-1">
//                   {[...Array(pagination.pages)].map((_, i) => {
//                     const pageNum = i + 1;
//                     // Show first, last, current, and adjacent pages
//                     if (
//                       pageNum === 1 ||
//                       pageNum === pagination.pages ||
//                       (pageNum >= pagination.page - 1 && pageNum <= pagination.page + 1)
//                     ) {
//                       return (
//                         <button
//                           key={pageNum}
//                           onClick={() => onPageChange(pageNum)}
//                           className={`px-3 py-2 rounded-lg text-sm font-medium ${
//                             pageNum === pagination.page
//                               ? 'bg-blue-600 text-white'
//                               : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
//                           }`}
//                         >
//                           {pageNum}
//                         </button>
//                       );
//                     } else if (
//                       pageNum === pagination.page - 2 ||
//                       pageNum === pagination.page + 2
//                     ) {
//                       return <span key={pageNum} className="px-2 py-2 text-gray-500">...</span>;
//                     }
//                     return null;
//                   })}
//                 </div>

//                 <button
//                   onClick={() => onPageChange(pagination.page + 1)}
//                   disabled={pagination.page === pagination.pages}
//                   className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
//                 >
//                   Next
//                   <ChevronRight className="w-4 h-4 ml-1" />
//                 </button>
//               </div>
//             </div>
//           )}
//         </>
//       )}

//       {/* Screenshot Modal */}
//       {viewingScreenshot && (
//         <div 
//           className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
//           onClick={() => setViewingScreenshot(null)}
//         >
//           <div 
//             className="relative max-w-4xl max-h-[90vh] bg-white rounded-lg overflow-hidden"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="bg-gray-800 px-4 py-3 flex items-center justify-between">
//               <h3 className="text-white font-semibold">Payment Screenshot</h3>
//               <button
//                 onClick={() => setViewingScreenshot(null)}
//                 className="text-white hover:text-gray-300 p-1"
//               >
//                 <X className="w-6 h-6" />
//               </button>
//             </div>
//             <div className="p-4 overflow-auto max-h-[80vh]">
//               <img
//                 src={viewingScreenshot}
//                 alt="Payment Screenshot"
//                 className="max-w-full h-auto mx-auto"
//                 onError={(e) => {
//                   e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect width="400" height="300" fill="%23f3f4f6"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%236b7280" font-family="sans-serif"%3EImage not found%3C/text%3E%3C/svg%3E';
//                 }}
//               />
//             </div>
//             <div className="bg-gray-100 px-4 py-3 flex justify-end">
//               <button
//                 onClick={() => setViewingScreenshot(null)}
//                 className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
