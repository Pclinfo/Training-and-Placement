'use client';
import React from 'react';
import { Search, Check, X } from 'lucide-react';

export default function PaymentsTab({ 
  payments, 
  loading, 
  searchTerm, 
  setSearchTerm, 
  statusFilter, 
  setStatusFilter, 
  onUpdateStatus 
}) {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search payments..."
              className="text-black pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-black border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-2">Loading payments...</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-400 border-collapse">
            <thead className="bg-gray-300">
              <tr>
                <th className="px-6 py-3 text-left text-xs  border border-gray-400 border-collapse font-medium text-gray-500 uppercase tracking-wider">
                  Payment ID
                </th>
                <th className="px-6 py-3 text-left text-xs  border border-gray-400 border-collapse font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs  border border-gray-400 border-collapse font-medium text-gray-500 uppercase tracking-wider">
                  Course
                </th>
                <th className="px-6 py-3 text-left text-xs  border border-gray-400 border-collapse font-medium text-gray-500 uppercase tracking-wider">
                  Method
                </th>
                <th className="px-6 py-3 text-left text-xs  border border-gray-400 border-collapse font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs  border border-gray-400 border-collapse font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs  border border-gray-400 border-collapsefont-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {payments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50 border border-gray-400 border-collapse">
                  <td className="px-6 py-4 text-sm font-mono text-gray-900 border border-gray-400 border-collapse">
                    {payment.payment_id}
                  </td>
                  <td className=" border border-gray-400 border-collapse">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {payment.student_name}
                      </div>
                      <div className="text-sm text-gray-500">{payment.email}</div>
                    </div>
                  </td>
                  <td className=" border border-gray-400 border-collapse text-sm text-gray-900">
                    {payment.course_title}
                  </td>
                  <td className=" border border-gray-400 border-collapse">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {payment.payment_method?.toUpperCase()}
                    </span>
                  </td>
                  <td className=" border border-gray-400 border-collapse text-sm text-gray-900">₹{payment.amount}</td>
                  <td className=" border border-gray-400 border-collapse">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        payment.payment_status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : payment.payment_status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {payment.payment_status?.toUpperCase()}
                    </span>
                  </td>
                  <td className=" border border-gray-400 border-collapse€ text-sm font-medium">
                    {payment.payment_status === 'pending' && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => onUpdateStatus(payment.id, 'completed')}
                          className="text-green-600 hover:text-green-900"
                          title="Mark as Completed"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onUpdateStatus(payment.id, 'failed')}
                          className="text-red-600 hover:text-red-900"
                          title="Mark as Failed"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
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