
// 'use client';
// import React, { useState, useEffect } from 'react';
// import { Check, CreditCard, Smartphone, Zap, ArrowLeft, Star, Clock, Users, Book, AlertCircle, Upload, X, FileImage } from 'lucide-react';

// const DynamicPaymentPage = ({ params }) => {
//   const [selectedOption, setSelectedOption] = useState('neft');
//   const [currentCourse, setCurrentCourse] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [submitting, setSubmitting] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [imageError, setImageError] = useState(false);
//   const [screenshotFile, setScreenshotFile] = useState(null);
//   const [screenshotPreview, setScreenshotPreview] = useState(null);
  
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     mobile: '',
//     gstin: '',
//     billing_address: '',
//     landmark: '',
//     district: 'Same',
//     state: 'Same',
//     start_date: '',
//     training_mode: 'Online Training',
//     batch_preference: 'weekdays',
//     validation_code: '',
//     payment_method: 'neft'
//   });

//   const paymentOptions = [
//     { id: 'neft', name: 'NEFT', recommended: true },
//     { id: 'gpay', name: 'GPay', recommended: true },
//     { id: 'razorpay', name: 'Razorpay', recommended: false }
//   ];

//   const bankDetails = {
//     accountName: 'PclInfotech Private Limited',
//     accountNo: '50200017071542',
//     ifscCode: 'HDFC0000444',
//     micrCode: '600240018',
//     swiftCode: 'HDFCINBB',
//     branch: 'senneerkuppam, Chennai'
//   };

//   useEffect(() => {
//     const slug = params?.slug;
//     if (slug) {
//       fetchCourse(slug);
//     }
//   }, [params]);

//   const fetchCourse = async (slug) => {
//     setLoading(true);
//     setError('');
    
//     try {
//       const response = await fetch(`http://localhost:7000/api/courses/${slug}`);
//       const data = await response.json();
      
//       if (data.success) {
//         setCurrentCourse(data.course);
//         setImageError(false);
//       } else {
//         setError(data.error || 'Course not found');
//       }
//     } catch (err) {
//       setError('Failed to load course details');
//       console.error('Error fetching course:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleInputChange = (field, value) => {
//     setFormData(prev => ({ ...prev, [field]: value }));
//   };

//   const handlePaymentOptionChange = (optionId) => {
//     setSelectedOption(optionId);
//     setFormData(prev => ({ ...prev, payment_method: optionId }));
//   };

//   const handleScreenshotChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       if (file.size > 5 * 1024 * 1024) {
//         setError('Screenshot file size must be less than 5MB');
//         return;
//       }
      
//       const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
//       if (!validTypes.includes(file.type)) {
//         setError('Please upload a valid image file (JPG, PNG, GIF, or WebP)');
//         return;
//       }
      
//       setScreenshotFile(file);
      
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setScreenshotPreview(reader.result);
//       };
//       reader.readAsDataURL(file);
//       setError('');
//     }
//   };

//   const removeScreenshot = () => {
//     setScreenshotFile(null);
//     setScreenshotPreview(null);
//   };

//   const validateForm = () => {
//     const required = ['name', 'email', 'mobile'];
//     for (let field of required) {
//       if (!formData[field].trim()) {
//         setError(`${field.charAt(0).toUpperCase() + field.slice(1)} is required`);
//         return false;
//       }
//     }

//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(formData.email)) {
//       setError('Please enter a valid email address');
//       return false;
//     }

//     const mobileRegex = /^\d{10}$/;
//     if (!mobileRegex.test(formData.mobile.replace(/\D/g, ''))) {
//       setError('Please enter a valid 10-digit mobile number');
//       return false;
//     }

//     if (formData.validation_code.toLowerCase() !== 'm2nz') {
//       setError('Please enter the correct validation code');
//       return false;
//     }

//     if ((selectedOption === 'neft' || selectedOption === 'gpay') && !screenshotFile) {
//       if (!window.confirm('You have not uploaded a payment screenshot. It is recommended to upload proof of payment. Do you want to continue without it?')) {
//         return false;
//       }
//     }

//     return true;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!validateForm()) return;
//     if (!currentCourse) {
//       setError('Course information not available');
//       return;
//     }

//     setSubmitting(true);
//     setError('');
    
//     try {
//       const submitData = new FormData();
      
//       submitData.append('name', formData.name);
//       submitData.append('email', formData.email);
//       submitData.append('mobile', formData.mobile);
//       submitData.append('gstin', formData.gstin);
//       submitData.append('billing_address', formData.billing_address);
//       submitData.append('landmark', formData.landmark);
//       submitData.append('district', formData.district);
//       submitData.append('state', formData.state);
//       submitData.append('start_date', formData.start_date);
//       submitData.append('training_mode', formData.training_mode);
//       submitData.append('batch_preference', formData.batch_preference);
//       submitData.append('validation_code', formData.validation_code);
//       submitData.append('payment_method', formData.payment_method);
//       submitData.append('course_slug', currentCourse.slug);
      
//       if (screenshotFile) {
//         submitData.append('payment_screenshot', screenshotFile);
//       }

//       const response = await fetch('http://localhost:7000/api/payments', {
//         method: 'POST',
//         body: submitData,
//       });

//       const data = await response.json();
      
//       if (data.success) {
//         setSuccess(`Payment request submitted successfully! Payment ID: ${data.payment_id}. You will receive a confirmation email shortly.`);
//         setFormData({
//           name: '',
//           email: '',
//           mobile: '',
//           gstin: '',
//           billing_address: '',
//           landmark: '',
//           district: 'Same',
//           state: 'Same',
//           start_date: '',
//           training_mode: 'Online Training',
//           batch_preference: 'weekdays',
//           validation_code: '',
//           payment_method: selectedOption
//         });
//         setScreenshotFile(null);
//         setScreenshotPreview(null);
        
//         window.scrollTo({ top: 0, behavior: 'smooth' });
//       } else {
//         setError(data.error || 'Failed to submit payment request');
//       }
//     } catch (err) {
//       setError('Failed to submit payment request. Please try again.');
//       console.error('Payment submission error:', err);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
//           <p className="text-gray-600">Loading course details...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8">
//       <div className="max-w-6xl mx-auto px-4">
//         <button 
//           onClick={() => window.history.back()}
//           className="mb-6 flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200"
//         >
//           <ArrowLeft className="w-5 h-5 mr-2" />
//           Back to Courses
//         </button>

//         {success && (
//           <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-6 py-4 rounded-lg">
//             <div className="flex items-center">
//               <Check className="w-5 h-5 mr-2" />
//               {success}
//             </div>
//           </div>
//         )}

//         {error && (
//           <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg">
//             <div className="flex items-center">
//               <AlertCircle className="w-5 h-5 mr-2" />
//               {error}
//             </div>
//           </div>
//         )}

//         {currentCourse && (
//           <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
//             <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-6">
//               <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">{currentCourse.title}</h1>
//               <p className="text-blue-100 mb-4">{currentCourse.detailed_description}</p>
//               <div className="text-3xl font-bold text-white">₹{currentCourse.total_amount}</div>
//             </div>
//           </div>
//         )}

//         <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
//           <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-6">
//             <h2 className="text-2xl font-bold text-white">Complete Your Enrollment</h2>
//             <p className="text-blue-100 mt-2">Choose your payment method and fill in your details</p>
//           </div>

//           <form onSubmit={handleSubmit} className="p-8">
//             <div className="space-y-4 mb-8">
//               <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment Options</h3>
//               {paymentOptions.map((option, idx) => (
//                 <div
//                   key={option.id}
//                   className={`relative border-2 rounded-xl p-4 cursor-pointer transition-all duration-300 ${
//                     selectedOption === option.id
//                       ? 'border-blue-500 bg-blue-50 shadow-md'
//                       : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
//                   }`}
//                   onClick={() => handlePaymentOptionChange(option.id)}
//                 >
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center space-x-3">
//                       <span className="font-medium text-gray-800">
//                         Option {idx + 1}: {option.name}
//                       </span>
//                       {option.recommended && (
//                         <span className="bg-yellow-400 text-yellow-800 text-xs font-bold px-2 py-1 rounded">
//                           Recommended
//                         </span>
//                       )}
//                     </div>
//                     {selectedOption === option.id && (
//                       <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
//                         <Check className="w-3 h-3 text-white" />
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {(selectedOption === 'neft' || selectedOption === 'gpay') && (
//               <>
//                 <div className="mt-6 p-6 bg-blue-50 border border-blue-200 rounded-lg">
//                   <h3 className="text-lg font-semibold text-gray-800 mb-4">
//                     {selectedOption === 'neft' ? 'Pay Using NEFT' : 'Account Transfer (GPay)'}
//                   </h3>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
//                     <div>
//                       <span className="font-medium text-gray-600">Account Name:</span>
//                       <p className="text-gray-800 mt-1">{bankDetails.accountName}</p>
//                     </div>
//                     <div>
//                       <span className="font-medium text-gray-600">Account No:</span>
//                       <p className="text-gray-800 mt-1 font-mono">{bankDetails.accountNo}</p>
//                     </div>
//                     <div>
//                       <span className="font-medium text-gray-600">IFSC Code:</span>
//                       <p className="text-gray-800 mt-1 font-mono">{bankDetails.ifscCode}</p>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="mt-8 bg-gray-50 rounded-xl p-6">
//                   <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
//                     <Upload className="w-5 h-5 mr-2" />
//                     Upload Payment Screenshot (Optional but recommended)
//                   </h3>
                  
//                   {!screenshotPreview ? (
//                     <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all">
//                       <div className="flex flex-col items-center justify-center pt-5 pb-6">
//                         <FileImage className="w-12 h-12 text-gray-400 mb-3" />
//                         <p className="mb-2 text-sm text-gray-500">
//                           <span className="font-semibold">Click to upload</span> or drag and drop
//                         </p>
//                         <p className="text-xs text-gray-400">PNG, JPG, GIF or WebP (MAX. 5MB)</p>
//                       </div>
//                       <input
//                         type="file"
//                         className="hidden"
//                         accept="image/*"
//                         onChange={handleScreenshotChange}
//                       />
//                     </label>
//                   ) : (
//                     <div className="relative">
//                       <img
//                         src={screenshotPreview}
//                         alt="Payment Screenshot"
//                         className="w-full h-64 object-contain rounded-lg border border-gray-300"
//                       />
//                       <button
//                         type="button"
//                         onClick={removeScreenshot}
//                         className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
//                       >
//                         <X className="w-4 h-4" />
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               </>
//             )}

//             <div className="mt-8 space-y-8">
//               <div className="bg-gray-50 rounded-xl p-6">
//                 <h3 className="text-lg font-semibold text-gray-800 mb-4">Personal Details</h3>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
//                     <input
//                       type="text"
//                       className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                       value={formData.name}
//                       onChange={(e) => handleInputChange('name', e.target.value)}
//                       required
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Mobile *</label>
//                     <input
//                       type="tel"
//                       className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                       value={formData.mobile}
//                       onChange={(e) => handleInputChange('mobile', e.target.value)}
//                       required
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
//                     <input
//                       type="email"
//                       className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                       value={formData.email}
//                       onChange={(e) => handleInputChange('email', e.target.value)}
//                       required
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">GSTIN</label>
//                     <input
//                       type="text"
//                       className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                       value={formData.gstin}
//                       onChange={(e) => handleInputChange('gstin', e.target.value)}
//                     />
//                   </div>
//                 </div>
//               </div>

//               <div className="bg-gray-50 rounded-xl p-6">
//                 <h3 className="text-lg font-semibold text-gray-800 mb-4">Validation Code</h3>
//                 <div className="flex items-center space-x-4">
//                   <div className="bg-white p-3 border-2 border-dashed border-gray-300 rounded-lg">
//                     <div className="text-2xl font-bold text-gray-800">m2NZ</div>
//                   </div>
//                   <div className="flex-1">
//                     <input
//                       type="text"
//                       className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                       placeholder="Enter validation code"
//                       value={formData.validation_code}
//                       onChange={(e) => handleInputChange('validation_code', e.target.value)}
//                       required
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="mt-8 text-center">
//               <button 
//                 type="submit"
//                 disabled={submitting}
//                 className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-8 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 {submitting ? 'Processing...' : `Complete Enrollment - Pay Using ${selectedOption.toUpperCase()}`}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DynamicPaymentPage;


// frontend/src/app/projects/page.js
'use client';
import React, { useState, useEffect } from 'react';
import { Search, Filter, Code, Clock, Users, ChevronRight, Zap } from 'lucide-react';
import Layout from '@/components/Layout';

const API_BASE_URL = 'http://localhost:7000';

const getImageUrl = (imageUrl) => {
  if (!imageUrl) return '/api/placeholder/400/300';
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) return imageUrl;
  return `${API_BASE_URL}${imageUrl}`;
};

const DynamicProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    let filtered = projects;
    
    if (searchTerm) {
      filtered = filtered.filter(project => 
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(project => 
        project.category.toLowerCase() === categoryFilter.toLowerCase()
      );
    }
    
    if (difficultyFilter !== 'all') {
      filtered = filtered.filter(project => 
        project.difficulty_level.toLowerCase() === difficultyFilter.toLowerCase()
      );
    }
    
    setFilteredProjects(filtered);
  }, [projects, searchTerm, categoryFilter, difficultyFilter]);

  const fetchProjects = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/projects`);
      const data = await response.json();
      
      if (data.success) {
        setProjects(data.projects);
      } else {
        setError('Failed to fetch projects');
      }
    } catch (err) {
      setError('Failed to connect to backend server');
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleProjectClick = (projectSlug) => {
    window.location.href = `/projects/${projectSlug}`;
  };

  const categories = [...new Set(projects.map(project => project.category))];
  const difficulties = ['Beginner', 'Intermediate', 'Advanced'];

  const getDifficultyColor = (level) => {
    switch(level) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading projects...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg">
            <h2 className="text-xl font-bold mb-2">Error Loading Projects</h2>
            <p>{error}</p>
            <button 
              onClick={fetchProjects}
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Header */}
        <div className="relative bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full animate-pulse"></div>
            <div className="absolute top-32 right-20 w-16 h-16 bg-yellow-300 rounded-full animate-bounce"></div>
            <div className="absolute bottom-20 left-1/3 w-12 h-12 bg-green-300 rounded-full animate-ping"></div>
          </div>

          <div className="container mx-auto px-6 py-16 relative z-10">
            <div className="text-center text-white">
              <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                <Zap className="w-4 h-4 mr-2 text-yellow-300" />
                <span className="text-sm font-semibold">Build Real-World Projects</span>
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Hands-On <span className="text-yellow-300">Project</span> Experience
              </h1>
              
              <p className="text-xl mb-8 text-blue-100 max-w-3xl mx-auto">
                Build portfolio-worthy projects with industry-standard tools and technologies. 
                Learn by doing with our comprehensive project-based curriculum.
              </p>

              <div className="flex flex-wrap gap-6 justify-center mb-8">
                <div className="flex items-center">
                  <Code className="w-5 h-5 mr-2" />
                  <span>Real-World Projects</span>
                </div>
                <div className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  <span>Expert Guidance</span>
                </div>
                <div className="flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-yellow-300 fill-current" />
                  <span>Portfolio Ready</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="container mx-auto px-6 py-8">
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="relative">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="appearance-none bg-white text-black border border-gray-300 rounded-lg px-4 py-3 pr-10 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                <Filter className="absolute right-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>

              <div className="relative">
                <select
                  value={difficultyFilter}
                  onChange={(e) => setDifficultyFilter(e.target.value)}
                  className="appearance-none bg-white text-black border border-gray-300 rounded-lg px-4 py-3 pr-10 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Levels</option>
                  {difficulties.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
                <Filter className="absolute right-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div className="mt-4 text-sm text-gray-600">
              Showing {filteredProjects.length} of {projects.length} projects
              {searchTerm && ` for "${searchTerm}"`}
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="container mx-auto px-6 pb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Available Projects</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose from our curated collection of industry-relevant projects
            </p>
          </div>

          {filteredProjects.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-gray-500 text-lg mb-4">
                {searchTerm || categoryFilter !== 'all' || difficultyFilter !== 'all' 
                  ? 'No projects match your filters' 
                  : 'No projects available'}
              </div>
              {(searchTerm || categoryFilter !== 'all' || difficultyFilter !== 'all') && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setCategoryFilter('all');
                    setDifficultyFilter('all');
                  }}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project) => (
                <div 
                  key={project.id} 
                  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden group cursor-pointer" 
                  onClick={() => handleProjectClick(project.slug)}
                >
                  {/* Project Image */}
                  <div className="relative w-full h-48 overflow-hidden bg-gradient-to-br from-purple-500 to-blue-600">
                    <img 
                      src={getImageUrl(project.image_url)} 
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                    
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="absolute top-4 left-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getDifficultyColor(project.difficulty_level)}`}>
                        {project.difficulty_level}
                      </span>
                    </div>
                    <div className="absolute top-4 right-4">
                      <span className="bg-white/90 backdrop-blur-sm text-blue-600 px-3 py-1 rounded-full text-sm font-semibold">
                        {project.project_type}
                      </span>
                    </div>
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-600/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <button className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold transform scale-0 group-hover:scale-100 transition-transform duration-300 hover:bg-blue-50">
                        View Details
                      </button>
                    </div>
                  </div>

                  {/* Project Content */}
                  <div className="p-6">
                    <div className="mb-2">
                      <span className="text-purple-600 text-sm font-semibold">{project.category}</span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors">
                      {project.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {project.description}
                    </p>

                    {/* Technologies */}
                    {project.technologies && project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.technologies.slice(0, 3).map((tech, idx) => (
                          <span key={idx} className="bg-blue-50 text-blue-600 px-2 py-1 rounded text-xs font-medium">
                            {tech}
                          </span>
                        ))}
                        {project.technologies.length > 3 && (
                          <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-medium">
                            +{project.technologies.length - 3}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Stats */}
                    <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {project.duration}
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {project.total_enrollments || 0} enrolled
                      </div>
                    </div>

                    {/* Action Button */}
                    <button 
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center group"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleProjectClick(project.slug);
                      }}
                    >
                      Start Project
                      <ChevronRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 py-16">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Build Something Amazing?
            </h2>
            <p className="text-blue-100 text-xl mb-8 max-w-2xl mx-auto">
              Start working on real-world projects and build your portfolio today.
            </p>
            {/* <button className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-4 px-8 rounded-lg text-lg transition-all duration-300 transform hover:scale-105">
              Browse All Projects
            </button> */}
          </div>
        </div>
      </div>
      </Layout>
  );
};

export default DynamicProjectsPage;