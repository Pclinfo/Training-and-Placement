'use client';
import React, { useState, useEffect } from 'react';
import AdminLogin from '../components/admin/AdminLogin';
import DashboardLayout from '../components/admin/DashboardLayout';
import StatsCards from '../components/admin/StatsCards';
import CoursesTab from '../components/admin/CoursesTab';
import PaymentsTab from '../components/admin/PaymentsTab';
import CourseModal from '../components/admin/CourseModal';

export default function AdminPage() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('courses');
  const [courses, setCourses] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Check for existing session
  useEffect(() => {
    const savedUser = sessionStorage.getItem('admin_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Fetch data when tab changes
  useEffect(() => {
    if (user) {
      if (activeTab === 'courses') {
        fetchCourses();
      } else if (activeTab === 'payments') {
        fetchPayments();
      }
    }
  }, [user, activeTab]);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:7000/admin/courses', {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('admin_token')}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setCourses(data.courses);
      }
    } catch (err) {
      console.error('Error fetching courses:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:7000/admin/payments', {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('admin_token')}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setPayments(data.payments);
      }
    } catch (err) {
      console.error('Error fetching payments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (userData, token) => {
    setUser(userData);
    sessionStorage.setItem('admin_token', token);
    sessionStorage.setItem('admin_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_token');
    sessionStorage.removeItem('admin_user');
    setUser(null);
  };

  const handleDeleteCourse = async (courseId) => {
    if (!confirm('Are you sure you want to delete this course?')) return;

    try {
      const response = await fetch(`http://localhost:7000/admin/courses/${courseId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('admin_token')}`,
        },
      });

      if (response.ok) {
        fetchCourses();
      }
    } catch (err) {
      console.error('Error deleting course:', err);
    }
  };

  const updatePaymentStatus = async (paymentId, status) => {
    try {
      const response = await fetch(`http://localhost:7000/admin/payments/${paymentId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('admin_token')}`,
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        fetchPayments();
      }
    } catch (err) {
      console.error('Error updating payment status:', err);
    }
  };

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.course_title.toLowerCase().includes(searchTerm.toLowerCase());

    if (statusFilter === 'all') return matchesSearch;
    return matchesSearch && payment.payment_status === statusFilter;
  });

  const stats = {
    totalCourses: courses.length,
    activeCourses: courses.filter(c => c.is_active).length,
    totalPayments: payments.length,
    completedPayments: payments.filter(p => p.payment_status === 'completed').length,
    totalRevenue: payments.filter(p => p.payment_status === 'completed').reduce((sum, p) => sum + (p.amount || 0), 0)
  };

  if (!user) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return (
    <DashboardLayout user={user} onLogout={handleLogout}>
      <StatsCards stats={stats} />

      <div className="bg-white rounded-xl shadow-sm">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('courses')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'courses'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Course Management
            </button>

            <button
              onClick={() => setActiveTab('payments')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'payments'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Payment Management
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'courses' && (
            <CoursesTab
              courses={filteredCourses}
              loading={loading}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              onDelete={handleDeleteCourse}
              onEdit={setEditingCourse}
              onAdd={() => setShowCourseModal(true)}
            />
          )}

          {activeTab === 'payments' && (
            <PaymentsTab
              payments={filteredPayments}
              loading={loading}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              onUpdateStatus={updatePaymentStatus}
            />
          )}
        </div>
      </div>

      {(showCourseModal || editingCourse) && (
        <CourseModal
          course={editingCourse}
          onClose={() => {
            setShowCourseModal(false);
            setEditingCourse(null);
          }}
          onSave={() => {
            setShowCourseModal(false);
            setEditingCourse(null);
            fetchCourses();
          }}
        />
      )}
    </DashboardLayout>
  );
}



// 'use client';
// import React, { useState, useEffect } from 'react';
// import {
//   Plus,
//   Edit,
//   Trash2,
//   Eye,
//   Users,
//   BookOpen,
//   CreditCard,
//   LogOut,
//   Search,
//   Filter,
//   Download,
//   Check,
//   X,
//   Star,
//   Clock,
//   DollarSign,
//   Lock,
//   EyeOff
// } from 'lucide-react';

// // Admin Login Component (inline)
// const AdminLogin = ({ onLogin }) => {
//   const [formData, setFormData] = useState({
//     username: '',
//     password: ''
//   });
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');

//     try {
//       const response = await fetch('http://localhost:7000/admin/login', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(formData),
//       });

//       const data = await response.json();

//       if (data.success) {
//         localStorage.setItem('admin_token', data.access_token);
//         localStorage.setItem('admin_user', JSON.stringify(data.admin));
//         onLogin(data.admin);
//       } else {
//         setError(data.error || 'Login failed');
//       }
//     } catch (err) {
//       setError('Connection error. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleInputChange = (field, value) => {
//     setFormData(prev => ({
//       ...prev,
//       [field]: value
//     }));
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center p-4">
//       <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
//         <div className="text-center mb-8">
//           <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
//             <Lock className="w-8 h-8 text-white" />
//           </div>
//           <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Login</h1>
//           <p className="text-gray-600">Sign in to manage courses and payments</p>
//         </div>

//         {error && (
//           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
//             {error}
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Username
//             </label>
//             <div className="relative">
//               <Users className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
//               <input
//                 type="text"
//                 className="text-black w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 placeholder="Enter your username"
//                 value={formData.username}
//                 onChange={(e) => handleInputChange('username', e.target.value)}
//                 required
//               />
//             </div>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Password
//             </label>
//             <div className="relative">
//               <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
//               <input
//                 type={showPassword ? 'text' : 'password'}
//                 className="text-black w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 placeholder="Enter your password"
//                 value={formData.password}
//                 onChange={(e) => handleInputChange('password', e.target.value)}
//                 required
//               />
//               <button
//                 type="button"
//                 className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
//                 onClick={() => setShowPassword(!showPassword)}
//               >
//                 {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
//               </button>
//             </div>
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
//           >
//             {loading ? (
//               <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//             ) : (
//               'Sign In'
//             )}
//           </button>
//         </form>

//         <div className="mt-6 text-center text-sm text-gray-500">
//           <p>Default credentials: admin / admin123</p>
//           <p className="mt-2">Secure your admin account in production!</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// const AdminDashboard = () => {
//   const [user, setUser] = useState(null);
//   const [activeTab, setActiveTab] = useState('courses');
//   const [courses, setCourses] = useState([]);
//   const [payments, setPayments] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [showCourseModal, setShowCourseModal] = useState(false);
//   const [editingCourse, setEditingCourse] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [statusFilter, setStatusFilter] = useState('all');

//   // Check for existing session
//   useEffect(() => {
//     const token = localStorage.getItem('admin_token');
//     const savedUser = localStorage.getItem('admin_user');

//     if (token && savedUser) {
//       setUser(JSON.parse(savedUser));
//     }
//   }, []);

//   // Fetch data when tab changes
//   useEffect(() => {
//     if (user) {
//       if (activeTab === 'courses') {
//         fetchCourses();
//       } else if (activeTab === 'payments') {
//         fetchPayments();
//       }
//     }
//   }, [user, activeTab]);

//   const fetchCourses = async () => {
//     setLoading(true);
//     try {
//       const token = localStorage.getItem('admin_token');
//       const response = await fetch('http://localhost:7000/admin/courses', {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//         },
//       });
//       const data = await response.json();
//       if (data.success) {
//         setCourses(data.courses);
//       }
//     } catch (err) {
//       console.error('Error fetching courses:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchPayments = async () => {
//     setLoading(true);
//     try {
//       const token = localStorage.getItem('admin_token');
//       const response = await fetch('http://localhost:7000/admin/payments', {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//         },
//       });
//       const data = await response.json();
//       if (data.success) {
//         setPayments(data.payments);
//       }
//     } catch (err) {
//       console.error('Error fetching payments:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleLogin = (userData) => {
//     setUser(userData);
//   };

//   const handleLogout = () => {
//     localStorage.removeItem('admin_token');
//     localStorage.removeItem('admin_user');
//     setUser(null);
//   };

//   const handleDeleteCourse = async (courseId) => {
//     if (!confirm('Are you sure you want to delete this course?')) return;

//     try {
//       const token = localStorage.getItem('admin_token');
//       const response = await fetch(`http://localhost:7000/admin/courses/${courseId}`, {
//         method: 'DELETE',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//         },
//       });

//       if (response.ok) {
//         fetchCourses();
//       }
//     } catch (err) {
//       console.error('Error deleting course:', err);
//     }
//   };

//   const updatePaymentStatus = async (paymentId, status) => {
//     try {
//       const token = localStorage.getItem('admin_token');
//       const response = await fetch(`http://localhost:7000/admin/payments/${paymentId}/status`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//         body: JSON.stringify({ status }),
//       });

//       if (response.ok) {
//         fetchPayments();
//       }
//     } catch (err) {
//       console.error('Error updating payment status:', err);
//     }
//   };

//   const filteredCourses = courses.filter(course =>
//     course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     course.category.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const filteredPayments = payments.filter(payment => {
//     const matchesSearch = payment.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       payment.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       payment.course_title.toLowerCase().includes(searchTerm.toLowerCase());

//     if (statusFilter === 'all') return matchesSearch;
//     return matchesSearch && payment.payment_status === statusFilter;
//   });

//   const stats = {
//     totalCourses: courses.length,
//     activeCourses: courses.filter(c => c.is_active).length,
//     totalPayments: payments.length,
//     completedPayments: payments.filter(p => p.payment_status === 'completed').length,
//     totalRevenue: payments.filter(p => p.payment_status === 'completed').reduce((sum, p) => sum + (p.amount || 0), 0)
//   };

//   if (!user) {
//     return <AdminLogin onLogin={handleLogin} />;
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <div className="bg-white shadow-sm border-b">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-16">
//             <div className="flex items-center">
//               <BookOpen className="w-8 h-8 text-blue-600 mr-3" />
//               <h1 className="text-xl font-bold text-gray-800">PCL Admin Dashboard</h1>
//             </div>

//             <div className="flex items-center space-x-4">
//               <span className="text-sm text-gray-600">Welcome, {user.username}</span>
//               <button
//                 onClick={handleLogout}
//                 className="flex items-center text-gray-600 hover:text-red-600 transition-colors"
//               >
//                 <LogOut className="w-4 h-4 mr-1" />
//                 Logout
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Stats Cards */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
//           <div className="bg-white rounded-xl shadow-sm p-6">
//             <div className="flex items-center">
//               <BookOpen className="w-8 h-8 text-blue-600" />
//               <div className="ml-4">
//                 <p className="text-sm text-gray-600">Total Courses</p>
//                 <p className="text-2xl font-bold text-gray-800">{stats.totalCourses}</p>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-xl shadow-sm p-6">
//             <div className="flex items-center">
//               <Eye className="w-8 h-8 text-green-600" />
//               <div className="ml-4">
//                 <p className="text-sm text-gray-600">Active Courses</p>
//                 <p className="text-2xl font-bold text-gray-800">{stats.activeCourses}</p>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-xl shadow-sm p-6">
//             <div className="flex items-center">
//               <CreditCard className="w-8 h-8 text-purple-600" />
//               <div className="ml-4">
//                 <p className="text-sm text-gray-600">Total Payments</p>
//                 <p className="text-2xl font-bold text-gray-800">{stats.totalPayments}</p>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-xl shadow-sm p-6">
//             <div className="flex items-center">
//               <Check className="w-8 h-8 text-green-600" />
//               <div className="ml-4">
//                 <p className="text-sm text-gray-600">Completed</p>
//                 <p className="text-2xl font-bold text-gray-800">{stats.completedPayments}</p>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-xl shadow-sm p-6">
//             <div className="flex items-center">
//               <DollarSign className="w-8 h-8 text-yellow-600" />
//               <div className="ml-4">
//                 <p className="text-sm text-gray-600">Revenue</p>
//                 <p className="text-2xl font-bold text-gray-800">₹{stats.totalRevenue.toLocaleString()}</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Tabs */}
//         <div className="bg-white rounded-xl shadow-sm">
//           <div className="border-b border-gray-200">
//             <nav className="flex space-x-8 px-6">
//               <button
//                 onClick={() => setActiveTab('courses')}
//                 className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'courses'
//                     ? 'border-blue-500 text-blue-600'
//                     : 'border-transparent text-gray-500 hover:text-gray-700'
//                   }`}
//               >
//                 <BookOpen className="w-4 h-4 inline mr-2" />
//                 Course Management
//               </button>

//               <button
//                 onClick={() => setActiveTab('payments')}
//                 className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'payments'
//                     ? 'border-blue-500 text-blue-600'
//                     : 'border-transparent text-gray-500 hover:text-gray-700'
//                   }`}
//               >
//                 <CreditCard className="w-4 h-4 inline mr-2" />
//                 Payment Management
//               </button>
//             </nav>
//           </div>

//           {/* Tab Content */}
//           <div className="p-6">
//             {activeTab === 'courses' && (
//               <CoursesTab
//                 courses={filteredCourses}
//                 loading={loading}
//                 searchTerm={searchTerm}
//                 setSearchTerm={setSearchTerm}
//                 onDelete={handleDeleteCourse}
//                 onEdit={setEditingCourse}
//                 onAdd={() => setShowCourseModal(true)}
//               />
//             )}

//             {activeTab === 'payments' && (
//               <PaymentsTab
//                 payments={filteredPayments}
//                 loading={loading}
//                 searchTerm={searchTerm}
//                 setSearchTerm={setSearchTerm}
//                 statusFilter={statusFilter}
//                 setStatusFilter={setStatusFilter}
//                 onUpdateStatus={updatePaymentStatus}
//               />
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Course Modal */}
//       {(showCourseModal || editingCourse) && (
//         <CourseModal
//           course={editingCourse}
//           onClose={() => {
//             setShowCourseModal(false);
//             setEditingCourse(null);
//           }}
//           onSave={() => {
//             setShowCourseModal(false);
//             setEditingCourse(null);
//             fetchCourses();
//           }}
//         />
//       )}
//     </div>
//   );
// };

// // Courses Tab Component
// const CoursesTab = ({ courses, loading, searchTerm, setSearchTerm, onDelete, onEdit, onAdd }) => (
//   <div>
//     <div className="flex justify-between items-center mb-6">
//       <div className="flex items-center space-x-4">
//         <div className="relative">
//           <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
//           <input
//             type="text"
//             placeholder="Search courses..."
//             className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>
//       </div>

//       <button
//         onClick={onAdd}
//         className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
//       >
//         <Plus className="w-4 h-4 mr-2" />
//         Add Course
//       </button>
//     </div>

//     {loading ? (
//       <div className="text-center py-8">
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
//         <p className="text-gray-600 mt-2">Loading courses...</p>
//       </div>
//     ) : (
//       <div className="overflow-x-auto">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Instructor</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Students</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {courses.map((course) => (
//               <tr key={course.id} className="hover:bg-gray-50">
//                 <td className="px-6 py-4">
//                   <div className="flex items-center">
//                     <img
//                       src={course.image_url || '/api/placeholder/64/64'}
//                       alt={course.title}
//                       className="w-12 h-12 rounded-lg object-cover mr-4"
//                     />
//                     <div>
//                       <div className="text-sm font-medium text-gray-900">{course.title}</div>
//                       <div className="text-sm text-gray-500">{course.course_code}</div>
//                     </div>
//                   </div>
//                 </td>
//                 <td className="px-6 py-4">
//                   <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
//                     {course.category}
//                   </span>
//                 </td>
//                 <td className="px-6 py-4 text-sm text-gray-900">{course.instructor}</td>
//                 <td className="px-6 py-4 text-sm text-gray-900">₹{course.total_amount}</td>
//                 <td className="px-6 py-4 text-sm text-gray-900">{course.students}</td>
//                 <td className="px-6 py-4">
//                   <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${course.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//                     }`}>
//                     {course.is_active ? 'Active' : 'Inactive'}
//                   </span>
//                 </td>
//                 <td className="px-6 py-4 text-sm font-medium">
//                   <div className="flex space-x-2">
//                     <button
//                       onClick={() => onEdit(course)}
//                       className="text-blue-600 hover:text-blue-900"
//                     >
//                       <Edit className="w-4 h-4" />
//                     </button>
//                     <button
//                       onClick={() => onDelete(course.id)}
//                       className="text-red-600 hover:text-red-900"
//                     >
//                       <Trash2 className="w-4 h-4" />
//                     </button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     )}
//   </div>
// );

// // Payments Tab Component
// const PaymentsTab = ({ payments, loading, searchTerm, setSearchTerm, statusFilter, setStatusFilter, onUpdateStatus }) => (
//   <div>
//     <div className="flex justify-between items-center mb-6">
//       <div className="flex items-center space-x-4">
//         <div className="relative">
//           <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
//           <input
//             type="text"
//             placeholder="Search payments..."
//             className="text-black pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>

//         <select
//           value={statusFilter}
//           onChange={(e) => setStatusFilter(e.target.value)}
//           className="text-black border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//         >
//           <option value="all">All Status</option>
//           <option value="pending">Pending</option>
//           <option value="completed">Completed</option>
//           <option value="failed">Failed</option>
//         </select>
//       </div>
//     </div>

//     {loading ? (
//       <div className="text-center py-8">
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
//         <p className="text-gray-600 mt-2">Loading payments...</p>
//       </div>
//     ) : (
//       <div className="overflow-x-auto">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment ID</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {payments.map((payment) => (
//               <tr key={payment.id} className="hover:bg-gray-50">
//                 <td className="px-6 py-4 text-sm font-mono text-gray-900">{payment.payment_id}</td>
//                 <td className="px-6 py-4">
//                   <div>
//                     <div className="text-sm font-medium text-gray-900">{payment.student_name}</div>
//                     <div className="text-sm text-gray-500">{payment.email}</div>
//                   </div>
//                 </td>
//                 <td className="px-6 py-4 text-sm text-gray-900">{payment.course_title}</td>
//                 <td className="px-6 py-4">
//                   <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
//                     {payment.payment_method?.toUpperCase()}
//                   </span>
//                 </td>
//                 <td className="px-6 py-4 text-sm text-gray-900">₹{payment.amount}</td>
//                 <td className="px-6 py-4">
//                   <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${payment.payment_status === 'completed' ? 'bg-green-100 text-green-800' :
//                       payment.payment_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
//                         'bg-red-100 text-red-800'
//                     }`}>
//                     {payment.payment_status?.toUpperCase()}
//                   </span>
//                 </td>
//                 <td className="px-6 py-4 text-sm font-medium">
//                   {payment.payment_status === 'pending' && (
//                     <div className="flex space-x-2">
//                       <button
//                         onClick={() => onUpdateStatus(payment.id, 'completed')}
//                         className="text-green-600 hover:text-green-900"
//                         title="Mark as Completed"
//                       >
//                         <Check className="w-4 h-4" />
//                       </button>
//                       <button
//                         onClick={() => onUpdateStatus(payment.id, 'failed')}
//                         className="text-red-600 hover:text-red-900"
//                         title="Mark as Failed"
//                       >
//                         <X className="w-4 h-4" />
//                       </button>
//                     </div>
//                   )}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     )}
//   </div>
// );

// // Course Modal Component
// const CourseModal = ({ course, onClose, onSave }) => {
//   const [formData, setFormData] = useState({
//     title: '',
//     description: '',
//     detailed_description: '',
//     level: 'Beginner',
//     rating: 4.5,
//     students: '0',
//     duration: '',
//     price: '',
//     original_price: '',
//     discount: '',
//     image_url: '',
//     category: '',
//     instructor: '',
//     course_fees: '',
//     course_code: '',
//     total_amount: '',
//     features: []
//   });

//   const [newFeature, setNewFeature] = useState('');

//   useEffect(() => {
//     if (course) {
//       setFormData({
//         ...course,
//         features: course.features || []
//       });
//     }
//   }, [course]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const token = localStorage.getItem('admin_token');
//       const url = course
//         ? `http://localhost:7000/admin/courses/${course.id}`
//         : 'http://localhost:7000/admin/courses';

//       const response = await fetch(url, {
//         method: course ? 'PUT' : 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//         body: JSON.stringify(formData),
//       });

//       if (response.ok) {
//         onSave();
//       }
//     } catch (err) {
//       console.error('Error saving course:', err);
//     }
//   };

//   const addFeature = () => {
//     if (newFeature.trim()) {
//       setFormData(prev => ({
//         ...prev,
//         features: [...prev.features, newFeature.trim()]
//       }));
//       setNewFeature('');
//     }
//   };

//   const removeFeature = (index) => {
//     setFormData(prev => ({
//       ...prev,
//       features: prev.features.filter((_, i) => i !== index)
//     }));
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
//         <div className="p-6 border-b">
//           <h2 className="text-xl font-bold text-gray-800">
//             {course ? 'Edit Course' : 'Add New Course'}
//           </h2>
//         </div>

//         <form onSubmit={handleSubmit} className="p-6 space-y-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Course Title</label>
//               <input
//                 type="text"
//                 className="text-black w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 value={formData.title}
//                 onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
//               <input
//                 type="text"
//                 className="text-black w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 value={formData.category}
//                 onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Instructor</label>
//               <input
//                 type="text"
//                 className="text-black w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 value={formData.instructor}
//                 onChange={(e) => setFormData(prev => ({ ...prev, instructor: e.target.value }))}
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
//               <input
//                 type="text"
//                 className="text-black w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 value={formData.duration}
//                 onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
//                 placeholder="e.g., 40 Hours"
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
//               <input
//                 type="text"
//                 className="text-black w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 value={formData.price}
//                 onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
//                 placeholder="e.g., 89.99"
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Original Price</label>
//               <input
//                 type="text"
//                 className="text-black w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 value={formData.original_price}
//                 onChange={(e) => setFormData(prev => ({ ...prev, original_price: e.target.value }))}
//                 placeholder="e.g., 199.99"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Course Fees (INR)</label>
//               <input
//                 type="text"
//                 className="text-black w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 value={formData.course_fees}
//                 onChange={(e) => setFormData(prev => ({ ...prev, course_fees: e.target.value }))}
//                 placeholder="e.g., INR 8,999"
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Total Amount</label>
//               <input
//                 type="text"
//                 className="text-black w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 value={formData.total_amount}
//                 onChange={(e) => setFormData(prev => ({ ...prev, total_amount: e.target.value }))}
//                 placeholder="e.g., 8999"
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
//               <select
//                 className="text-black w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 value={formData.level}
//                 onChange={(e) => setFormData(prev => ({ ...prev, level: e.target.value }))}
//               >
//                 <option value="Beginner">Beginner</option>
//                 <option value="Beginner to Advanced">Beginner to Advanced</option>
//                 <option value="Intermediate">Intermediate</option>
//                 <option value="Advanced">Advanced</option>
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
//               <input
//                 type="number"
//                 step="0.1"
//                 min="1"
//                 max="5"
//                 className="text-black w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 value={formData.rating}
//                 onChange={(e) => setFormData(prev => ({ ...prev, rating: parseFloat(e.target.value) }))}
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Students Count</label>
//               <input
//                 type="text"
//                 className="text-black w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 value={formData.students}
//                 onChange={(e) => setFormData(prev => ({ ...prev, students: e.target.value }))}
//                 placeholder="e.g., 12,456"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Discount</label>
//               <input
//                 type="text"
//                 className="text-black w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 value={formData.discount}
//                 onChange={(e) => setFormData(prev => ({ ...prev, discount: e.target.value }))}
//                 placeholder="e.g., 55% OFF"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Course Code</label>
//               <input
//                 type="text"
//                 className="text-black w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 value={formData.course_code}
//                 onChange={(e) => setFormData(prev => ({ ...prev, course_code: e.target.value }))}
//                 placeholder="e.g., WD-FS-001"
//               />
//             </div>

//             <div className="md:col-span-2">
//               <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
//               <input
//                 type="url"
//                 className="text-black w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 value={formData.image_url}
//                 onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
//                 placeholder="https://example.com/course-image.jpg"
//               />
//             </div>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Short Description</label>
//             <textarea
//               className="text-black w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-20"
//               value={formData.description}
//               onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
//               placeholder="Brief course description..."
//               required
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Detailed Description</label>
//             <textarea
//               className="text-black w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24"
//               value={formData.detailed_description}
//               onChange={(e) => setFormData(prev => ({ ...prev, detailed_description: e.target.value }))}
//               placeholder="Comprehensive course description..."
//               required
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Course Features</label>
//             <div className="space-y-2">
//               <div className="flex gap-2">
//                 <input
//                   type="text"
//                   className="text-black flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   value={newFeature}
//                   onChange={(e) => setNewFeature(e.target.value)}
//                   placeholder="Add a course feature..."
//                   onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
//                 />
//                 <button
//                   type="button"
//                   onClick={addFeature}
//                   className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//                 >
//                   <Plus className="w-4 h-4" />
//                 </button>
//               </div>

//               {formData.features.length > 0 && (
//                 <div className="space-y-2 max-h-32 overflow-y-auto">
//                   {formData.features.map((feature, index) => (
//                     <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded">
//                       <span className="text-sm text-gray-700">{feature}</span>
//                       <button
//                         type="button"
//                         onClick={() => removeFeature(index)}
//                         className="text-red-600 hover:text-red-800"
//                       >
//                         <X className="w-4 h-4" />
//                       </button>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>

//           <div className="flex justify-end space-x-4 pt-6 border-t">
//             <button
//               type="button"
//               onClick={onClose}
//               className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//             >
//               {course ? 'Update Course' : 'Create Course'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;