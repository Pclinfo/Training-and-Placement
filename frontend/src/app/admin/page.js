// frontend/src/app/admin/page.js
'use client';
import React, { useState, useEffect } from 'react';
import AdminLogin from '../components/admin/AdminLogin';
import DashboardLayout from '../components/admin/DashboardLayout';
import StatsCards from '../components/admin/StatsCards';
import CoursesTab from '../components/admin/CoursesTab';
import PaymentsTab from '../components/admin/PaymentsTab';
import InternshipsTab from '../components/admin/InternshipsTab';
import ProjectsTab from '../components/admin/ProjectsTab';
import CourseModal from '../components/admin/CourseModal';
import InternshipModal from '../components/admin/InternshipModal';
import ProjectModal from '../components/admin/ProjectModal';
import ProjectPaymentTab from '../components/admin/ProjectPaymentTab';
import InternshipEnrollmentTab from '../components/admin/InternshipEnrollmentTab';

export default function AdminPage() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('courses');
  const [courses, setCourses] = useState([]);
  const [payments, setPayments] = useState([]);
  const [internships, setInternships] = useState([]);
  const [projects, setProjects] = useState([]);
  const [projectPayments, setProjectPayments] = useState([]);
  const [internshipEnrollments, setInternshipEnrollments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showInternshipModal, setShowInternshipModal] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [editingInternship, setEditingInternship] = useState(null);
  const [editingProject, setEditingProject] = useState(null);
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
      switch(activeTab) {
        case 'courses':
          fetchCourses();
          break;
        case 'payments':
          fetchPayments();
          break;
        case 'internships':
          fetchInternships();
          break;
        case 'projects':
          fetchProjects();
          break;
        case 'project-payments':
          fetchProjectPayments();
          break;
        case 'internship-enrollments':
          fetchInternshipEnrollments();
          break;
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

  const fetchInternships = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:7000/admin/internships', {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('admin_token')}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setInternships(data.internships);
      }
    } catch (err) {
      console.error('Error fetching internships:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:7000/admin/projects', {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('admin_token')}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setProjects(data.projects);
      }
    } catch (err) {
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProjectPayments = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:7000/admin/project-enrollments', {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('admin_token')}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setProjectPayments(data.enrollments);
      }
    } catch (err) {
      console.error('Error fetching project enrollments:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchInternshipEnrollments = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:7000/admin/internship-applications', {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('admin_token')}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setInternshipEnrollments(data.applications);
      }
    } catch (err) {
      console.error('Error fetching internship enrollments:', err);
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

  const handleDeleteInternship = async (internshipId) => {
    if (!confirm('Are you sure you want to delete this internship?')) return;

    try {
      const response = await fetch(`http://localhost:7000/admin/internships/${internshipId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('admin_token')}`,
        },
      });

      if (response.ok) {
        fetchInternships();
      }
    } catch (err) {
      console.error('Error deleting internship:', err);
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      const response = await fetch(`http://localhost:7000/admin/projects/${projectId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('admin_token')}`,
        },
      });

      if (response.ok) {
        fetchProjects();
      }
    } catch (err) {
      console.error('Error deleting project:', err);
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

  const updateProjectEnrollmentStatus = async (enrollmentId, status) => {
    try {
      const response = await fetch(`http://localhost:7000/admin/project-enrollments/${enrollmentId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('admin_token')}`,
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        fetchProjectPayments();
      }
    } catch (err) {
      console.error('Error updating enrollment status:', err);
    }
  };

  const updateInternshipEnrollmentStatus = async (enrollmentId, status) => {
    try {
      const response = await fetch(`http://localhost:7000/admin/internship-applications/${enrollmentId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('admin_token')}`,
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        fetchInternshipEnrollments();
      }
    } catch (err) {
      console.error('Error updating internship enrollment status:', err);
    }
  };

  // Filtering logic
  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredInternships = internships.filter(internship =>
    internship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    internship.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.course_title.toLowerCase().includes(searchTerm.toLowerCase());

    if (statusFilter === 'all') return matchesSearch;
    return matchesSearch && payment.payment_status === statusFilter;
  });

  const filteredProjectPayments = projectPayments.filter(enrollment => {
    const matchesSearch = 
      enrollment.student_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enrollment.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enrollment.project_title?.toLowerCase().includes(searchTerm.toLowerCase());

    if (statusFilter === 'all') return matchesSearch;
    return matchesSearch && enrollment.payment_status === statusFilter;
  });

  const filteredInternshipEnrollments = internshipEnrollments.filter(enrollment => {
    const fullName = `${enrollment.fname} ${enrollment.lname}`.toLowerCase();
    const matchesSearch = 
      fullName.includes(searchTerm.toLowerCase()) ||
      enrollment.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enrollment.internship_title?.toLowerCase().includes(searchTerm.toLowerCase());

    if (statusFilter === 'all') return matchesSearch;
    return matchesSearch && enrollment.payment_status === statusFilter;
  });

  // Statistics
  const stats = {
    totalCourses: courses.length,
    activeCourses: courses.filter(c => c.is_active).length,
    totalInternships: internships.length,
    activeInternships: internships.filter(i => i.is_active).length,
    totalProjects: projects.length,
    activeProjects: projects.filter(p => p.is_active).length,
    totalPayments: payments.length,
    completedPayments: payments.filter(p => p.payment_status === 'completed').length,
    totalRevenue: payments
      .filter(p => p.payment_status === 'completed')
      .reduce((sum, p) => sum + (p.amount || 0), 0),
    totalProjectEnrollments: projectPayments.length,
    confirmedProjectEnrollments: projectPayments.filter(p => p.payment_status === 'completed').length,
    totalInternshipApplications: internshipEnrollments.length,
    approvedInternshipApplications: internshipEnrollments.filter(a => a.payment_status === 'approved').length
  };

  if (!user) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return (
    <DashboardLayout user={user} onLogout={handleLogout}>
      <StatsCards stats={stats} />
      <StatsCards stats={stats} activeTab={activeTab} />

      <div className="bg-white rounded-xl shadow-sm">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6 overflow-x-auto" style={{ backgroundColor: "rgb(185, 185, 185)" }}>
            <button
              onClick={() => {
                setActiveTab('courses');
                setSearchTerm('');
              }}
              className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'courses'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Training @ Placement
            </button>

            <button
              onClick={() => {
                setActiveTab('internships');
                setSearchTerm('');
              }}
              className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'internships'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Internship Management
            </button>

            <button
              onClick={() => {
                setActiveTab('projects');
                setSearchTerm('');
              }}
              className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'projects'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Project Management
            </button>

            <button
              onClick={() => {
                setActiveTab('payments');
                setSearchTerm('');
              }}
              className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'payments'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Training @ Placement Payment
            </button>

            <button
              onClick={() => {
                setActiveTab('project-payments');
                setSearchTerm('');
              }}
              className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'project-payments'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Project Enrollments
            </button>

            <button
              onClick={() => {
                setActiveTab('internship-enrollments');
                setSearchTerm('');
              }}
              className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'internship-enrollments'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Internship Applications
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
              onEdit={(course) => {
                setEditingCourse(course);
                setShowCourseModal(true);
              }}
              onAdd={() => {
                setEditingCourse(null);
                setShowCourseModal(true);
              }}
            />
          )}

          {activeTab === 'internships' && (
            <InternshipsTab
              internships={filteredInternships}
              loading={loading}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              onDelete={handleDeleteInternship}
              onEdit={(internship) => {
                setEditingInternship(internship);
                setShowInternshipModal(true);
              }}
              onAdd={() => {
                setEditingInternship(null);
                setShowInternshipModal(true);
              }}
            />
          )}

          {activeTab === 'projects' && (
            <ProjectsTab
              projects={filteredProjects}
              loading={loading}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              onDelete={handleDeleteProject}
              onEdit={(project) => {
                setEditingProject(project);
                setShowProjectModal(true);
              }}
              onAdd={() => {
                setEditingProject(null);
                setShowProjectModal(true);
              }}
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

          {activeTab === 'project-payments' && (
            <ProjectPaymentTab
              projectPayments={filteredProjectPayments}
              loading={loading}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              onUpdateStatus={updateProjectEnrollmentStatus}
            />
          )}

          {activeTab === 'internship-enrollments' && (
            <InternshipEnrollmentTab
              enrollments={filteredInternshipEnrollments}
              loading={loading}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              onUpdateStatus={updateInternshipEnrollmentStatus}
            />
          )}
        </div>
      </div>

      {showCourseModal && (
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

      {showInternshipModal && (
        <InternshipModal
          internship={editingInternship}
          onClose={() => {
            setShowInternshipModal(false);
            setEditingInternship(null);
          }}
          onSave={() => {
            setShowInternshipModal(false);
            setEditingInternship(null);
            fetchInternships();
          }}
        />
      )}

      {showProjectModal && (
        <ProjectModal
          project={editingProject}
          onClose={() => {
            setShowProjectModal(false);
            setEditingProject(null);
          }}
          onSave={() => {
            setShowProjectModal(false);
            setEditingProject(null);
            fetchProjects();
          }}
        />
      )}
    </DashboardLayout>
  );
}

// // frontend/src/app/admin/page.js
// 'use client';
// import React, { useState, useEffect } from 'react';
// import AdminLogin from '../components/admin/AdminLogin';
// import DashboardLayout from '../components/admin/DashboardLayout';
// import StatsCards from '../components/admin/StatsCards';
// import CoursesTab from '../components/admin/CoursesTab';
// import PaymentsTab from '../components/admin/PaymentsTab';
// import InternshipsTab from '../components/admin/InternshipsTab';
// import ProjectsTab from '../components/admin/ProjectsTab';
// import CourseModal from '../components/admin/CourseModal';
// import InternshipModal from '../components/admin/InternshipModal';
// import ProjectModal from '../components/admin/ProjectModal';
// import ProjectPaymentTab from '../components/admin/ProjectPaymentTab';

// export default function AdminPage() {
//   const [user, setUser] = useState(null);
//   const [activeTab, setActiveTab] = useState('courses');
//   const [courses, setCourses] = useState([]);
//   const [payments, setPayments] = useState([]);
//   const [internships, setInternships] = useState([]);
//   const [projects, setProjects] = useState([]);
//   const [projectPayments, setProjectPayments] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [showCourseModal, setShowCourseModal] = useState(false);
//   const [showInternshipModal, setShowInternshipModal] = useState(false);
//   const [showProjectModal, setShowProjectModal] = useState(false);
//   const [editingCourse, setEditingCourse] = useState(null);
//   const [editingInternship, setEditingInternship] = useState(null);
//   const [editingProject, setEditingProject] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [statusFilter, setStatusFilter] = useState('all');

//   // Check for existing session
//   useEffect(() => {
//     const savedUser = sessionStorage.getItem('admin_user');
//     if (savedUser) {
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
//       } else if (activeTab === 'internships') {
//         fetchInternships();
//       } else if (activeTab === 'projects') {
//         fetchProjects();
//       } else if (activeTab === 'project-payments') {  // NEW
//       fetchProjectPayments();
//     }
//     }
//   }, [user, activeTab]);

//   const fetchCourses = async () => {
//     setLoading(true);
//     try {
//       const response = await fetch('http://localhost:7000/admin/courses', {
//         headers: {
//           'Authorization': `Bearer ${sessionStorage.getItem('admin_token')}`,
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
//       const response = await fetch('http://localhost:7000/admin/payments', {
//         headers: {
//           'Authorization': `Bearer ${sessionStorage.getItem('admin_token')}`,
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

//   const fetchInternships = async () => {
//     setLoading(true);
//     try {
//       const response = await fetch('http://localhost:7000/admin/internships', {
//         headers: {
//           'Authorization': `Bearer ${sessionStorage.getItem('admin_token')}`,
//         },
//       });
//       const data = await response.json();
//       if (data.success) {
//         setInternships(data.internships);
//       }
//     } catch (err) {
//       console.error('Error fetching internships:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchProjects = async () => {
//     setLoading(true);
//     try {
//       const response = await fetch('http://localhost:7000/admin/projects', {
//         headers: {
//           'Authorization': `Bearer ${sessionStorage.getItem('admin_token')}`,
//         },
//       });
//       const data = await response.json();
//       if (data.success) {
//         setProjects(data.projects);
//       }
//     } catch (err) {
//       console.error('Error fetching projects:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleLogin = (userData, token) => {
//     setUser(userData);
//     sessionStorage.setItem('admin_token', token);
//     sessionStorage.setItem('admin_user', JSON.stringify(userData));
//   };

//   const handleLogout = () => {
//     sessionStorage.removeItem('admin_token');
//     sessionStorage.removeItem('admin_user');
//     setUser(null);
//   };

//   const handleDeleteCourse = async (courseId) => {
//     if (!confirm('Are you sure you want to delete this course?')) return;

//     try {
//       const response = await fetch(`http://localhost:7000/admin/courses/${courseId}`, {
//         method: 'DELETE',
//         headers: {
//           'Authorization': `Bearer ${sessionStorage.getItem('admin_token')}`,
//         },
//       });

//       if (response.ok) {
//         fetchCourses();
//       }
//     } catch (err) {
//       console.error('Error deleting course:', err);
//     }
//   };

//   const handleDeleteInternship = async (internshipId) => {
//     if (!confirm('Are you sure you want to delete this internship?')) return;

//     try {
//       const response = await fetch(`http://localhost:7000/admin/internships/${internshipId}`, {
//         method: 'DELETE',
//         headers: {
//           'Authorization': `Bearer ${sessionStorage.getItem('admin_token')}`,
//         },
//       });

//       if (response.ok) {
//         fetchInternships();
//       }
//     } catch (err) {
//       console.error('Error deleting internship:', err);
//     }
//   };

//   const handleDeleteProject = async (projectId) => {
//     if (!confirm('Are you sure you want to delete this project?')) return;

//     try {
//       const response = await fetch(`http://localhost:7000/admin/projects/${projectId}`, {
//         method: 'DELETE',
//         headers: {
//           'Authorization': `Bearer ${sessionStorage.getItem('admin_token')}`,
//         },
//       });

//       if (response.ok) {
//         fetchProjects();
//       }
//     } catch (err) {
//       console.error('Error deleting project:', err);
//     }
//   };

//   const updatePaymentStatus = async (paymentId, status) => {
//     try {
//       const response = await fetch(`http://localhost:7000/admin/payments/${paymentId}/status`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${sessionStorage.getItem('admin_token')}`,
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

//   const fetchProjectPayments = async () => {
//   setLoading(true);
//   try {
//     const response = await fetch('http://localhost:7000/admin/project-enrollments', {
//       headers: {
//         'Authorization': `Bearer ${sessionStorage.getItem('admin_token')}`,
//       },
//     });
//     const data = await response.json();
//     if (data.success) {
//       setProjectPayments(data.enrollments);
//     }
//   } catch (err) {
//     console.error('Error fetching project enrollments:', err);
//   } finally {
//     setLoading(false);
//   }
// };

// const updateProjectEnrollmentStatus = async (enrollmentId, status) => {
//   try {
//     const response = await fetch(`http://localhost:7000/admin/project-enrollments/${enrollmentId}/status`, {
//       method: 'PUT',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${sessionStorage.getItem('admin_token')}`,
//       },
//       body: JSON.stringify({ status }),
//     });

//     if (response.ok) {
//       fetchProjectPayments();
//     }
//   } catch (err) {
//     console.error('Error updating enrollment status:', err);
//   }
// };

//   const filteredCourses = courses.filter(course =>
//     course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     course.category.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const filteredInternships = internships.filter(internship =>
//     internship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     internship.category.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const filteredProjects = projects.filter(project =>
//     project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     project.category.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const filteredPayments = payments.filter(payment => {
//     const matchesSearch = payment.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       payment.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       payment.course_title.toLowerCase().includes(searchTerm.toLowerCase());

//     if (statusFilter === 'all') return matchesSearch;
//     return matchesSearch && payment.payment_status === statusFilter;
//   });

//   // 1. Fix the filteredProjectPayments (around line 159)
// const filteredProjectPayments = projectPayments.filter(enrollment => {
//   const matchesSearch = 
//     enrollment.student_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     enrollment.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     enrollment.project_title?.toLowerCase().includes(searchTerm.toLowerCase());

//   if (statusFilter === 'all') return matchesSearch;
//   return matchesSearch && enrollment.payment_status === statusFilter;
// });

// //   const filteredProjectPayments = projectPayments.filter(enrollment => {
// //   const matchesSearch = enrollment.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //     enrollment.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //     enrollment.project_title.toLowerCase().includes(searchTerm.toLowerCase());

// //   if (statusFilter === 'all') return matchesSearch;
// //   return matchesSearch && enrollment.enrollment_status === statusFilter;
// // });


// // 2. Update the stats object to handle undefined projectPayments (around line 166)
// const stats = {
//   totalCourses: courses.length,
//   activeCourses: courses.filter(c => c.is_active).length,
//   totalInternships: internships.length,
//   activeInternships: internships.filter(i => i.is_active).length,
//   totalProjects: projects.length,
//   activeProjects: projects.filter(p => p.is_active).length,
//   totalPayments: payments.length,
//   completedPayments: payments.filter(p => p.payment_status === 'completed').length,
//   totalRevenue: payments
//     .filter(p => p.payment_status === 'completed')
//     .reduce((sum, p) => sum + (p.amount || 0), 0),
//   totalProjectEnrollments: projectPayments.length,  // Changed from projectEnrollments
//   confirmedProjectEnrollments: projectPayments.filter(p => p.payment_status === 'completed').length  // Changed
// };

//   // const stats = {
//   //   totalCourses: courses.length,
//   //   activeCourses: courses.filter(c => c.is_active).length,
//   //   totalInternships: internships.length,
//   //   activeInternships: internships.filter(i => i.is_active).length,
//   //   totalProjects: projects.length,
//   //   activeProjects: projects.filter(p => p.is_active).length,
//   //   totalPayments: payments.length,
//   //   completedPayments: payments.filter(p => p.payment_status === 'completed').length,
//   //   totalRevenue: payments.filter(p => p.payment_status === 'completed').reduce((sum, p) => sum + (p.amount || 0), 0),
//   // totalProjectEnrollments: projectPayments.length,  // NEW
//   // confirmedProjectEnrollments: projectPayments.filter(p => p.enrollment_status === 'confirmed').length  // NEW
//   // };

//   if (!user) {
//     return <AdminLogin onLogin={handleLogin} />;
//   }

//   return (
//     <DashboardLayout user={user} onLogout={handleLogout}>
//       <StatsCards stats={stats} />

//       <div className="bg-white rounded-xl shadow-sm">
//         <div className="border-b border-gray-200">
//           <nav className="flex space-x-8 px-6" style={{ backgroundColor: "rgb(185, 185, 185)" }}>
//             <button
//               onClick={() => {
//                 setActiveTab('courses');
//                 setSearchTerm('');
//               }}
//               className={`py-4 px-1 border-b-2 font-medium text-sm ${
//                 activeTab === 'courses'
//                   ? 'border-blue-500 text-blue-600'
//                   : 'border-transparent text-gray-500 hover:text-gray-700'
//               }`}
//             >
//               Course Management
//             </button>

//             <button
//               onClick={() => {
//                 setActiveTab('internships');
//                 setSearchTerm('');
//               }}
//               className={`py-4 px-1 border-b-2 font-medium text-sm ${
//                 activeTab === 'internships'
//                   ? 'border-blue-500 text-blue-600'
//                   : 'border-transparent text-gray-500 hover:text-gray-700'
//               }`}
//             >
//               Internship Management
//             </button>

//             <button
//               onClick={() => {
//                 setActiveTab('projects');
//                 setSearchTerm('');
//               }}
//               className={`py-4 px-1 border-b-2 font-medium text-sm ${
//                 activeTab === 'projects'
//                   ? 'border-blue-500 text-blue-600'
//                   : 'border-transparent text-gray-500 hover:text-gray-700'
//               }`}
//             >
//               Project Management
//             </button>

//             <button
//               onClick={() => {
//                 setActiveTab('payments');
//                 setSearchTerm('');
//               }}
//               className={`py-4 px-1 border-b-2 font-medium text-sm ${
//                 activeTab === 'payments'
//                   ? 'border-blue-500 text-blue-600'
//                   : 'border-transparent text-gray-500 hover:text-gray-700'
//               }`}
//             >
//               Payment Management
//             </button>

//             <button
//   onClick={() => {
//     setActiveTab('project-payments');
//     setSearchTerm('');
//   }}
//   className={`py-4 px-1 border-b-2 font-medium text-sm ${
//     activeTab === 'project-payments'
//       ? 'border-purple-500 text-purple-600'
//       : 'border-transparent text-gray-500 hover:text-gray-700'
//   }`}
// >
//   Project Enrollments
// </button>
//           </nav>
//         </div>

//         <div className="p-6">
//           {activeTab === 'courses' && (
//             <CoursesTab
//               courses={filteredCourses}
//               loading={loading}
//               searchTerm={searchTerm}
//               setSearchTerm={setSearchTerm}
//               onDelete={handleDeleteCourse}
//               onEdit={(course) => {
//                 setEditingCourse(course);
//                 setShowCourseModal(true);
//               }}
//               onAdd={() => {
//                 setEditingCourse(null);
//                 setShowCourseModal(true);
//               }}
//             />
//           )}

//           {activeTab === 'internships' && (
//             <InternshipsTab
//               internships={filteredInternships}
//               loading={loading}
//               searchTerm={searchTerm}
//               setSearchTerm={setSearchTerm}
//               onDelete={handleDeleteInternship}
//               onEdit={(internship) => {
//                 setEditingInternship(internship);
//                 setShowInternshipModal(true);
//               }}
//               onAdd={() => {
//                 setEditingInternship(null);
//                 setShowInternshipModal(true);
//               }}
//             />
//           )}

//           {activeTab === 'projects' && (
//             <ProjectsTab
//               projects={filteredProjects}
//               loading={loading}
//               searchTerm={searchTerm}
//               setSearchTerm={setSearchTerm}
//               onDelete={handleDeleteProject}
//               onEdit={(project) => {
//                 setEditingProject(project);
//                 setShowProjectModal(true);
//               }}
//               onAdd={() => {
//                 setEditingProject(null);
//                 setShowProjectModal(true);
//               }}
//             />
//           )}

//           {activeTab === 'payments' && (
//             <PaymentsTab
//               payments={filteredPayments}
//               loading={loading}
//               searchTerm={searchTerm}
//               setSearchTerm={setSearchTerm}
//               statusFilter={statusFilter}
//               setStatusFilter={setStatusFilter}
//               onUpdateStatus={updatePaymentStatus}
//             />
//           )}

         
// // 3. Update the ProjectPaymentTab component call (around line 310)
// {activeTab === 'project-payments' && (
//   <ProjectPaymentTab
//     projectPayments={filteredProjectPayments}  // Use projectPayments, not enrollments
//     loading={loading}
//     searchTerm={searchTerm}
//     setSearchTerm={setSearchTerm}     
//     statusFilter={statusFilter}
//     setStatusFilter={setStatusFilter}
//     onUpdateStatus={updateProjectEnrollmentStatus}
//   />
// )}
//         </div>
//       </div>

//       {showCourseModal && (
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

//       {showInternshipModal && (
//         <InternshipModal
//           internship={editingInternship}
//           onClose={() => {
//             setShowInternshipModal(false);
//             setEditingInternship(null);
//           }}
//           onSave={() => {
//             setShowInternshipModal(false);
//             setEditingInternship(null);
//             fetchInternships();
//           }}
//         />
//       )}

//       {showProjectModal && (
//         <ProjectModal
//           project={editingProject}
//           onClose={() => {
//             setShowProjectModal(false);
//             setEditingProject(null);
//           }}
//           onSave={() => {
//             setShowProjectModal(false);
//             setEditingProject(null);
//             fetchProjects();
//           }}
//         />
//       )}
//     </DashboardLayout>
//   );
// }