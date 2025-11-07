import React, { useState } from 'react';
import { Search, Check, X, Eye, ChevronLeft, ChevronRight, Calendar, DollarSign, Clock, CheckCircle, XCircle, FileImage } from 'lucide-react';

export default function PaymentsTab({ 
  payments, 
  loading, 
  searchTerm, 
  setSearchTerm, 
  statusFilter, 
  setStatusFilter, 
  onUpdateStatus,
  pagination,
  stats,
  onPageChange
}) {
  const [viewingScreenshot, setViewingScreenshot] = useState(null);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getMethodColor = (method) => {
    switch(method?.toLowerCase()) {
      case 'neft':
        return 'bg-blue-100 text-blue-800';
      case 'gpay':
        return 'bg-purple-100 text-purple-800';
      case 'razorpay':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Payments</p>
              <p className="text-3xl font-bold mt-2">{stats?.total || 0}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-full">
              <DollarSign className="w-8 h-8" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm font-medium">Pending Payments</p>
              <p className="text-3xl font-bold mt-2">{stats?.pending || 0}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-full">
              <Clock className="w-8 h-8" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Completed Payments</p>
              <p className="text-3xl font-bold mt-2">{stats?.completed || 0}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-full">
              <CheckCircle className="w-8 h-8" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-4 w-full md:w-auto">
          <div className="relative w-full md:w-auto">
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
            className="text-black border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full md:w-auto"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
          </select>
        </div>

        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="w-4 h-4 mr-2" />
          Showing payments by date (newest first)
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-2">Loading payments...</p>
        </div>
      ) : !payments || payments.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <XCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No payments found</p>
          <p className="text-gray-400 text-sm mt-2">
            {statusFilter !== 'all' ? `No ${statusFilter} payments found` : 'No payments have been submitted yet'}
          </p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto shadow-lg rounded-lg">
            <table className="min-w-full border-collapse">
              <thead className="bg-gradient-to-r from-gray-700 to-gray-800 text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider border border-gray-600">
                    Payment ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider border border-gray-600">
                    Student
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider border border-gray-600">
                    Course
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider border border-gray-600">
                    Method
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider border border-gray-600">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider border border-gray-600">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider border border-gray-600">
                    Screenshot
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider border border-gray-600">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider border border-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-blue-50 transition-colors">
                    <td className="px-6 py-4 border border-gray-200">
                      <div className="text-sm font-mono font-semibold text-blue-600">
                        {payment.payment_id}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {payment.course_code}
                      </div>
                    </td>
                    <td className="px-6 py-4 border border-gray-200">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {payment.student_name}
                        </div>
                        <div className="text-sm text-gray-500">{payment.email}</div>
                        <div className="text-xs text-gray-400">{payment.mobile}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 border border-gray-200">
                      <div className="text-sm text-gray-900 font-medium">
                        {payment.course_title}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {payment.training_mode}
                      </div>
                    </td>
                    <td className="px-6 py-4 border border-gray-200">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getMethodColor(payment.payment_method)}`}>
                        {payment.payment_method?.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 border border-gray-200">
                      <div className="text-sm font-bold text-gray-900">₹{payment.amount}</div>
                    </td>
                    <td className="px-6 py-4 border border-gray-200">
                      <div className="text-xs text-gray-600">
                        {formatDate(payment.created_at)}
                      </div>
                      {payment.preferred_start_date && (
                        <div className="text-xs text-blue-600 mt-1">
                          Start: {new Date(payment.preferred_start_date).toLocaleDateString('en-IN')}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 border border-gray-200">
                      {payment.payment_screenshot ? (
                        <button
                          onClick={() => setViewingScreenshot(payment.payment_screenshot)}
                          className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
                          title="View payment screenshot"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </button>
                      ) : (
                        <span className="text-xs text-gray-400 flex items-center">
                          <FileImage className="w-4 h-4 mr-1" />
                          No screenshot
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 border border-gray-200">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(payment.payment_status)}`}>
                        {payment.payment_status?.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 border border-gray-200">
                      {payment.payment_status === 'pending' && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              if (window.confirm(`Mark payment ${payment.payment_id} as completed?`)) {
                                onUpdateStatus(payment.id, 'completed');
                              }
                            }}
                            className="text-green-600 hover:text-green-900 p-2 rounded-lg hover:bg-green-50 transition-colors"
                            title="Mark as Completed"
                          >
                            <Check className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Mark payment ${payment.payment_id} as failed?`)) {
                                onUpdateStatus(payment.id, 'failed');
                              }
                            }}
                            className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50 transition-colors"
                            title="Mark as Failed"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      )}
                      {payment.payment_status === 'completed' && (
                        <span className="text-xs text-green-600 font-medium flex items-center">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Verified
                        </span>
                      )}
                      {payment.payment_status === 'failed' && (
                        <span className="text-xs text-red-600 font-medium flex items-center">
                          <XCircle className="w-4 h-4 mr-1" />
                          Failed
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination && pagination.pages > 1 && (
            <div className="mt-6 flex items-center justify-between bg-white px-6 py-4 rounded-lg shadow">
              <div className="text-sm text-gray-700">
                Showing page <span className="font-semibold">{pagination.page}</span> of{' '}
                <span className="font-semibold">{pagination.pages}</span> ({pagination.total} total payments)
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => onPageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Previous
                </button>
                
                {/* Page numbers */}
                <div className="flex space-x-1">
                  {[...Array(pagination.pages)].map((_, i) => {
                    const pageNum = i + 1;
                    // Show first, last, current, and adjacent pages
                    if (
                      pageNum === 1 ||
                      pageNum === pagination.pages ||
                      (pageNum >= pagination.page - 1 && pageNum <= pagination.page + 1)
                    ) {
                      return (
                        <button
                          key={pageNum}
                          onClick={() => onPageChange(pageNum)}
                          className={`px-3 py-2 rounded-lg text-sm font-medium ${
                            pageNum === pagination.page
                              ? 'bg-blue-600 text-white'
                              : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    } else if (
                      pageNum === pagination.page - 2 ||
                      pageNum === pagination.page + 2
                    ) {
                      return <span key={pageNum} className="px-2 py-2 text-gray-500">...</span>;
                    }
                    return null;
                  })}
                </div>

                <button
                  onClick={() => onPageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.pages}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Screenshot Modal */}
      {viewingScreenshot && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setViewingScreenshot(null)}
        >
          <div 
            className="relative max-w-4xl max-h-[90vh] bg-white rounded-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gray-800 px-4 py-3 flex items-center justify-between">
              <h3 className="text-white font-semibold">Payment Screenshot</h3>
              <button
                onClick={() => setViewingScreenshot(null)}
                className="text-white hover:text-gray-300 p-1"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-4 overflow-auto max-h-[80vh]">
              <img
                src={viewingScreenshot}
                alt="Payment Screenshot"
                className="max-w-full h-auto mx-auto"
                onError={(e) => {
                  e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect width="400" height="300" fill="%23f3f4f6"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%236b7280" font-family="sans-serif"%3EImage not found%3C/text%3E%3C/svg%3E';
                }}
              />
            </div>
            <div className="bg-gray-100 px-4 py-3 flex justify-end">
              <button
                onClick={() => setViewingScreenshot(null)}
                className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// // frontend/src/app/components/admin/CoursePaymentTab.js
// 'use client';
// import React from 'react';
// import { Search, Check, X } from 'lucide-react';

// export default function PaymentsTab({ 
//   payments, 
//   loading, 
//   searchTerm, 
//   setSearchTerm, 
//   statusFilter, 
//   setStatusFilter, 
//   onUpdateStatus 
// }) {
//   return (
//     <div>
//       <div className="flex justify-between items-center mb-6">
//         <div className="flex items-center space-x-4">
//           <div className="relative">
//             <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
//             <input
//               type="text"
//               placeholder="Search payments..."
//               className="text-black pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </div>

//           <select
//             value={statusFilter}
//             onChange={(e) => setStatusFilter(e.target.value)}
//             className="text-black border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//           >
//             <option value="all">All Status</option>
//             <option value="pending">Pending</option>
//             <option value="completed">Completed</option>
//             <option value="failed">Failed</option>
//           </select>
//         </div>
//       </div>

//       {loading ? (
//         <div className="text-center py-8">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
//           <p className="text-gray-600 mt-2">Loading payments...</p>
//         </div>
//       ) : (
//         <div className="overflow-x-auto">
//           <table className="min-w-full border border-gray-400 border-collapse">
//             <thead className="bg-gray-300">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs  border border-gray-400 border-collapse font-medium text-gray-500 uppercase tracking-wider">
//                   Payment ID
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs  border border-gray-400 border-collapse font-medium text-gray-500 uppercase tracking-wider">
//                   Student
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs  border border-gray-400 border-collapse font-medium text-gray-500 uppercase tracking-wider">
//                   Course
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs  border border-gray-400 border-collapse font-medium text-gray-500 uppercase tracking-wider">
//                   Method
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs  border border-gray-400 border-collapse font-medium text-gray-500 uppercase tracking-wider">
//                   Amount
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs  border border-gray-400 border-collapse font-medium text-gray-500 uppercase tracking-wider">
//                   Status
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs  border border-gray-400 border-collapsefont-medium text-gray-500 uppercase tracking-wider">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {payments.map((payment) => (
//                 <tr key={payment.id} className="hover:bg-gray-50 border border-gray-400 border-collapse">
//                   <td className="px-6 py-4 text-sm font-mono text-gray-900 border border-gray-400 border-collapse">
//                     {payment.payment_id}
//                   </td>
//                   <td className=" border border-gray-400 border-collapse">
//                     <div>
//                       <div className="text-sm font-medium text-gray-900">
//                         {payment.student_name}
//                       </div>
//                       <div className="text-sm text-gray-500">{payment.email}</div>
//                     </div>
//                   </td>
//                   <td className=" border border-gray-400 border-collapse text-sm text-gray-900">
//                     {payment.course_title}
//                   </td>
//                   <td className=" border border-gray-400 border-collapse">
//                     <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
//                       {payment.payment_method?.toUpperCase()}
//                     </span>
//                   </td>
//                   <td className=" border border-gray-400 border-collapse text-sm text-gray-900">₹{payment.amount}</td>
//                   <td className=" border border-gray-400 border-collapse">
//                     <span
//                       className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                         payment.payment_status === 'completed'
//                           ? 'bg-green-100 text-green-800'
//                           : payment.payment_status === 'pending'
//                           ? 'bg-yellow-100 text-yellow-800'
//                           : 'bg-red-100 text-red-800'
//                       }`}
//                     >
//                       {payment.payment_status?.toUpperCase()}
//                     </span>
//                   </td>
//                   <td className=" border border-gray-400 border-collapse€ text-sm font-medium">
//                     {payment.payment_status === 'pending' && (
//                       <div className="flex space-x-2">
//                         <button
//                           onClick={() => onUpdateStatus(payment.id, 'completed')}
//                           className="text-green-600 hover:text-green-900"
//                           title="Mark as Completed"
//                         >
//                           <Check className="w-4 h-4" />
//                         </button>
//                         <button
//                           onClick={() => onUpdateStatus(payment.id, 'failed')}
//                           className="text-red-600 hover:text-red-900"
//                           title="Mark as Failed"
//                         >
//                           <X className="w-4 h-4" />
//                         </button>
//                       </div>
//                     )}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// }