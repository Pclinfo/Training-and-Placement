// frontend/src/components/admin/InternshipEnrollmentTab.js
import React, { useState } from 'react';
import { Search, Download, Eye, CheckCircle, Clock, XCircle, FileText, ExternalLink } from 'lucide-react';

const InternshipEnrollmentTab = ({ 
  enrollments = [], 
  loading, 
  searchTerm, 
  setSearchTerm, 
  statusFilter, 
  setStatusFilter,
  onUpdateStatus 
}) => {
  const [viewingDetails, setViewingDetails] = useState(null);

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Clock },
      approved: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle },
      rejected: { bg: 'bg-red-100', text: 'text-red-800', icon: XCircle },
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        <Icon className="w-3 h-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const exportToCSV = () => {
    const headers = [
      'Enrollment ID',
      'Name',
      'Email',
      'Mobile',
      'Internship',
      'Experience Level',
      'Preferred Start Date',
      'Availability',
      'Status',
      'Applied Date'
    ];
    
    const rows = enrollments.map(enrollment => [
      enrollment.enrollment_id,
      `${enrollment.fname} ${enrollment.lname}`,
      enrollment.email,
      enrollment.mobile,
      enrollment.internship_title,
      enrollment.experience_level,
      enrollment.preferred_start_date || 'N/A',
      enrollment.availability,
      enrollment.payment_status,
      formatDate(enrollment.date)
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `internship-applications-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex-1 w-full sm:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, email, or internship..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>

          <button
            onClick={exportToCSV}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="text-sm text-blue-600 font-medium">Total Applications</div>
          <div className="text-2xl font-bold text-blue-900">{enrollments.length}</div>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="text-sm text-yellow-600 font-medium">Pending Review</div>
          <div className="text-2xl font-bold text-yellow-900">
            {enrollments.filter(e => e.payment_status === 'pending').length}
          </div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="text-sm text-green-600 font-medium">Approved</div>
          <div className="text-2xl font-bold text-green-900">
            {enrollments.filter(e => e.payment_status === 'approved').length}
          </div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="text-sm text-red-600 font-medium">Rejected</div>
          <div className="text-2xl font-bold text-red-900">
            {enrollments.filter(e => e.payment_status === 'rejected').length}
          </div>
        </div>
      </div>

      {/* Applications Table */}
      {enrollments.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-lg">No internship applications found</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Enrollment ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applicant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Internship
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Experience
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applied Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {enrollments.map((enrollment) => (
                  <tr key={enrollment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {enrollment.enrollment_id}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {enrollment.fname} {enrollment.lname}
                      </div>
                      <div className="text-sm text-gray-500">{enrollment.email}</div>
                      <div className="text-sm text-gray-500">{enrollment.mobile}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{enrollment.internship_title}</div>
                      <div className="text-xs text-gray-500">{enrollment.internship_code}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {enrollment.experience_level}
                      </span>
                      <div className="text-xs text-gray-500 mt-1">
                        {enrollment.availability}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(enrollment.payment_status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(enrollment.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setViewingDetails(enrollment)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Full Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        
                        {enrollment.payment_status === 'pending' && (
                          <>
                            <button
                              onClick={() => {
                                if (confirm(`Approve ${enrollment.fname} ${enrollment.lname}'s application?`)) {
                                  onUpdateStatus(enrollment.id, 'approved');
                                }
                              }}
                              className="text-green-600 hover:text-green-900"
                              title="Approve Application"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Reject ${enrollment.fname} ${enrollment.lname}'s application?`)) {
                                  onUpdateStatus(enrollment.id, 'rejected');
                                }
                              }}
                              className="text-red-600 hover:text-red-900"
                              title="Reject Application"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}

                        {enrollment.resume_path && (
                          <a
                            href={`http://localhost:7000${enrollment.resume_path}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-purple-600 hover:text-purple-900"
                            title="Download Resume"
                          >
                            <FileText className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {viewingDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">
                Application Details - {viewingDetails.enrollment_id}
              </h2>
              <button
                onClick={() => setViewingDetails(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Personal Information</h3>
                <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">Full Name</p>
                    <p className="text-sm font-medium text-gray-900">
                      {viewingDetails.fname} {viewingDetails.lname}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="text-sm font-medium text-gray-900">{viewingDetails.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Mobile</p>
                    <p className="text-sm font-medium text-gray-900">{viewingDetails.mobile}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Experience Level</p>
                    <p className="text-sm font-medium text-gray-900">{viewingDetails.experience_level}</p>
                  </div>
                </div>
              </div>

              {/* Internship Details */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Internship Details</h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <div>
                    <p className="text-sm text-gray-600">Internship</p>
                    <p className="text-sm font-medium text-gray-900">{viewingDetails.internship_title}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Code</p>
                    <p className="text-sm font-medium text-gray-900">{viewingDetails.internship_code}</p>
                  </div>
                </div>
              </div>

              {/* Professional Links */}
              {(viewingDetails.portfolio_url || viewingDetails.github_url) && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Professional Links</h3>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    {viewingDetails.portfolio_url && (
                      <div>
                        <p className="text-sm text-gray-600">Portfolio</p>
                        <a
                          href={viewingDetails.portfolio_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-700 flex items-center"
                        >
                          {viewingDetails.portfolio_url}
                          <ExternalLink className="w-3 h-3 ml-1" />
                        </a>
                      </div>
                    )}
                    {viewingDetails.github_url && (
                      <div>
                        <p className="text-sm text-gray-600">GitHub</p>
                        <a
                          href={viewingDetails.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-700 flex items-center"
                        >
                          {viewingDetails.github_url}
                          <ExternalLink className="w-3 h-3 ml-1" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Motivation */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Motivation</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-700 whitespace-pre-line">
                    {viewingDetails.motivation}
                  </p>
                </div>
              </div>

              {/* Preferences */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Preferences</h3>
                <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">Preferred Start Date</p>
                    <p className="text-sm font-medium text-gray-900">
                      {viewingDetails.preferred_start_date || 'Flexible'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Preferred Time</p>
                    <p className="text-sm font-medium text-gray-900">{viewingDetails.preferred_time}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Availability</p>
                    <p className="text-sm font-medium text-gray-900">{viewingDetails.availability}</p>
                  </div>
                </div>
              </div>

              {/* Resume */}
              {viewingDetails.resume_path && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Resume</h3>
                  <a
                    href={`http://localhost:7000${viewingDetails.resume_path}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <FileText className="w-5 h-5 mr-2" />
                    Download Resume
                    <ExternalLink className="w-4 h-4 ml-auto" />
                  </a>
                </div>
              )}

              {/* Status Update Actions */}
              {viewingDetails.payment_status === 'pending' && (
                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <button
                    onClick={() => {
                      onUpdateStatus(viewingDetails.id, 'rejected');
                      setViewingDetails(null);
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject Application
                  </button>
                  <button
                    onClick={() => {
                      onUpdateStatus(viewingDetails.id, 'approved');
                      setViewingDetails(null);
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve Application
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InternshipEnrollmentTab;