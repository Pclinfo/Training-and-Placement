// frontend/src/app/components/admin/StatsCards.js
'use client';
import React from 'react';
import { 
  BookOpen, 
  Eye, 
  Briefcase, 
  CheckCircle, 
  FolderKanban, 
  Users, 
  CreditCard, 
  Check, 
  DollarSign,
  FileCheck,
  UserCheck
} from 'lucide-react';

export default function StatsCards({ stats }) {

  const cardGroups = [
    {
      category: 'Training & Placement',
      color: 'blue',
      cards: [
        {
          title: 'Total Courses',
          value: stats.totalCourses,
          icon: BookOpen,
          color: 'text-blue-600',
          bgColor: 'bg-blue-50'
        },
        {
          title: 'Active Courses',
          value: stats.activeCourses,
          icon: Eye,
          color: 'text-green-600',
          bgColor: 'bg-green-50'
        },
        {
          title: 'Course Payments',
          value: stats.totalPayments,
          icon: CreditCard,
          color: 'text-orange-600',
          bgColor: 'bg-orange-50'
        },
        {
          title: 'Completed Payments',
          value: stats.completedPayments,
          icon: Check,
          color: 'text-emerald-600',
          bgColor: 'bg-emerald-50'
        }
      ]
    },
    {
      category: 'Internship Management',
      color: 'green',
      cards: [
        {
          title: 'Total Internships',
          value: stats.totalInternships,
          icon: Briefcase,
          color: 'text-indigo-600',
          bgColor: 'bg-indigo-50'
        },
        {
          title: 'Active Internships',
          value: stats.activeInternships,
          icon: CheckCircle,
          color: 'text-teal-600',
          bgColor: 'bg-teal-50'
        },
        {
          title: 'Applications',
          value: stats.totalInternshipApplications,
          icon: FileCheck,
          color: 'text-amber-600',
          bgColor: 'bg-amber-50'
        },
        {
          title: 'Approved',
          value: stats.approvedInternshipApplications,
          icon: CheckCircle,
          color: 'text-lime-600',
          bgColor: 'bg-lime-50'
        }
      ]
    },
    {
      category: 'Project Management',
      color: 'purple',
      cards: [
        {
          title: 'Total Projects',
          value: stats.totalProjects,
          icon: FolderKanban,
          color: 'text-purple-600',
          bgColor: 'bg-purple-50'
        },
        {
          title: 'Active Projects',
          value: stats.activeProjects,
          icon: FileCheck,
          color: 'text-pink-600',
          bgColor: 'bg-pink-50'
        },
        {
          title: 'Enrollments',
          value: stats.totalProjectEnrollments,
          icon: Users,
          color: 'text-violet-600',
          bgColor: 'bg-violet-50'
        },
        {
          title: 'Confirmed',
          value: stats.confirmedProjectEnrollments,
          icon: UserCheck,
          color: 'text-cyan-600',
          bgColor: 'bg-cyan-50'
        }
      ]
    }
  ];

  return (
    <div className="space-y-6 mb-8">
      {/* Revenue Card - Full Width */}
      <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl shadow-sm p-8 border-2 border-yellow-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-yellow-100 p-4 rounded-xl">
              <DollarSign className="w-10 h-10 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Revenue</p>
              <p className="text-4xl font-bold text-gray-800">
                ₹{stats.totalRevenue.toLocaleString('en-IN')}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                From {stats.completedPayments} completed payments
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Grouped Cards */}
      {cardGroups.map((group, groupIndex) => (
        <div key={groupIndex} className="space-y-3">
          <div className="flex items-center gap-2">
            <h3 className={`text-lg font-semibold text-${group.color}-700`}>
              {group.category}
            </h3>
            <div className={`h-1 flex-1 bg-${group.color}-200 rounded`}></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {group.cards.map((card, cardIndex) => {
              const Icon = card.icon;
              return (
                <div 
                  key={cardIndex}
                  className="bg-white rounded-xl shadow-sm p-5 hover:shadow-lg transition-all duration-200"
                  style={{ backgroundColor: "rgb(185, 185, 185)" }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-xs font-medium text-gray-600 mb-2">
                        {card.title}
                      </p>
                      <p className="text-3xl font-bold text-gray-800">
                        {card.value}
                      </p>
                    </div>
                    <div className={`${card.bgColor} p-3 rounded-lg`}>
                      <Icon className={`w-5 h-5 ${card.color}`} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
// // frontend/src/app/components/admin/StatsCards.js
// 'use client';
// import React, { useState } from 'react';
// import { 
//   BookOpen, 
//   Eye, 
//   Briefcase, 
//   CheckCircle, 
//   FolderKanban, 
//   Users, 
//   CreditCard, 
//   Check, 
//   DollarSign,
//   FileCheck,
//   UserCheck,
//   X
// } from 'lucide-react';

// export default function StatsCards({ stats, courses = [], internships = [], projects = [] }) {
//   const [showModal, setShowModal] = useState(false);
//   const [modalData, setModalData] = useState(null);

//   const cardGroups = [
//     {
//       category: 'Training & Placement',
//       color: 'blue',
//       cards: [
//         {
//           title: 'Total Courses',
//           value: stats.totalCourses,
//           icon: BookOpen,
//           color: 'text-blue-600',
//           bgColor: 'bg-blue-50'
//         },
//         {
//           title: 'Active Courses',
//           value: stats.activeCourses,
//           icon: Eye,
//           color: 'text-green-600',
//           bgColor: 'bg-green-50'
//         },
//         {
//           title: 'Course Payments',
//           value: stats.totalPayments,
//           icon: CreditCard,
//           color: 'text-orange-600',
//           bgColor: 'bg-orange-50'
//         },
//         {
//           title: 'Completed Payments',
//           value: stats.completedPayments,
//           icon: Check,
//           color: 'text-emerald-600',
//           bgColor: 'bg-emerald-50'
//         }
//       ],
//       data: courses
//     },
//     {
//       category: 'Internship Management',
//       color: 'green',
//       cards: [
//         {
//           title: 'Total Internships',
//           value: stats.totalInternships,
//           icon: Briefcase,
//           color: 'text-indigo-600',
//           bgColor: 'bg-indigo-50'
//         },
//         {
//           title: 'Active Internships',
//           value: stats.activeInternships,
//           icon: CheckCircle,
//           color: 'text-teal-600',
//           bgColor: 'bg-teal-50'
//         },
//         {
//           title: 'Applications',
//           value: stats.totalInternshipApplications,
//           icon: FileCheck,
//           color: 'text-amber-600',
//           bgColor: 'bg-amber-50'
//         },
//         {
//           title: 'Approved',
//           value: stats.approvedInternshipApplications,
//           icon: CheckCircle,
//           color: 'text-lime-600',
//           bgColor: 'bg-lime-50'
//         }
//       ],
//       data: internships
//     },
//     {
//       category: 'Project Management',
//       color: 'purple',
//       cards: [
//         {
//           title: 'Total Projects',
//           value: stats.totalProjects,
//           icon: FolderKanban,
//           color: 'text-purple-600',
//           bgColor: 'bg-purple-50'
//         },
//         {
//           title: 'Active Projects',
//           value: stats.activeProjects,
//           icon: FileCheck,
//           color: 'text-pink-600',
//           bgColor: 'bg-pink-50'
//         },
//         {
//           title: 'Enrollments',
//           value: stats.totalProjectEnrollments,
//           icon: Users,
//           color: 'text-violet-600',
//           bgColor: 'bg-violet-50'
//         },
//         {
//           title: 'Confirmed',
//           value: stats.confirmedProjectEnrollments,
//           icon: UserCheck,
//           color: 'text-cyan-600',
//           bgColor: 'bg-cyan-50'
//         }
//       ],
//       data: projects
//     }
//   ];

//   const handleCardClick = (group) => {
//     setModalData(group);
//     setShowModal(true);
//   };

//   return (
//     <>
//       <div className="space-y-6 mb-8">
//         {/* Revenue Card - Full Width */}
//         <div 
//           className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl shadow-sm p-8 border-2 border-yellow-200"
//         >
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-4">
//               <div className="bg-yellow-100 p-4 rounded-xl">
//                 <DollarSign className="w-10 h-10 text-yellow-600" />
//               </div>
//               <div>
//                 <p className="text-sm font-medium text-gray-600 mb-1">Total Revenue</p>
//                 <p className="text-4xl font-bold text-gray-800">
//                   ₹{stats.totalRevenue.toLocaleString('en-IN')}
//                 </p>
//                 <p className="text-sm text-gray-500 mt-1">
//                   From {stats.completedPayments} completed payments
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Grouped Cards */}
//         {cardGroups.map((group, groupIndex) => (
//           <div key={groupIndex} className="space-y-3">
//             <div className="flex items-center gap-2">
//               <h3 className={`text-lg font-semibold text-${group.color}-700`}>
//                 {group.category}
//               </h3>
//               <div className={`h-1 flex-1 bg-${group.color}-200 rounded`}></div>
//             </div>
            
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//               {group.cards.map((card, cardIndex) => {
//                 const Icon = card.icon;
//                 return (
//                   <div 
//                     key={cardIndex}
//                     onClick={() => handleCardClick(group)}
//                     className="bg-white rounded-xl shadow-sm p-5 hover:shadow-lg transition-all duration-200 cursor-pointer transform hover:-translate-y-1"
//                     style={{ backgroundColor: "rgb(185, 185, 185)" }}
//                   >
//                     <div className="flex items-start justify-between">
//                       <div className="flex-1">
//                         <p className="text-xs font-medium text-gray-600 mb-2">
//                           {card.title}
//                         </p>
//                         <p className="text-3xl font-bold text-gray-800">
//                           {card.value}
//                         </p>
//                       </div>
//                       <div className={`${card.bgColor} p-3 rounded-lg`}>
//                         <Icon className={`w-5 h-5 ${card.color}`} />
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Modal */}
//       {showModal && modalData && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
//             {/* Modal Header */}
//             <div className={`bg-${modalData.color}-600 text-white p-6 flex items-center justify-between`}>
//               <h2 className="text-2xl font-bold">{modalData.category}</h2>
//               <button 
//                 onClick={() => setShowModal(false)}
//                 className="hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
//               >
//                 <X className="w-6 h-6" />
//               </button>
//             </div>

//             {/* Modal Body */}
//             <div className="p-6 overflow-y-auto max-h-[calc(80vh-100px)]">
//               {modalData.data && modalData.data.length > 0 ? (
//                 <div className="space-y-4">
//                   {modalData.data.map((item, index) => (
//                     <div 
//                       key={index}
//                       className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
//                     >
//                       <div className="flex items-start justify-between">
//                         <div className="flex-1">
//                           <h3 className="font-semibold text-lg text-gray-800 mb-2">
//                             {item.title}
//                           </h3>
//                           <div className="grid grid-cols-2 gap-3 text-sm">
//                             <div>
//                               <span className="text-gray-500">Category:</span>
//                               <span className="ml-2 font-medium text-gray-700">
//                                 {item.category}
//                               </span>
//                             </div>
//                             {item.duration && (
//                               <div>
//                                 <span className="text-gray-500">Duration:</span>
//                                 <span className="ml-2 font-medium text-gray-700">
//                                   {item.duration}
//                                 </span>
//                               </div>
//                             )}
//                             {item.price !== undefined && (
//                               <div>
//                                 <span className="text-gray-500">Price:</span>
//                                 <span className="ml-2 font-medium text-gray-700">
//                                   ₹{item.price.toLocaleString('en-IN')}
//                                 </span>
//                               </div>
//                             )}
//                             <div>
//                               <span className="text-gray-500">Status:</span>
//                               <span className={`ml-2 font-medium ${item.is_active ? 'text-green-600' : 'text-red-600'}`}>
//                                 {item.is_active ? 'Active' : 'Inactive'}
//                               </span>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <div className="text-center py-12 text-gray-500">
//                   <p className="text-lg">No data available</p>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }

// // // // frontend/src/app/components/admin/StatsCards.js
// // // 'use client';
// // // import React from 'react';
// // // import {
// // //   BookOpen,
// // //   Eye,
// // //   Briefcase,
// // //   CheckCircle,
// // //   FolderKanban,
// // //   Users,
// // //   CreditCard,
// // //   Check,
// // //   DollarSign,
// // //   FileCheck,
// // //   UserCheck
// // // } from 'lucide-react';

// // // export default function StatsCards({ stats }) {
// // //   const cards = [
// // //     // Courses Section
// // //     {
// // //       title: 'Total Courses',
// // //       value: stats.totalCourses,
// // //       icon: BookOpen,
// // //       color: 'text-blue-600',
// // //       bgColor: 'bg-blue-50'
// // //     },
// // //     {
// // //       title: 'Active Courses',
// // //       value: stats.activeCourses,
// // //       icon: Eye,
// // //       color: 'text-green-600',
// // //       bgColor: 'bg-green-50'
// // //     },

// // //     // Internships Section
// // //     {
// // //       title: 'Total Internships',
// // //       value: stats.totalInternships,
// // //       icon: Briefcase,
// // //       color: 'text-indigo-600',
// // //       bgColor: 'bg-indigo-50'
// // //     },
// // //     {
// // //       title: 'Active Internships',
// // //       value: stats.activeInternships,
// // //       icon: CheckCircle,
// // //       color: 'text-teal-600',
// // //       bgColor: 'bg-teal-50'
// // //     },

// // //     // Projects Section
// // //     {
// // //       title: 'Total Projects',
// // //       value: stats.totalProjects,
// // //       icon: FolderKanban,
// // //       color: 'text-purple-600',
// // //       bgColor: 'bg-purple-50'
// // //     },
// // //     {
// // //       title: 'Active Projects',
// // //       value: stats.activeProjects,
// // //       icon: FileCheck,
// // //       color: 'text-pink-600',
// // //       bgColor: 'bg-pink-50'
// // //     },

// // //     // Payments Section
// // //     {
// // //       title: 'Course Payments',
// // //       value: stats.totalPayments,
// // //       icon: CreditCard,
// // //       color: 'text-orange-600',
// // //       bgColor: 'bg-orange-50'
// // //     },
// // //     {
// // //       title: 'Completed Payments',
// // //       value: stats.completedPayments,
// // //       icon: Check,
// // //       color: 'text-emerald-600',
// // //       bgColor: 'bg-emerald-50'
// // //     },

// // //     // Enrollments Section
// // //     {
// // //       title: 'Project Enrollments',
// // //       value: stats.totalProjectEnrollments,
// // //       icon: Users,
// // //       color: 'text-violet-600',
// // //       bgColor: 'bg-violet-50'
// // //     },
// // //     {
// // //       title: 'Confirmed Enrollments',
// // //       value: stats.confirmedProjectEnrollments,
// // //       icon: UserCheck,
// // //       color: 'text-cyan-600',
// // //       bgColor: 'bg-cyan-50'
// // //     },

// // //     // Internship Applications Section
// // //     {
// // //       title: 'Internship Applications',
// // //       value: stats.totalInternshipApplications,
// // //       icon: FileCheck,
// // //       color: 'text-amber-600',
// // //       bgColor: 'bg-amber-50'
// // //     },
// // //     {
// // //       title: 'Approved Applications',
// // //       value: stats.approvedInternshipApplications,
// // //       icon: CheckCircle,
// // //       color: 'text-lime-600',
// // //       bgColor: 'bg-lime-50'
// // //     },

// // //     // Revenue Section
// // //     {
// // //       title: 'Total Revenue',
// // //       value: `₹${stats.totalRevenue.toLocaleString('en-IN')}`,
// // //       icon: DollarSign,
// // //       color: 'text-yellow-600',
// // //       bgColor: 'bg-yellow-50'
// // //     }
// // //   ];

// // //   return (
// // //     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8">
// // //       {cards.map((card, index) => {
// // //         const Icon = card.icon;
// // //         return (
// // //           <div
// // //             key={index}
// // //             className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-200"
// // //             style={{ backgroundColor: "rgb(185, 185, 185)" }}
// // //           >
// // //             <div className="flex items-start justify-between">
// // //               <div className="flex-1">
// // //                 <p className="text-sm font-medium text-gray-600 mb-2">{card.title}</p>
// // //                 <p className="text-2xl font-bold text-gray-800">{card.value}</p>
// // //               </div>
// // //               <div className={`${card.bgColor} p-3 rounded-lg`}>
// // //                 <Icon className={`w-6 h-6 ${card.color}`} />
// // //               </div>
// // //             </div>
// // //           </div>
// // //         );
// // //       })}
// // //     </div>
// // //   );
// // // }