import React, { useState } from 'react';
import { Search, Check, X, Users, Calendar, Clock, Image as ImageIcon } from 'lucide-react';

export default function ProjectPaymentTab({ 
  projectPayments = [],
  loading = false, 
  searchTerm = '', 
  setSearchTerm = () => {}, 
  statusFilter = 'all', 
  setStatusFilter = () => {}, 
  onUpdateStatus = () => {}
}) {
  const [selectedScreenshot, setSelectedScreenshot] = useState(null);
  const enrollments = Array.isArray(projectPayments) ? projectPayments : [];

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-IN', { 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric' 
      });
    } catch (e) {
      return 'Invalid date';
    }
  };

  const getTeamSizeDisplay = (teamSize) => {
    if (!teamSize) return 'Not specified';
    if (teamSize === '5+') return '5+ members';
    if (teamSize === '1') return 'Individual';
    return `Team of ${teamSize}`;
  };

  const getStatusBadgeClass = (status) => {
    switch(status?.toLowerCase()) {
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

  const ScreenshotModal = () => {
    if (!selectedScreenshot) return null;
    
    return (
      <div 
        className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
        onClick={() => setSelectedScreenshot(null)}
      >
        <div className="relative max-w-4xl max-h-[90vh]">
          <button
            onClick={() => setSelectedScreenshot(null)}
            className="absolute -top-10 right-0 text-white hover:text-gray-300 text-2xl font-bold"
          >
            ✕
          </button>
          <img
            src={selectedScreenshot}
            alt="Payment Screenshot"
            className="max-w-full max-h-[90vh] object-contain rounded-lg"
          />
        </div>
      </div>
    );
  };

  return (
    <div>
      {/* Screenshot Modal */}
      <ScreenshotModal />

      {/* Search and Filter Controls */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto">
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search enrollments..."
              className="text-black pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-black border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-auto"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
          </select>
        </div>

        {/* Summary Stats */}
        <div className="flex flex-wrap gap-3 text-sm">
          <div className="bg-blue-50 px-4 py-2 rounded-lg">
            <span className="text-blue-600 font-semibold">Total: </span>
            <span className="text-blue-800">{enrollments.length}</span>
          </div>
          <div className="bg-green-50 px-4 py-2 rounded-lg">
            <span className="text-green-600 font-semibold">Completed: </span>
            <span className="text-green-800">
              {enrollments.filter(e => e.payment_status === 'completed').length}
            </span>
          </div>
          <div className="bg-yellow-50 px-4 py-2 rounded-lg">
            <span className="text-yellow-600 font-semibold">Pending: </span>
            <span className="text-yellow-800">
              {enrollments.filter(e => e.payment_status === 'pending').length}
            </span>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading enrollments...</p>
        </div>
      ) : enrollments.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <div className="mb-4">
            <Users className="w-16 h-16 text-gray-300 mx-auto" />
          </div>
          <p className="text-gray-500 text-lg font-medium">No enrollments found</p>
          <p className="text-gray-400 text-sm mt-2">
            {searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your filters' 
              : 'Enrollments will appear here once students register'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="min-w-full border border-gray-300">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-300">
                  Enrollment ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-300">
                  Student Details
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-300">
                  Project
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-300">
                  Team Info
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-300">
                  Schedule
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-300">
                  Payment
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-300">
                  Screenshot
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-300">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {enrollments.map((enrollment) => (
                <tr key={enrollment.id} className="hover:bg-blue-50 transition-colors">
                  {/* Enrollment ID */}
                  <td className="px-4 py-4 border-r border-gray-200">
                    <div className="text-sm font-mono font-semibold text-gray-900">
                      {enrollment.enrollment_id || 'N/A'}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {formatDate(enrollment.created_at)}
                    </div>
                  </td>

                  {/* Student Details */}
                  <td className="px-4 py-4 border-r border-gray-200">
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-gray-900">
                        {enrollment.student_name || 'N/A'}
                      </div>
                      <div className="text-xs text-gray-600">
                        📧 {enrollment.email || 'N/A'}
                      </div>
                      <div className="text-xs text-gray-600">
                        📱 {enrollment.mobile || 'N/A'}
                      </div>
                      {enrollment.district && enrollment.district !== 'Same' && (
                        <div className="text-xs text-gray-500 mt-1">
                          📍 {enrollment.district}
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Project */}
                  <td className="px-4 py-4 border-r border-gray-200">
                    <div className="text-sm font-medium text-gray-900">
                      {enrollment.project_title || 'N/A'}
                    </div>
                    <div className="text-xs text-gray-500 mt-1 font-mono">
                      {enrollment.project_code || 'N/A'}
                    </div>
                  </td>

                  {/* Team Info */}
                  <td className="px-4 py-4 border-r border-gray-200">
                    <div className="flex items-center text-sm text-gray-700">
                      <Users className="w-4 h-4 mr-2 text-blue-500 flex-shrink-0" />
                      <span>{getTeamSizeDisplay(enrollment.team_size)}</span>
                    </div>
                  </td>

                  {/* Schedule */}
                  <td className="px-4 py-4 border-r border-gray-200">
                    <div className="space-y-2">
                      {enrollment.preferred_start_date && (
                        <div className="flex items-center text-xs text-gray-600">
                          <Calendar className="w-3 h-3 mr-1 text-green-500 flex-shrink-0" />
                          {formatDate(enrollment.preferred_start_date)}
                        </div>
                      )}
                      {enrollment.preferred_time && (
                        <div className="flex items-center text-xs text-gray-600">
                          <Clock className="w-3 h-3 mr-1 text-orange-500 flex-shrink-0" />
                          {enrollment.preferred_time}
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Payment */}
                  <td className="px-4 py-4 border-r border-gray-200">
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-gray-900">
                        ₹{enrollment.amount || 'N/A'}
                      </div>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                        {enrollment.payment_method?.toUpperCase() || 'N/A'}
                      </span>
                    </div>
                  </td>

                  {/* Screenshot */}
                  <td className="px-4 py-4 border-r border-gray-200">
                    {enrollment.payment_screenshot ? (
                      <button
                        onClick={() => setSelectedScreenshot(enrollment.payment_screenshot)}
                        className="relative group"
                        title="Click to view full size"
                      >
                        <img
                          src={enrollment.payment_screenshot}
                          alt="Payment proof"
                          className="w-16 h-16 object-cover rounded border-2 border-gray-200 hover:border-blue-500 transition-colors cursor-pointer"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 rounded transition-opacity flex items-center justify-center">
                          <ImageIcon className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </button>
                    ) : (
                      <div className="flex items-center justify-center w-16 h-16 bg-gray-100 rounded border-2 border-dashed border-gray-300">
                        <ImageIcon className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                  </td>

                  {/* Status */}
                  <td className="px-4 py-4 border-r border-gray-200">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeClass(enrollment.payment_status)}`}>
                      {enrollment.payment_status?.toUpperCase() || 'PENDING'}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-4">
                    {enrollment.payment_status === 'pending' && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => onUpdateStatus(enrollment.id, 'completed')}
                          className="text-green-600 hover:text-green-900 p-2 hover:bg-green-50 rounded-lg transition-colors"
                          title="Mark as Completed"
                        >
                          <Check className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => onUpdateStatus(enrollment.id, 'failed')}
                          className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-lg transition-colors"
                          title="Mark as Failed"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                    {enrollment.payment_status === 'completed' && (
                      <div className="flex items-center text-green-600 text-xs font-medium">
                        <Check className="w-4 h-4 mr-1" />
                        Verified
                      </div>
                    )}
                    {enrollment.payment_status === 'failed' && (
                      <button
                        onClick={() => onUpdateStatus(enrollment.id, 'pending')}
                        className="text-blue-600 hover:text-blue-900 text-xs font-medium hover:underline"
                      >
                        Retry
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// import React from 'react';
// import { Search, Check, X, Users, Calendar, Clock } from 'lucide-react';

// export default function ProjectPaymentTab({ 
//   projectPayments = [],  // Added default empty array
//   loading = false, 
//   searchTerm = '', 
//   setSearchTerm = () => {}, 
//   statusFilter = 'all', 
//   setStatusFilter = () => {}, 
//   onUpdateStatus = () => {}
// }) {
//   // Safety check
//   const enrollments = Array.isArray(projectPayments) ? projectPayments : [];

//   const formatDate = (dateString) => {
//     if (!dateString) return 'Not specified';
//     try {
//       const date = new Date(dateString);
//       return date.toLocaleDateString('en-IN', { 
//         day: '2-digit', 
//         month: 'short', 
//         year: 'numeric' 
//       });
//     } catch (e) {
//       return 'Invalid date';
//     }
//   };

//   const getTeamSizeDisplay = (teamSize) => {
//     if (!teamSize) return 'Not specified';
//     if (teamSize === '5+') return '5+ members';
//     if (teamSize === '1') return 'Individual';
//     return `Team of ${teamSize}`;
//   };

//   const getStatusBadgeClass = (status) => {
//     switch(status?.toLowerCase()) {
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

//   return (
//     <div>
//       {/* Search and Filter Controls */}
//       <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
//         <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto">
//           <div className="relative w-full sm:w-auto">
//             <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
//             <input
//               type="text"
//               placeholder="Search enrollments..."
//               className="text-black pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </div>

//           <select
//             value={statusFilter}
//             onChange={(e) => setStatusFilter(e.target.value)}
//             className="text-black border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-auto"
//           >
//             <option value="all">All Status</option>
//             <option value="pending">Pending</option>
//             <option value="completed">Completed</option>
//             <option value="failed">Failed</option>
//           </select>
//         </div>

//         {/* Summary Stats */}
//         <div className="flex flex-wrap gap-3 text-sm">
//           <div className="bg-blue-50 px-4 py-2 rounded-lg">
//             <span className="text-blue-600 font-semibold">Total: </span>
//             <span className="text-blue-800">{enrollments.length}</span>
//           </div>
//           <div className="bg-green-50 px-4 py-2 rounded-lg">
//             <span className="text-green-600 font-semibold">Completed: </span>
//             <span className="text-green-800">
//               {enrollments.filter(e => e.payment_status === 'completed').length}
//             </span>
//           </div>
//           <div className="bg-yellow-50 px-4 py-2 rounded-lg">
//             <span className="text-yellow-600 font-semibold">Pending: </span>
//             <span className="text-yellow-800">
//               {enrollments.filter(e => e.payment_status === 'pending').length}
//             </span>
//           </div>
//         </div>
//       </div>

//       {/* Loading State */}
//       {loading ? (
//         <div className="text-center py-12">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
//           <p className="text-gray-600">Loading enrollments...</p>
//         </div>
//       ) : enrollments.length === 0 ? (
//         <div className="text-center py-16 bg-gray-50 rounded-lg">
//           <div className="mb-4">
//             <Users className="w-16 h-16 text-gray-300 mx-auto" />
//           </div>
//           <p className="text-gray-500 text-lg font-medium">No enrollments found</p>
//           <p className="text-gray-400 text-sm mt-2">
//             {searchTerm || statusFilter !== 'all' 
//               ? 'Try adjusting your filters' 
//               : 'Enrollments will appear here once students register'}
//           </p>
//         </div>
//       ) : (
//         <div className="overflow-x-auto rounded-lg shadow">
//           <table className="min-w-full border border-gray-300">
//             <thead className="bg-gray-200">
//               <tr>
//                 <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-300">
//                   Enrollment ID
//                 </th>
//                 <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-300">
//                   Student Details
//                 </th>
//                 <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-300">
//                   Project
//                 </th>
//                 <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-300">
//                   Team Info
//                 </th>
//                 <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-300">
//                   Schedule
//                 </th>
//                 <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-300">
//                   Payment
//                 </th>
//                 <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-300">
//                   Status
//                 </th>
//                 <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {enrollments.map((enrollment) => (
//                 <tr key={enrollment.id} className="hover:bg-blue-50 transition-colors">
//                   {/* Enrollment ID */}
//                   <td className="px-4 py-4 border-r border-gray-200">
//                     <div className="text-sm font-mono font-semibold text-gray-900">
//                       {enrollment.enrollment_id || 'N/A'}
//                     </div>
//                     <div className="text-xs text-gray-500 mt-1">
//                       {formatDate(enrollment.created_at)}
//                     </div>
//                   </td>

//                   {/* Student Details */}
//                   <td className="px-4 py-4 border-r border-gray-200">
//                     <div className="space-y-1">
//                       <div className="text-sm font-medium text-gray-900">
//                         {enrollment.student_name || 'N/A'}
//                       </div>
//                       <div className="text-xs text-gray-600">
//                         📧 {enrollment.email || 'N/A'}
//                       </div>
//                       <div className="text-xs text-gray-600">
//                         📱 {enrollment.mobile || 'N/A'}
//                       </div>
//                       {enrollment.district && enrollment.district !== 'Same' && (
//                         <div className="text-xs text-gray-500 mt-1">
//                           📍 {enrollment.district}
//                         </div>
//                       )}
//                     </div>
//                   </td>

//                   {/* Project */}
//                   <td className="px-4 py-4 border-r border-gray-200">
//                     <div className="text-sm font-medium text-gray-900">
//                       {enrollment.project_title || 'N/A'}
//                     </div>
//                     <div className="text-xs text-gray-500 mt-1 font-mono">
//                       {enrollment.project_code || 'N/A'}
//                     </div>
//                   </td>

//                   {/* Team Info */}
//                   <td className="px-4 py-4 border-r border-gray-200">
//                     <div className="flex items-center text-sm text-gray-700">
//                       <Users className="w-4 h-4 mr-2 text-blue-500 flex-shrink-0" />
//                       <span>{getTeamSizeDisplay(enrollment.team_size)}</span>
//                     </div>
//                   </td>

//                   {/* Schedule */}
//                   <td className="px-4 py-4 border-r border-gray-200">
//                     <div className="space-y-2">
//                       {enrollment.preferred_start_date && (
//                         <div className="flex items-center text-xs text-gray-600">
//                           <Calendar className="w-3 h-3 mr-1 text-green-500 flex-shrink-0" />
//                           {formatDate(enrollment.preferred_start_date)}
//                         </div>
//                       )}
//                       {enrollment.preferred_time && (
//                         <div className="flex items-center text-xs text-gray-600">
//                           <Clock className="w-3 h-3 mr-1 text-orange-500 flex-shrink-0" />
//                           {enrollment.preferred_time}
//                         </div>
//                       )}
//                     </div>
//                   </td>

//                   {/* Payment */}
//                   <td className="px-4 py-4 border-r border-gray-200">
//                     <div className="space-y-1">
//                       <div className="text-sm font-medium text-gray-900">
//                         ₹{enrollment.amount || 'N/A'}
//                       </div>
//                       <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
//                         {enrollment.payment_method?.toUpperCase() || 'N/A'}
//                       </span>
//                     </div>
//                   </td>

//                   {/* Status */}
//                   <td className="px-4 py-4 border-r border-gray-200">
//                     <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeClass(enrollment.payment_status)}`}>
//                       {enrollment.payment_status?.toUpperCase() || 'PENDING'}
//                     </span>
//                   </td>

//                   {/* Actions */}
//                   <td className="px-4 py-4">
//                     {enrollment.payment_status === 'pending' && (
//                       <div className="flex space-x-2">
//                         <button
//                           onClick={() => onUpdateStatus(enrollment.id, 'completed')}
//                           className="text-green-600 hover:text-green-900 p-2 hover:bg-green-50 rounded-lg transition-colors"
//                           title="Mark as Completed"
//                         >
//                           <Check className="w-5 h-5" />
//                         </button>
//                         <button
//                           onClick={() => onUpdateStatus(enrollment.id, 'failed')}
//                           className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-lg transition-colors"
//                           title="Mark as Failed"
//                         >
//                           <X className="w-5 h-5" />
//                         </button>
//                       </div>
//                     )}
//                     {enrollment.payment_status === 'completed' && (
//                       <div className="flex items-center text-green-600 text-xs font-medium">
//                         <Check className="w-4 h-4 mr-1" />
//                         Verified
//                       </div>
//                     )}
//                     {enrollment.payment_status === 'failed' && (
//                       <button
//                         onClick={() => onUpdateStatus(enrollment.id, 'pending')}
//                         className="text-blue-600 hover:text-blue-900 text-xs font-medium hover:underline"
//                       >
//                         Retry
//                       </button>
//                     )}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {/* Additional Info Section */}
//       {/* {!loading && enrollments.length > 0 && (
//         <div className="mt-6 p-5 bg-blue-50 border border-blue-200 rounded-lg">
//           <h4 className="text-sm font-semibold text-blue-900 mb-3 flex items-center">
//             <Calendar className="w-4 h-4 mr-2" />
//             Enrollment Management Guide
//           </h4>
//           <ul className="text-sm text-blue-800 space-y-2">
//             <li className="flex items-start">
//               <Check className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-green-600" />
//               <span>Click the <strong>✓</strong> button to approve and mark enrollment as completed</span>
//             </li>
//             <li className="flex items-start">
//               <X className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-red-600" />
//               <span>Click the <strong>✗</strong> button to reject or mark as failed</span>
//             </li>
//             <li className="flex items-start">
//               <Search className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
//               <span>Use the search bar and filters to quickly find specific enrollments</span>
//             </li>
//             <li className="flex items-start">
//               <Users className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
//               <span>Contact students directly using their email or mobile number</span>
//             </li>
//           </ul>
//         </div>
//       )} */}
//     </div>
//   );
// }
