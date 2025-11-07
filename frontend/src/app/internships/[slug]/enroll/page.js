// frontend/src/app/internships/[slug]/enroll/page.js
'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Upload, CheckCircle, AlertCircle, Calendar, Clock } from 'lucide-react';
import Layout from '@/components/Layout';

const InternshipEnrollmentPage = () => {
  const params = useParams();
  const router = useRouter();
  const [internship, setInternship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    fname: '',
    lname: '',
    email: '',
    mobile: '',
    experience_level: 'Fresher',
    portfolio_url: '',
    github_url: '',
    motivation: '',
    resume: null,
    gstin: '',
    billing_address: '',
    landmark: '',
    district: '',
    state: '',
    preferred_start_date: '',
    preferred_time: 'Full-Time',
    availability: 'Immediate',
    validation_code: ''
  });

  useEffect(() => {
    if (params.slug) {
      fetchInternshipDetails();
    }
  }, [params.slug]);

  const fetchInternshipDetails = async () => {
    try {
      const response = await fetch(`http://localhost:7000/api/internships/${params.slug}`);
      const data = await response.json();
      if (data.success) {
        setInternship(data.internship);
      } else {
        setError('Failed to load internship details');
      }
    } catch (error) {
      console.error('Error fetching internship:', error);
      setError('Failed to load internship details');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Resume file size should not exceed 5MB');
        e.target.value = ''; // Clear the input
        return;
      }
      
      // Validate file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        setError('Please upload resume in PDF, DOC, or DOCX format');
        e.target.value = ''; // Clear the input
        return;
      }
      
      setFormData(prev => ({ ...prev, resume: file }));
      setError('');
    }
  };

  const validateForm = () => {
    // Required field validation
    if (!formData.fname.trim()) {
      setError('First name is required');
      return false;
    }
    
    if (!formData.lname.trim()) {
      setError('Last name is required');
      return false;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    
    // Mobile validation
    const mobileRegex = /^\d{10}$/;
    if (!mobileRegex.test(formData.mobile)) {
      setError('Please enter a valid 10-digit mobile number');
      return false;
    }
    
    // Resume validation
    if (!formData.resume) {
      setError('Please upload your resume');
      return false;
    }
    
    // Motivation validation
    if (!formData.motivation.trim()) {
      setError('Please provide your motivation');
      return false;
    }
    
    if (formData.motivation.trim().length < 50) {
      setError('Please provide a detailed motivation (minimum 50 characters)');
      return false;
    }
    
    // Validation code check
    if (formData.validation_code.trim().toLowerCase() !== 'm2nz') {
      setError('Invalid validation code. Please enter: m2nz');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('=== Form Submission Started ===');
    console.log('Form data:', {
      ...formData,
      resume: formData.resume ? formData.resume.name : 'No file'
    });
    
    if (!validateForm()) {
      console.log('Validation failed');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      // Create FormData object
      const submitData = new FormData();
      
      // Append all text fields (only non-empty values)
      const textFields = [
        'fname', 'lname', 'email', 'mobile', 'experience_level',
        'portfolio_url', 'github_url', 'motivation', 'gstin',
        'billing_address', 'landmark', 'district', 'state',
        'preferred_start_date', 'preferred_time', 'availability',
        'validation_code'
      ];
      
      textFields.forEach(field => {
        const value = formData[field];
        if (value && value.toString().trim() !== '') {
          submitData.append(field, value.toString().trim());
        }
      });
      
      // Append internship slug
      submitData.append('internship_slug', params.slug);
      
      // Append resume file
      if (formData.resume) {
        submitData.append('resume', formData.resume);
        console.log('Resume appended:', formData.resume.name, formData.resume.size, 'bytes');
      }
      
      // Log FormData contents (for debugging)
      console.log('FormData contents:');
      for (let [key, value] of submitData.entries()) {
        if (value instanceof File) {
          console.log(`${key}: [File] ${value.name} (${value.size} bytes)`);
        } else {
          console.log(`${key}: ${value}`);
        }
      }

      console.log('Sending request to server...');
      const response = await fetch('http://localhost:7000/api/internship-applications', {
        method: 'POST',
        body: submitData
        // Don't set Content-Type header - browser will set it with boundary for FormData
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (response.ok && data.success) {
        console.log('Application submitted successfully!');
        setSuccess(true);
        setTimeout(() => {
          router.push('/internships');
        }, 3000);
      } else {
        const errorMessage = data.error || data.details || 'Failed to submit application';
        console.error('Submission failed:', errorMessage);
        setError(errorMessage);
      }
    } catch (err) {
      console.error('=== Submission Error ===');
      console.error('Error details:', err);
      setError('Failed to submit application. Please check your connection and try again.');
    } finally {
      setSubmitting(false);
      console.log('=== Form Submission Ended ===');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!internship) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Internship Not Found</h2>
          <p className="text-gray-600 mb-4">The internship you're looking for doesn't exist.</p>
          <button
            onClick={() => router.push('/internships')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Internships
          </button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted!</h2>
          <p className="text-gray-600 mb-4">
            Thank you for applying to {internship.title}. We've received your application and will review it shortly.
          </p>
          <p className="text-sm text-gray-500">
            Redirecting to internships page...
          </p>
        </div>
      </div>
    );
  }

  return (
    <Layout>
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Internship Details
          </button>
          
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Apply for {internship.title}
            </h1>
            <p className="text-gray-600">
              Fill out the form below to apply for this internship opportunity
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
            <AlertCircle className="w-5 h-5 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-red-800 text-sm font-medium">{error}</p>
            </div>
            <button
              onClick={() => setError('')}
              className="text-red-600 hover:text-red-800 ml-2"
            >
              ×
            </button>
          </div>
        )}

        {/* Application Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  value={formData.fname}
                  onChange={(e) => handleInputChange('fname', e.target.value)}
                  placeholder="Enter your first name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  value={formData.lname}
                  onChange={(e) => handleInputChange('lname', e.target.value)}
                  placeholder="Enter your last name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  pattern="[0-9]{10}"
                  maxLength="10"
                  placeholder="10-digit number"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  value={formData.mobile}
                  onChange={(e) => handleInputChange('mobile', e.target.value.replace(/\D/g, ''))}
                />
              </div>
            </div>
          </div>

          {/* Professional Information */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Professional Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Experience Level <span className="text-red-500">*</span>
                </label>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  value={formData.experience_level}
                  onChange={(e) => handleInputChange('experience_level', e.target.value)}
                >
                  <option value="Fresher">Fresher</option>
                  <option value="0-1 Years">0-1 Years</option>
                  <option value="1-2 Years">1-2 Years</option>
                  <option value="2+ Years">2+ Years</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Resume <span className="text-red-500">*</span> (PDF, DOC, DOCX - Max 5MB)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    required
                    onChange={handleFileChange}
                    className="hidden"
                    id="resume-upload"
                  />
                  <label
                    htmlFor="resume-upload"
                    className="cursor-pointer text-blue-600 hover:text-blue-700 font-medium"
                  >
                    {formData.resume ? (
                      <span className="text-green-600">✓ {formData.resume.name}</span>
                    ) : (
                      'Click to upload your resume'
                    )}
                  </label>
                  <p className="text-xs text-gray-500 mt-2">
                    Accepted formats: PDF, DOC, DOCX (Max 5MB)
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Portfolio URL (Optional)
                  </label>
                  <input
                    type="url"
                    placeholder="https://yourportfolio.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    value={formData.portfolio_url}
                    onChange={(e) => handleInputChange('portfolio_url', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    GitHub Profile (Optional)
                  </label>
                  <input
                    type="url"
                    placeholder="https://github.com/username"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    value={formData.github_url}
                    onChange={(e) => handleInputChange('github_url', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Why do you want this internship? <span className="text-red-500">*</span> (Minimum 50 characters)
                </label>
                <textarea
                  required
                  rows="5"
                  placeholder="Tell us about your motivation and what you hope to gain from this internship..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  value={formData.motivation}
                  onChange={(e) => handleInputChange('motivation', e.target.value)}
                />
                <p className={`text-xs mt-1 ${formData.motivation.length >= 50 ? 'text-green-600' : 'text-gray-500'}`}>
                  {formData.motivation.length}/50 characters {formData.motivation.length >= 50 ? '✓' : 'required'}
                </p>
              </div>
            </div>
          </div>

          {/* Billing Information (Optional) */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Billing Information
            </h2>
            <p className="text-sm text-gray-600 mb-4">(Optional - For Paid Internships)</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  GSTIN (Optional)
                </label>
                <input
                  type="text"
                  placeholder="22AAAAA0000A1Z5"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  value={formData.gstin}
                  onChange={(e) => handleInputChange('gstin', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Billing Address
                </label>
                <textarea
                  rows="2"
                  placeholder="Enter your billing address"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  value={formData.billing_address}
                  onChange={(e) => handleInputChange('billing_address', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Landmark
                  </label>
                  <input
                    type="text"
                    placeholder="Near..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    value={formData.landmark}
                    onChange={(e) => handleInputChange('landmark', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    District
                  </label>
                  <input
                    type="text"
                    placeholder="Enter district"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    value={formData.district}
                    onChange={(e) => handleInputChange('district', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State
                  </label>
                  <input
                    type="text"
                    placeholder="Enter state"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Internship Preferences */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Internship Preferences</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Start Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="date"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    value={formData.preferred_start_date}
                    onChange={(e) => handleInputChange('preferred_start_date', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Time
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <select
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    value={formData.preferred_time}
                    onChange={(e) => handleInputChange('preferred_time', e.target.value)}
                  >
                    <option value="Full-Time">Full-Time</option>
                    <option value="Part-Time">Part-Time</option>
                    <option value="Flexible">Flexible</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Availability
                </label>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  value={formData.availability}
                  onChange={(e) => handleInputChange('availability', e.target.value)}
                >
                  <option value="Immediate">Immediate</option>
                  <option value="Within 2 Weeks">Within 2 Weeks</option>
                  <option value="Within 1 Month">Within 1 Month</option>
                  <option value="Flexible">Flexible</option>
                </select>
              </div>
            </div>
          </div>

          {/* Validation Code */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Verification</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Validation Code <span className="text-red-500">*</span> (Enter: <span className="font-mono bg-gray-100 px-2 py-1 rounded">m2nz</span>)
              </label>
              <input
                type="text"
                required
                placeholder="Enter validation code"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 font-mono"
                value={formData.validation_code}
                onChange={(e) => handleInputChange('validation_code', e.target.value)}
                maxLength="4"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.back()}
              disabled={submitting}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center min-w-[180px] justify-center"
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Submitting...
                </>
              ) : (
                <>
                  Submit Application
                  <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
    </Layout>
  );
};

export default InternshipEnrollmentPage;

// // frontend/src/app/internships/[slug]/enroll/page.js
// 'use client';
// import React, { useState, useEffect } from 'react';
// import { useParams, useRouter } from 'next/navigation';
// import { ArrowLeft, Upload, CheckCircle, AlertCircle, Calendar, Clock, Users, CreditCard } from 'lucide-react';

// const InternshipEnrollmentPage = () => {
//   const params = useParams();
//   const router = useRouter();
//   const [internship, setInternship] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [submitting, setSubmitting] = useState(false);
//   const [success, setSuccess] = useState(false);
//   const [error, setError] = useState('');

//   const [formData, setFormData] = useState({
//     fname: '',
//     lname: '',
//     email: '',
//     mobile: '',
//     experience_level: 'Fresher',
//     portfolio_url: '',
//     github_url: '',
//     motivation: '',
//     resume: null,
//     gstin: '',
//     billing_address: '',
//     landmark: '',
//     district: '',
//     state: '',
//     preferred_start_date: '',
//     preferred_time: 'Full-Time',
//     availability: 'Immediate',
//     validation_code: ''
//   });

//   useEffect(() => {
//     if (params.slug) {
//       fetchInternshipDetails();
//     }
//   }, [params.slug]);

//   const fetchInternshipDetails = async () => {
//     try {
//       const response = await fetch(`http://localhost:7000/api/internships/${params.slug}`);
//       const data = await response.json();
//       if (data.success) {
//         setInternship(data.internship);
//       }
//     } catch (error) {
//       console.error('Error fetching internship:', error);
//       setError('Failed to load internship details');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleInputChange = (field, value) => {
//     setFormData(prev => ({ ...prev, [field]: value }));
//     setError('');
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       if (file.size > 5 * 1024 * 1024) {
//         setError('Resume file size should not exceed 5MB');
//         return;
//       }
//       if (!file.name.match(/\.(pdf|doc|docx)$/)) {
//         setError('Please upload resume in PDF, DOC, or DOCX format');
//         return;
//       }
//       setFormData(prev => ({ ...prev, resume: file }));
//       setError('');
//     }
//   };

//   const validateForm = () => {
//     if (!formData.fname.trim() || !formData.lname.trim()) {
//       setError('Please enter your full name');
//       return false;
//     }
//     if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
//       setError('Please enter a valid email address');
//       return false;
//     }
//     if (!formData.mobile.match(/^\d{10}$/)) {
//       setError('Please enter a valid 10-digit mobile number');
//       return false;
//     }
//     if (!formData.resume) {
//       setError('Please upload your resume');
//       return false;
//     }
//     if (!formData.motivation.trim() || formData.motivation.length < 50) {
//       setError('Please provide a detailed motivation (minimum 50 characters)');
//       return false;
//     }
//     if (formData.validation_code.toLowerCase() !== 'm2nz') {
//       setError('Invalid validation code');
//       return false;
//     }
//     return true;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!validateForm()) {
//       return;
//     }

//     setSubmitting(true);
//     setError('');

//     try {
//       const submitData = new FormData();
      
//       // Append all form fields
//       Object.keys(formData).forEach(key => {
//         if (formData[key] !== null && formData[key] !== '') {
//           submitData.append(key, formData[key]);
//         }
//       });
      
//       submitData.append('internship_slug', params.slug);

//       const response = await fetch('http://localhost:7000/api/internship-applications', {
//         method: 'POST',
//         body: submitData
//       });

//       const data = await response.json();

//       if (data.success) {
//         setSuccess(true);
//         setTimeout(() => {
//           router.push('/internships');
//         }, 3000);
//       } else {
//         setError(data.error || 'Failed to submit application');
//       }
//     } catch (err) {
//       console.error('Submission error:', err);
//       setError('Failed to submit application. Please try again.');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//       </div>
//     );
//   }

//   if (success) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
//         <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
//           <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
//             <CheckCircle className="w-10 h-10 text-green-600" />
//           </div>
//           <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted!</h2>
//           <p className="text-gray-600 mb-4">
//             Thank you for applying to {internship?.title}. We've received your application and will review it shortly.
//           </p>
//           <p className="text-sm text-gray-500">
//             Redirecting to internships page...
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Header */}
//         <div className="mb-6">
//           <button
//             onClick={() => router.back()}
//             className="flex items-center text-blue-600 hover:text-blue-700 mb-4"
//           >
//             <ArrowLeft className="w-4 h-4 mr-2" />
//             Back to Internship Details
//           </button>
          
//           <div className="bg-white rounded-xl shadow-sm p-6">
//             <h1 className="text-2xl font-bold text-gray-900 mb-2">
//               Apply for {internship?.title}
//             </h1>
//             <p className="text-gray-600">
//               Fill out the form below to apply for this internship opportunity
//             </p>
//           </div>
//         </div>

//         {/* Error Alert */}
//         {error && (
//           <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
//             <AlertCircle className="w-5 h-5 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
//             <p className="text-red-800 text-sm">{error}</p>
//           </div>
//         )}

//         {/* Application Form */}
//         <form onSubmit={handleSubmit} className="space-y-6">
//           {/* Personal Information */}
//           <div className="bg-white rounded-xl shadow-sm p-6">
//             <h2 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h2>
            
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   First Name *
//                 </label>
//                 <input
//                   type="text"
//                   required
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
//                   value={formData.fname}
//                   onChange={(e) => handleInputChange('fname', e.target.value)}
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Last Name *
//                 </label>
//                 <input
//                   type="text"
//                   required
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
//                   value={formData.lname}
//                   onChange={(e) => handleInputChange('lname', e.target.value)}
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Email Address *
//                 </label>
//                 <input
//                   type="email"
//                   required
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
//                   value={formData.email}
//                   onChange={(e) => handleInputChange('email', e.target.value)}
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Mobile Number *
//                 </label>
//                 <input
//                   type="tel"
//                   required
//                   pattern="[0-9]{10}"
//                   placeholder="10-digit number"
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
//                   value={formData.mobile}
//                   onChange={(e) => handleInputChange('mobile', e.target.value)}
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Professional Information */}
//           <div className="bg-white rounded-xl shadow-sm p-6">
//             <h2 className="text-lg font-semibold text-gray-900 mb-4">Professional Information</h2>
            
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Experience Level *
//                 </label>
//                 <select
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
//                   value={formData.experience_level}
//                   onChange={(e) => handleInputChange('experience_level', e.target.value)}
//                 >
//                   <option value="Fresher">Fresher</option>
//                   <option value="0-1 Years">0-1 Years</option>
//                   <option value="1-2 Years">1-2 Years</option>
//                   <option value="2+ Years">2+ Years</option>
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Upload Resume * (PDF, DOC, DOCX - Max 5MB)
//                 </label>
//                 <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
//                   <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
//                   <input
//                     type="file"
//                     accept=".pdf,.doc,.docx"
//                     required
//                     onChange={handleFileChange}
//                     className="hidden"
//                     id="resume-upload"
//                   />
//                   <label
//                     htmlFor="resume-upload"
//                     className="cursor-pointer text-blue-600 hover:text-blue-700"
//                   >
//                     {formData.resume ? formData.resume.name : 'Click to upload your resume'}
//                   </label>
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Portfolio URL (Optional)
//                   </label>
//                   <input
//                     type="url"
//                     placeholder="https://yourportfolio.com"
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
//                     value={formData.portfolio_url}
//                     onChange={(e) => handleInputChange('portfolio_url', e.target.value)}
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     GitHub Profile (Optional)
//                   </label>
//                   <input
//                     type="url"
//                     placeholder="https://github.com/username"
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
//                     value={formData.github_url}
//                     onChange={(e) => handleInputChange('github_url', e.target.value)}
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Why do you want this internship? * (Minimum 50 characters)
//                 </label>
//                 <textarea
//                   required
//                   rows="4"
//                   placeholder="Tell us about your motivation and what you hope to gain from this internship..."
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
//                   value={formData.motivation}
//                   onChange={(e) => handleInputChange('motivation', e.target.value)}
//                 />
//                 <p className="text-xs text-gray-500 mt-1">
//                   {formData.motivation.length}/50 characters minimum
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Billing Information (Optional) */}
//           <div className="bg-white rounded-xl shadow-sm p-6">
//             <h2 className="text-lg font-semibold text-gray-900 mb-4">
//               Billing Information (Optional - For Paid Internships)
//             </h2>
            
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   GSTIN (Optional)
//                 </label>
//                 <input
//                   type="text"
//                   placeholder="22AAAAA0000A1Z5"
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
//                   value={formData.gstin}
//                   onChange={(e) => handleInputChange('gstin', e.target.value)}
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Billing Address
//                 </label>
//                 <textarea
//                   rows="2"
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
//                   value={formData.billing_address}
//                   onChange={(e) => handleInputChange('billing_address', e.target.value)}
//                 />
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Landmark
//                   </label>
//                   <input
//                     type="text"
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
//                     value={formData.landmark}
//                     onChange={(e) => handleInputChange('landmark', e.target.value)}
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     District
//                   </label>
//                   <input
//                     type="text"
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
//                     value={formData.district}
//                     onChange={(e) => handleInputChange('district', e.target.value)}
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     State
//                   </label>
//                   <input
//                     type="text"
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
//                     value={formData.state}
//                     onChange={(e) => handleInputChange('state', e.target.value)}
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Internship Preferences */}
//           <div className="bg-white rounded-xl shadow-sm p-6">
//             <h2 className="text-lg font-semibold text-gray-900 mb-4">Internship Preferences</h2>
            
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Preferred Start Date
//                 </label>
//                 <div className="relative">
//                   <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
//                   <input
//                     type="date"
//                     className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
//                     value={formData.preferred_start_date}
//                     onChange={(e) => handleInputChange('preferred_start_date', e.target.value)}
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Preferred Time
//                 </label>
//                 <div className="relative">
//                   <Clock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
//                   <select
//                     className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
//                     value={formData.preferred_time}
//                     onChange={(e) => handleInputChange('preferred_time', e.target.value)}
//                   >
//                     <option value="Full-Time">Full-Time</option>
//                     <option value="Part-Time">Part-Time</option>
//                     <option value="Flexible">Flexible</option>
//                   </select>
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Availability
//                 </label>
//                 <select
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
//                   value={formData.availability}
//                   onChange={(e) => handleInputChange('availability', e.target.value)}
//                 >
//                   <option value="Immediate">Immediate</option>
//                   <option value="Within 2 Weeks">Within 2 Weeks</option>
//                   <option value="Within 1 Month">Within 1 Month</option>
//                   <option value="Flexible">Flexible</option>
//                 </select>
//               </div>
//             </div>
//           </div>

//           {/* Validation Code */}
//           <div className="bg-white rounded-xl shadow-sm p-6">
//             <h2 className="text-lg font-semibold text-gray-900 mb-4">Verification</h2>
            
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Validation Code * (Enter: m2nz)
//               </label>
//               <input
//                 type="text"
//                 required
//                 placeholder="Enter validation code"
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 uppercase"
//                 value={formData.validation_code}
//                 onChange={(e) => handleInputChange ('validation_code', e.target.value)}
//               />
//             </div>
//           </div>

//           {/* Submit Button */}
//           <div className="flex justify-end space-x-4">
//             <button
//               type="button"
//               onClick={() => router.back()}
//               className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={submitting}
//               className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
//             >
//               {submitting ? (
//                 <>
//                   <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
//                   Submitting...
//                 </>
//               ) : (
//                 <>
//                   Submit Application
//                   <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
//                 </>
//               )}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default InternshipEnrollmentPage;