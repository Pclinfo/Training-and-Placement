  // frontend/src/app/subcourses/paymentoption/[slug]/page.js
  'use client';
  import React, { useState, useEffect, use } from 'react';
  import { ChevronDown, Check, CreditCard, Smartphone, Zap, ArrowLeft, Star, Clock, Users, Book, AlertCircle, Upload, X } from 'lucide-react';
  import Layout from '@/components/Layout';

  const DynamicPaymentPage = ({ params }) => {
    const unwrappedParams = use(params);
    
    const [selectedOption, setSelectedOption] = useState('neft');
    const [currentCourse, setCurrentCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [imageError, setImageError] = useState(false);
    
    // NEW: Screenshot upload state
    const [paymentScreenshot, setPaymentScreenshot] = useState(null);
    const [screenshotPreview, setScreenshotPreview] = useState(null);
    const [screenshotError, setScreenshotError] = useState('');
    
    const [formData, setFormData] = useState({
      name: '',
      email: '',
      mobile: '',
      gstin: '',
      billing_address: '',
      landmark: '',
      district: 'Same',
      state: 'Same',
      start_date: '',
      training_mode: 'Online Training',
      batch_preference: 'weekdays',
      validation_code: '',
      payment_method: 'neft'
    });

    const paymentOptions = [
      {
        id: 'neft',
        name: 'NEFT',
        icon: <CreditCard className="w-5 h-5" />,
        recommended: true
      },
      {
        id: 'gpay',
        name: 'GPay',
        icon: <Smartphone className="w-5 h-5" />,
        recommended: true
      },
      {
        id: 'razorpay',
        name: 'Razorpay',
        icon: <Zap className="w-5 h-5" />,
        recommended: false
      }
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
      if (unwrappedParams?.slug) {
        fetchCourse(unwrappedParams.slug);
      }
    }, [unwrappedParams?.slug]);

    const fetchCourse = async (slug) => {
      setLoading(true);
      setError('');
      
      try {
        const response = await fetch(`http://localhost:7000/api/courses/${slug}`);
        const data = await response.json();
        
        if (data.success) {
          setCurrentCourse(data.course);
          setImageError(false);
          setFormData(prev => ({
            ...prev,
            payment_method: selectedOption
          }));
        } else {
          setError(data.error || 'Course not found');
        }
      } catch (err) {
        setError('Failed to load course details');
        console.error('Error fetching course:', err);
      } finally {
        setLoading(false);
      }
    };

    const handleInputChange = (field, value) => {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    };

    const handlePaymentOptionChange = (optionId) => {
      setSelectedOption(optionId);
      setFormData(prev => ({
        ...prev,
        payment_method: optionId
      }));
    };

    // NEW: Handle screenshot file selection
    const handleScreenshotChange = (e) => {
      const file = e.target.files[0];
      setScreenshotError('');
      
      if (!file) {
        setPaymentScreenshot(null);
        setScreenshotPreview(null);
        return;
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setScreenshotError('Please upload a valid image file (JPG, PNG, GIF, or WebP)');
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setScreenshotError('File size must be less than 5MB');
        return;
      }

      setPaymentScreenshot(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshotPreview(reader.result);
      };
      reader.readAsDataURL(file);
    };

    // NEW: Remove screenshot
    const removeScreenshot = () => {
      setPaymentScreenshot(null);
      setScreenshotPreview(null);
      setScreenshotError('');
      // Reset file input
      const fileInput = document.getElementById('payment_screenshot');
      if (fileInput) fileInput.value = '';
    };

    const handleGoBack = () => {
      window.history.back();
    };

    const handleImageError = () => {
      setImageError(true);
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

      const mobileRegex = /^\d{10}$/;
      if (!mobileRegex.test(formData.mobile.replace(/\D/g, ''))) {
        setError('Please enter a valid 10-digit mobile number');
        return false;
      }

      if (formData.validation_code.toLowerCase() !== 'm2nz') {
        setError('Please enter the correct validation code');
        return false;
      }

      // NEW: Validate screenshot for NEFT/GPay
      if ((selectedOption === 'neft' || selectedOption === 'gpay') && !paymentScreenshot) {
        setError('Please upload payment screenshot for NEFT/GPay payments');
        return false;
      }

      return true;
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      
      if (!validateForm()) return;
      if (!currentCourse) {
        setError('Course information not available');
        return;
      }

      setSubmitting(true);
      setError('');
      
      try {
        // NEW: Use FormData for file upload
        const formDataToSend = new FormData();
        
        // Append all form fields
        Object.keys(formData).forEach(key => {
          formDataToSend.append(key, formData[key]);
        });
        
        // Append course slug
        formDataToSend.append('course_slug', currentCourse.slug);
        
        // NEW: Append payment screenshot if available
        if (paymentScreenshot) {
          formDataToSend.append('payment_screenshot', paymentScreenshot);
        }

        const response = await fetch('http://localhost:7000/api/payments', {
          method: 'POST',
          body: formDataToSend, // Send FormData instead of JSON
        });

        const data = await response.json();
        
        if (data.success) {
          setSuccess(`Payment request submitted successfully! Payment ID: ${data.payment_id}. You will receive a confirmation email shortly.`);
          
          // Reset form
          setFormData({
            name: '',
            email: '',
            mobile: '',
            gstin: '',
            billing_address: '',
            landmark: '',
            district: 'Same',
            state: 'Same',
            start_date: '',
            training_mode: 'Online Training',
            batch_preference: 'weekdays',
            validation_code: '',
            payment_method: selectedOption
          });
          
          // Reset screenshot
          removeScreenshot();
          
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          setError(data.error || 'Failed to submit payment request');
        }
      } catch (err) {
        setError('Failed to submit payment request. Please try again.');
        console.error('Payment submission error:', err);
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
              <div>
                <span className="font-medium text-gray-600">Swift Code:</span>
                <p className="text-gray-800 mt-1 font-mono">{bankDetails.swiftCode}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Branch:</span>
                <p className="text-gray-800 mt-1">{bankDetails.branch}</p>
              </div>
            </div>
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> After making the payment, please upload the payment screenshot below and submit this form to complete your enrollment.
              </p>
            </div>
          </div>
        );
      } else if (selectedOption === 'razorpay') {
        return (
          <div className="mt-6 p-6 bg-purple-50 border border-purple-200 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Pay with Razorpay</h3>
            <p className="text-gray-600">You will be redirected to Razorpay's secure payment gateway to complete your payment using credit card, debit card, UPI, or net banking.</p>
          </div>
        );
      }
      return null;
    };

    if (loading) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading course details...</p>
          </div>
        </div>
      );
    }

    if (error && !currentCourse && !success) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
          <div className="text-center">
            <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg">
              <h2 className="text-xl font-bold mb-2">Error</h2>
              <p>{error}</p>
              <button 
                onClick={handleGoBack}
                className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <button 
            onClick={handleGoBack}
            className="mb-6 flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Courses
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

          {currentCourse && (
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-6">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-semibold mr-3">
                        {currentCourse.category}
                      </span>
                      {currentCourse.discount && (
                        <span className="bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-sm font-bold">
                          {currentCourse.discount}
                        </span>
                      )}
                    </div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">{currentCourse.title}</h1>
                    <p className="text-blue-100 mb-4">{currentCourse.detailed_description}</p>
                    
                    <div className="flex flex-wrap gap-6 text-sm text-blue-100">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 mr-2 text-yellow-300 fill-current" />
                        <span>{currentCourse.rating} Rating</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-2" />
                        <span>{currentCourse.students} Students</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2" />
                        <span>{currentCourse.duration}</span>
                      </div>
                      <div className="flex items-center">
                        <Book className="w-4 h-4 mr-2" />
                        <span>By {currentCourse.instructor}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="lg:w-80 mt-6 lg:mt-0">
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                      <div className="w-full h-40 mb-4 rounded-lg overflow-hidden bg-gradient-to-br from-white/20 to-white/5">
                        {!imageError && currentCourse.image_url ? (
                          <img 
                            src={currentCourse.image_url}
                            alt={currentCourse.title}
                            className="w-full h-full object-cover"
                            onError={handleImageError}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <div className="text-center">
                              <Book className="w-12 h-12 text-white/70 mx-auto mb-2" />
                              <span className="text-white font-semibold text-sm">{currentCourse.category}</span>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-white mb-2">₹{currentCourse.total_amount}</div>
                        <div className="text-blue-200 line-through text-lg">₹{(parseFloat(currentCourse.total_amount) * 2.5).toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentCourse && currentCourse.features && Array.isArray(currentCourse.features) && currentCourse.features.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">What You'll Learn</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {currentCourse.features.map((feature, index) => (
                  <div key={index} className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-6">
              <h2 className="text-2xl font-bold text-white">Complete Your Enrollment</h2>
              <p className="text-blue-100 mt-2">Choose your payment method and fill in your details</p>
            </div>

            <form onSubmit={handleSubmit} className="p-8">
              {/* Payment Methods */}
              <div className="space-y-4 mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment Options</h3>
                {paymentOptions.map((option) => (
                  <div
                    key={option.id}
                    className={`relative border-2 rounded-xl p-4 cursor-pointer transition-all duration-300 ${
                      selectedOption === option.id
                        ? 'border-blue-500 bg-blue-50 shadow-md'
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                    }`}
                    onClick={() => handlePaymentOptionChange(option.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {option.icon}
                        <span className="font-medium text-gray-800">
                          Option {paymentOptions.indexOf(option) + 1}: {option.name}
                        </span>
                        {option.recommended && (
                          <span className="bg-yellow-400 text-yellow-800 text-xs font-bold px-2 py-1 rounded">
                            Recommended
                          </span>
                        )}
                      </div>
                      {selectedOption === option.id && (
                        <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {renderPaymentDetails()}

              {/* NEW: Payment Screenshot Upload Section */}
              {(selectedOption === 'neft' || selectedOption === 'gpay') && (
                <div className="mt-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <Upload className="w-5 h-5 mr-2 text-blue-600" />
                    Upload Payment Screenshot *
                  </h3>
                  
                  <div className="space-y-4">
                    {!screenshotPreview ? (
                      <div className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
                        <input
                          type="file"
                          id="payment_screenshot"
                          accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                          onChange={handleScreenshotChange}
                          className="hidden"
                        />
                        <label 
                          htmlFor="payment_screenshot" 
                          className="cursor-pointer flex flex-col items-center"
                        >
                          <Upload className="w-12 h-12 text-blue-500 mb-4" />
                          <span className="text-gray-700 font-medium mb-2">
                            Click to upload payment screenshot
                          </span>
                          <span className="text-sm text-gray-500">
                            Supported formats: JPG, PNG, GIF, WebP (Max 5MB)
                          </span>
                        </label>
                      </div>
                    ) : (
                      <div className="relative border-2 border-blue-300 rounded-lg p-4 bg-white">
                        <button
                          type="button"
                          onClick={removeScreenshot}
                          className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors z-10"
                          title="Remove screenshot"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <img
                          src={screenshotPreview}
                          alt="Payment Screenshot Preview"
                          className="w-full h-auto max-h-96 object-contain rounded-lg"
                        />
                        <div className="mt-3 text-center">
                          <p className="text-sm text-green-600 font-medium flex items-center justify-center">
                            <Check className="w-4 h-4 mr-1" />
                            Screenshot uploaded successfully
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {screenshotError && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <p className="text-sm text-red-600 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-2" />
                          {screenshotError}
                        </p>
                      </div>
                    )}
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="text-sm text-blue-800">
                        <strong>Important:</strong> Please ensure the screenshot clearly shows the payment details including amount, transaction ID, and date.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Rest of the form fields remain unchanged */}
              <div className="mt-8 space-y-8">
                {/* Personal Details */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">1</div>
                    Personal Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                      <input
                        type="text"
                        className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number *</label>
                      <input
                        type="tel"
                        className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={formData.mobile}
                        onChange={(e) => handleInputChange('mobile', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email ID *</label>
                      <input
                        type="email"
                        className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">GSTIN</label>
                      <input
                        type="text"
                        className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={formData.gstin}
                        onChange={(e) => handleInputChange('gstin', e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Billing Details */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">2</div>
                    Billing Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Billing Address</label>
                      <textarea
                        className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24"
                        value={formData.billing_address}
                        onChange={(e) => handleInputChange('billing_address', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Landmark</label>
                      <textarea
                        className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24"
                        value={formData.landmark}
                        onChange={(e) => handleInputChange('landmark', e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Batch Details */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">3</div>
                    Batch Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">District</label>
                      <select 
                        className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={formData.district}
                        onChange={(e) => handleInputChange('district', e.target.value)}
                      >
                        <option value="Same">Same</option>
                        <option value="Chennai">Chennai</option>
                        <option value="Bangalore">Bangalore</option>
                        <option value="Hyderabad">Hyderabad</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Start Date</label>
                      <input
                        type="date"
                        className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={formData.start_date}
                        onChange={(e) => handleInputChange('start_date', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Batch Preference</label>
                      <div className="flex items-center space-x-4">
                        <label className="flex items-center">
                          <input 
                            type="radio" 
                            name="batch_preference" 
                            value="weekdays"
                            className="mr-2"
                            checked={formData.batch_preference === 'weekdays'}
                            onChange={(e) => handleInputChange('batch_preference', e.target.value)}
                          />
                          <span className="text-sm text-gray-700">Week Days</span>
                        </label>
                        <label className="flex items-center">
                          <input 
                            type="radio" 
                            name="batch_preference" 
                            value="weekend"
                            className="mr-2"
                            checked={formData.batch_preference === 'weekend'}
                            onChange={(e) => handleInputChange('batch_preference', e.target.value)}
                          />
                          <span className="text-sm text-gray-700">Week End</span>
                        </label>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Training Mode</label>
                      <select 
                        className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={formData.training_mode}
                        onChange={(e) => handleInputChange('training_mode', e.target.value)}
                      >
                        <option value="Online Training">Online Training</option>
                        <option value="Offline Training">Offline Training</option>
                        <option value="Hybrid Training">Hybrid Training</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Validation Code */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">4</div>
                    Validation Code
                  </h3>
                  <div className="flex items-center space-x-4">
                    <div className="bg-white p-3 border-2 border-dashed border-gray-300 rounded-lg">
                      <div className="text-2xl font-bold text-gray-800">m2NZ</div>
                      <div className="text-xs text-gray-500">Enter the code shown here</div>
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Validation Code *</label>
                      <input
                        type="text"
                        className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter validation code"
                        value={formData.validation_code}
                        onChange={(e) => handleInputChange('validation_code', e.target.value)}
                        required
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        Cannot read the image? <span className="text-blue-500 cursor-pointer hover:underline">Click here to refresh</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Order Summary */}
                {currentCourse && (
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">5</div>
                      Order Summary
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-700">Course Name:</span>
                        <span className="text-gray-800">{currentCourse.title}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-700">Course Code:</span>
                        <span className="text-gray-800">{currentCourse.course_code}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-700">Course Fees:</span>
                        <span className="text-gray-800">{currentCourse.course_fees}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-700">SGST/UTGST 18%:</span>
                        <span className="text-gray-800">NIL</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-700">Duration:</span>
                        <span className="text-gray-800">{currentCourse.duration}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-700">Instructor:</span>
                        <span className="text-gray-800">{currentCourse.instructor}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-700">Payment Method:</span>
                        <span className="text-gray-800">{selectedOption.toUpperCase()}</span>
                      </div>
                      <hr className="my-3" />
                      <div className="flex justify-between text-lg font-semibold">
                        <span className="text-gray-800">Total:</span>
                        <span className="text-blue-600">₹{currentCourse.total_amount}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="mt-8 text-center">
                <button 
                  type="submit"
                  disabled={submitting}
                  className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-8 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mx-auto"
                >
                  {submitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    `Complete Enrollment - Pay Using ${selectedOption.toUpperCase()}`
                  )}
                </button>
              </div>

              {/* Footer Links */}
              <div className="mt-6 text-center text-sm text-gray-500">
                <p>I have read and agree to the <span className="text-blue-500 hover:underline cursor-pointer">Terms and Conditions</span>, <span className="text-blue-500 hover:underline cursor-pointer">Refund Policy</span>, and <span className="text-blue-500 hover:underline cursor-pointer">Privacy Policy</span></p>
              </div>
            </form>
          </div>
        </div>
      </div>
      </Layout>
    );
  };

  export default DynamicPaymentPage;