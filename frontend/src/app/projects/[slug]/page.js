// frontend/src/app/projects/[slug]/page.js
'use client';
import React, { useState, useEffect } from 'react';
import { Check, CreditCard, Smartphone, Zap, ArrowLeft, Clock, Users, Code, AlertCircle, Layers, Upload, X, ImageIcon, DollarSign, Tag, Star } from 'lucide-react';
import Layout from '@/components/Layout';

const API_BASE_URL = 'http://localhost:7000';

const DynamicProjectPaymentPage = ({ params }) => {
  const [selectedOption, setSelectedOption] = useState('neft'); 
  const [currentProject, setCurrentProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [imageError, setImageError] = useState(false);
  const [paymentScreenshot, setPaymentScreenshot] = useState(null);
  const [screenshotPreview, setScreenshotPreview] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    gstin: '',
    billing_address: '',
    landmark: '',
    district: '',
    state: '',
    preferred_start_date: '',
    preferred_time: 'Morning',
    team_size: '1',
    validation_code: '',
    payment_method: 'neft'
  });

  const paymentOptions = [
    { id: 'neft', name: 'NEFT', icon: <CreditCard className="w-5 h-5" />, recommended: true },
    { id: 'gpay', name: 'GPay', icon: <Smartphone className="w-5 h-5" />, recommended: true },
    { id: 'razorpay', name: 'Razorpay', icon: <Zap className="w-5 h-5" />, recommended: false }
  ];

  const bankDetails = {
    accountName: 'PclInfotech Private Limited',
    accountNo: '50200017071542',
    ifscCode: 'HDFC0000444',
    micrCode: '600240018',
    swiftCode: 'HDFCINBB',
    branch: 'senneerkuppam, Chennai'
  };

  useEffect(() => {
    if (params?.slug) {
      fetchProjectDetails(params.slug);
    }
  }, [params]);

  const fetchProjectDetails = async (slug) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/projects/${slug}`);
      const data = await response.json();
      
      if (data.success) {
        setCurrentProject(data.project);
      } else {
        setError('Project not found');
      }
    } catch (err) {
      console.error('Error fetching project:', err);
      setError('Failed to load project details');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(''); // Clear error when user types
  };

  const handlePaymentOptionChange = (optionId) => {
    setSelectedOption(optionId);
    setFormData(prev => ({ ...prev, payment_method: optionId }));
  };

  const handleScreenshotChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setError('Please select a valid image file (JPG, PNG, GIF, or WebP)');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError('Screenshot size should be less than 5MB');
        return;
      }

      setPaymentScreenshot(file);
      const reader = new FileReader();
      reader.onloadend = () => setScreenshotPreview(reader.result);
      reader.readAsDataURL(file);
      setError('');
    }
  };

  const removeScreenshot = () => {
    setPaymentScreenshot(null);
    setScreenshotPreview(null);
  };

  const validateForm = () => {
    const required = ['name', 'email', 'mobile'];
    for (let field of required) {
      if (!formData[field].trim()) {
        setError(`${field.charAt(0).toUpperCase() + field.slice(1)} is required`);
        return false;
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(formData.mobile.replace(/\s/g, ''))) {
      setError('Please enter a valid 10-digit mobile number');
      return false;
    }

    if (formData.validation_code.toLowerCase() !== 'm2nz') {
      setError('Please enter the correct validation code: m2NZ');
      return false;
    }

    if ((selectedOption === 'neft' || selectedOption === 'gpay') && !paymentScreenshot) {
      setError('Please upload payment screenshot for NEFT/GPay payment');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setSubmitting(true);
    setError('');
    
    try {
      const submitData = new FormData();
      
      // Add all form fields
      submitData.append('project_slug', currentProject.slug);
      submitData.append('name', formData.name.trim());
      submitData.append('email', formData.email.trim());
      submitData.append('mobile', formData.mobile.trim());
      submitData.append('gstin', formData.gstin.trim());
      submitData.append('billing_address', formData.billing_address.trim());
      submitData.append('landmark', formData.landmark.trim());
      submitData.append('district', formData.district.trim() || 'Not specified');
      submitData.append('state', formData.state.trim() || 'Not specified');
      submitData.append('preferred_start_date', formData.preferred_start_date);
      submitData.append('preferred_time', formData.preferred_time);
      submitData.append('team_size', formData.team_size);
      submitData.append('payment_method', formData.payment_method);
      submitData.append('validation_code', formData.validation_code.toLowerCase());
      
      // Add screenshot if exists
      if (paymentScreenshot) {
        submitData.append('payment_screenshot', paymentScreenshot);
      }

      console.log('Submitting enrollment...');
      
      const response = await fetch(`${API_BASE_URL}/api/project-enrollments`, {
        method: 'POST',
        body: submitData
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit enrollment');
      }

      if (data.success) {
        setSuccess(`Enrollment submitted successfully! Your Enrollment ID: ${data.enrollment_id}`);
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          mobile: '',
          gstin: '',
          billing_address: '',
          landmark: '',
          district: '',
          state: '',
          preferred_start_date: '',
          preferred_time: 'Morning',
          team_size: '1',
          validation_code: '',
          payment_method: 'neft'
        });
        setPaymentScreenshot(null);
        setScreenshotPreview(null);
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Redirect after 3 seconds
        setTimeout(() => {
          window.location.href = '/projects';
        }, 3000);
      }
    } catch (err) {
      console.error('Submission error:', err);
      setError(err.message || 'Failed to submit enrollment. Please try again.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setSubmitting(false);
    }
  };

  const renderPaymentDetails = () => {
    if (selectedOption === 'neft' || selectedOption === 'gpay') {
      return (
        <div className="mt-6 p-6 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            {selectedOption === 'neft' ? 'Pay Using NEFT' : 'Account Transfer (GPay)'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-600">Account Name:</span>
              <p className="text-gray-800 mt-1">{bankDetails.accountName}</p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Account No:</span>
              <p className="text-gray-800 mt-1 font-mono">{bankDetails.accountNo}</p>
            </div>
            <div>
              <span className="font-medium text-gray-600">IFSC Code:</span>
              <p className="text-gray-800 mt-1 font-mono">{bankDetails.ifscCode}</p>
            </div>
            <div>
              <span className="font-medium text-gray-600">MICR Code:</span>
              <p className="text-gray-800 mt-1 font-mono">{bankDetails.micrCode}</p>
            </div>
          </div>
          
          <div className="mt-6 border-t pt-6">
            <h4 className="text-md font-semibold text-gray-800 mb-3 flex items-center">
              <Upload className="w-5 h-5 mr-2 text-blue-600" />
              Upload Payment Screenshot *
            </h4>
            
            {!screenshotPreview ? (
              <div className="border-2 border-dashed border-blue-300 rounded-lg p-6 bg-white">
                <div className="flex flex-col items-center justify-center">
                  <ImageIcon className="w-12 h-12 text-blue-400 mb-3" />
                  <label className="cursor-pointer">
                    <span className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 inline-flex items-center gap-2">
                      <Upload className="w-4 h-4" />
                      Choose Screenshot
                    </span>
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                      onChange={handleScreenshotChange}
                      className="hidden"
                    />
                  </label>
                  <p className="text-sm text-gray-500 mt-2">JPG, PNG, GIF or WebP (Max 5MB)</p>
                </div>
              </div>
            ) : (
              <div className="relative">
                <img
                  src={screenshotPreview}
                  alt="Payment Screenshot"
                  className="w-full max-h-64 object-contain rounded-lg border-2 border-blue-200"
                />
                <button
                  type="button"
                  onClick={removeScreenshot}
                  className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
          
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> Upload payment screenshot and submit to complete enrollment.
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

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
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading project details...</p>
        </div>
      </div>
    );
  }

  if (!currentProject) {
    return (
      <Layout>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Project Not Found</h2>
          <p className="text-gray-600 mb-4">{error || 'The requested project could not be found.'}</p>
          <button
            onClick={() => window.location.href = '/projects'}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Projects
          </button>
        </div>
      </div>
      </Layout>
    );
  }

  return (
    <Layout>
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={() => window.location.href = '/projects'}
          className="mb-6 flex items-center text-blue-600 hover:text-blue-700 font-medium"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Projects
        </button>

        {success && (
          <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-6 py-4 rounded-lg">
            <div className="flex items-center">
              <Check className="w-5 h-5 mr-2" />
              {success}
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              {error}
            </div>
          </div>
        )}

        {/* Project Header */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-purple-600 to-blue-700 px-8 py-6">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center mb-2 flex-wrap gap-2">
                  <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {currentProject.category}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getDifficultyColor(currentProject.difficulty_level)}`}>
                    {currentProject.difficulty_level}
                  </span>
                </div>
                <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">{currentProject.title}</h1>
                <p className="text-blue-100 mb-4">{currentProject.detailed_description}</p>
                
                <div className="flex flex-wrap gap-4 text-sm text-blue-100">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>{currentProject.duration}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-2" />
                    <span>{currentProject.total_enrollments || 0} Enrolled</span>
                  </div>
                  {currentProject.rating && (
                    <div className="flex items-center">
                      <Star className="w-4 h-4 mr-1 fill-yellow-400 text-yellow-400" />
                      <span>{currentProject.rating} Rating</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Section */}
        {currentProject.price && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border-2 border-blue-200">
            <div className="flex items-center mb-4">
              <DollarSign className="w-6 h-6 text-blue-600 mr-2" />
              <h3 className="text-xl font-semibold text-gray-800">Project Pricing</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {currentProject.original_price && (
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Original Price</div>
                  <div className="text-2xl font-bold text-gray-400 line-through">
                    ₹{currentProject.original_price}
                  </div>
                </div>
              )}
              
              <div className="text-center p-4 bg-blue-50 rounded-lg border-2 border-blue-300">
                <div className="text-sm text-blue-600 mb-1 font-medium">Current Price</div>
                <div className="text-3xl font-bold text-blue-600">
                  ₹{currentProject.price}
                </div>
                {currentProject.discount && (
                  <div className="mt-2">
                    <span className="inline-flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                      <Tag className="w-3 h-3 mr-1" />
                      {currentProject.discount}% OFF
                    </span>
                  </div>
                )}
              </div>
              
              {currentProject.total_amount && (
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-sm text-purple-600 mb-1 font-medium">Total Amount</div>
                  <div className="text-3xl font-bold text-purple-600">
                    ₹{currentProject.total_amount}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Enrollment Form */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-blue-700 px-8 py-6">
            <h2 className="text-2xl font-bold text-white">Complete Your Enrollment</h2>
            <p className="text-blue-100 mt-2">Choose payment method and fill in your details</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8">
            {/* Payment Options */}
            <div className="space-y-4 mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment Options</h3>
              {paymentOptions.map((option) => (
                <div
                  key={option.id}
                  className={`relative border-2 rounded-xl p-4 cursor-pointer transition-all ${
                    selectedOption === option.id
                      ? 'border-purple-500 bg-purple-50 shadow-md'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handlePaymentOptionChange(option.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {option.icon}
                      <span className="font-medium text-gray-800">{option.name}</span>
                      {option.recommended && (
                        <span className="bg-yellow-400 text-yellow-800 text-xs font-bold px-2 py-1 rounded">
                          Recommended
                        </span>
                      )}
                    </div>
                    {selectedOption === option.id && (
                      <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {renderPaymentDetails()}

            {/* Personal Details */}
            <div className="mt-8 space-y-8">
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Personal Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mobile *</label>
                    <input
                      type="tel"
                      className="w-full px-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      value={formData.mobile}
                      onChange={(e) => handleInputChange('mobile', e.target.value)}
                      placeholder="10-digit mobile number"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                    <input
                      type="email"
                      className="w-full px-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Team Size</label>
                    <select 
                      className="w-full px-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      value={formData.team_size}
                      onChange={(e) => handleInputChange('team_size', e.target.value)}
                    >
                      <option value="1">Individual</option>
                      <option value="2">Team of 2</option>
                      <option value="3">Team of 3</option>
                      <option value="4">Team of 4</option>
                      <option value="5+">5+ members</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Start Date</label>
                    <input
                      type="date"
                      className="w-full px-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      value={formData.preferred_start_date}
                      onChange={(e) => handleInputChange('preferred_start_date', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Time</label>
                    <select 
                      className="w-full px-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      value={formData.preferred_time}
                      onChange={(e) => handleInputChange('preferred_time', e.target.value)}
                    >
                      <option value="Morning">Morning (9 AM - 12 PM)</option>
                      <option value="Afternoon">Afternoon (12 PM - 3 PM)</option>
                      <option value="Evening">Evening (3 PM - 6 PM)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Billing Details (Optional) */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Billing Details (Optional)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">GSTIN</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      value={formData.gstin}
                      onChange={(e) => handleInputChange('gstin', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">District</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      value={formData.district}
                      onChange={(e) => handleInputChange('district', e.target.value)}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Billing Address</label>
                    <textarea
                      className="w-full px-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      rows="2"
                      value={formData.billing_address}
                      onChange={(e) => handleInputChange('billing_address', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Validation Code */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Validation Code *</h3>
                <div className="flex items-center space-x-4">
                  <div className="bg-white p-3 border-2 border-dashed border-gray-300 rounded-lg">
                    <div className="text-2xl font-bold text-gray-800">m2NZ</div>
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      className="w-full px-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      placeholder="Enter validation code"
                      value={formData.validation_code}
                      onChange={(e) => handleInputChange('validation_code', e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center pt-6">
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 px-12 rounded-xl transition-all disabled:opacity-50 flex items-center space-x-2"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Enrollment</span>
                      <Check className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
    </Layout>
  );
};

export default DynamicProjectPaymentPage;