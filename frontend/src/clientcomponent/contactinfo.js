"use client";

import React, { useState, useEffect } from 'react';
import { Phone, Mail, MapPin, Send, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import Layout from '@/components/Layout';
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const ContactInfo = () => {
  const [formData, setFormData] = useState({
    fname: '',
    lname: '',
    email: '',
    mobile: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Fix hydration issue by ensuring client-side rendering
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    setIsSubmitted(false);

    try {
      // Simulate API call for demo - replace with your actual endpoint
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'https://api.example.com'}/pclinfo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setFormData({
          fname: '',
          lname: '',
          email: '',
          mobile: '',
          message: ''
        });
        setIsSubmitted(true);
        setTimeout(() => {
          setIsSubmitted(false);
        }, 5000);
      } else {
        setErrorMessage(data?.message || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      setErrorMessage('Network error. Please try again later.');
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading state during hydration
  if (!isClient) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        {/* Enhanced Header Section with Gradient */}
        <div className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 py-20 px-4 text-center overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-black bg-opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)',
              backgroundSize: '20px 20px'
            }}></div>
          </div>
          
          <div className="relative z-10">
            <h1 className="text-5xl md:text-6xl text-white font-bold mb-6 tracking-tight">
              Contact Us
              <span className="block text-2xl md:text-3xl font-normal text-blue-100 mt-2">
                Let's Build Something Amazing Together
              </span>
            </h1>
            <p className="text-blue-100 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
              At PCL INFOTECH, we're dedicated to providing innovative IT solutions and exceptional service to meet your technology needs. Whether you have a question, need support, or want to discuss how our services can benefit your business, we're here to help!
            </p>
          </div>
        </div>

        {/* Enhanced Contact Section */}
        <div className="max-w-7xl mx-auto px-4 py-20 relative -mt-10">
          <div className="flex flex-col xl:flex-row gap-8 bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
            {/* Enhanced Contact Information */}
            <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-gray-900 text-white p-10 xl:w-2/5 relative overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                  backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.3) 2px, transparent 0)',
                  backgroundSize: '30px 30px'
                }}></div>
              </div>
              
              <div className="relative z-10">
                <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                  Get In Touch
                </h2>
                <p className="mb-10 text-gray-300 text-lg">
                  Ready to transform your ideas into reality? Let's start the conversation!
                </p>

                <div className="space-y-8">
                  <div className="group">
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-white bg-opacity-5 backdrop-blur-sm border border-white border-opacity-10 hover:bg-opacity-10 transition-all duration-300">
                      <div className="p-3 bg-blue-500 rounded-lg group-hover:bg-blue-400 transition-colors duration-300">
                        <Phone className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-300 mb-1">Call us directly</p>
                        <div className="space-y-1">
                          <a href="tel:+917358791015" className="block text-white hover:text-blue-300 transition-colors duration-200 font-medium">
                            +91 73587 - 91015
                          </a>
                          <a href="tel:+917200074253" className="block text-white hover:text-blue-300 transition-colors duration-200 font-medium">
                            +91 72000 - 74253
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="group">
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-white bg-opacity-5 backdrop-blur-sm border border-white border-opacity-10 hover:bg-opacity-10 transition-all duration-300">
                      <div className="p-3 bg-green-500 rounded-lg group-hover:bg-green-400 transition-colors duration-300">
                        <Mail className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-300 mb-1">Email us</p>
                        <a href='mailto:pclinfotechltd@gmail.com' className="text-white hover:text-green-300 transition-colors duration-200 font-medium">
                          pclinfotechltd@gmail.com
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="group">
                    <div className="flex items-start gap-4 p-4 rounded-xl bg-white bg-opacity-5 backdrop-blur-sm border border-white border-opacity-10 hover:bg-opacity-10 transition-all duration-300">
                      <div className="p-3 bg-purple-500 rounded-lg group-hover:bg-purple-400 transition-colors duration-300">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-300 mb-1">Visit our Head office</p>
                        <div className="text-white font-medium leading-relaxed">
                          No.2/ 156, 1st Floor, Poonamalle-Avadi Road,<br />
                          Senneerkuppam, Chennai-56
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="group">
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-white bg-opacity-5 backdrop-blur-sm border border-white border-opacity-10 hover:bg-opacity-10 transition-all duration-300">
                      <div className="p-3 bg-orange-500 rounded-lg group-hover:bg-orange-400 transition-colors duration-300">
                        <Clock className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-300 mb-1">Office Hours</p>
                        <div className="text-white font-medium">
                          <p>Monday - Friday: 10 AM - 6 PM</p>
                          <p>Saturday & Sunday: Closed</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Contact Form */}
            <div className="p-10 xl:w-3/5">
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Send us a Message</h3>
                <p className="text-gray-600">Fill out the form below and we'll get back to you as soon as possible.</p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="group">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        name="fname"
                        value={formData.fname}
                        onChange={handleChange}
                        required
                        className="text-black w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 group-hover:border-gray-300 bg-gray-50 focus:bg-white"
                        placeholder="Enter your first name"
                      />
                    </div>
                    <div className="group">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        name="lname"
                        value={formData.lname}
                        onChange={handleChange}
                        required
                        className="text-black w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 group-hover:border-gray-300 bg-gray-50 focus:bg-white"
                        placeholder="Enter your last name"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="group">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="text-black w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 group-hover:border-gray-300 bg-gray-50 focus:bg-white"
                        placeholder="Enter your email"
                      />
                    </div>
                    <div className="group">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Phone Number
                      </label>
                            <PhoneInput
                            country={"in"}
                            value={formData.mobile}
                            onChange={(value) =>
                                setFormData((prev) => ({ ...prev, mobile: value }))
                            }
                            enableSearch={true}
                            inputClass="!w-full !h-12 !pl-12 !pr-3 !rounded-md !border !border-gray-300 focus:!border-blue-500 focus:!ring-2 focus:!ring-blue-500 text-black"
                            buttonClass="!border !border-gray-300 !rounded-l-md text-black"
                            dropdownClass="!bg-white text-black !border !border-gray-300 !shadow-lg !max-h-72 overflow-y-auto"
                            placeholder="Enter mobile number"
                        />
                    </div>
              
                  </div>

                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="text-black w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 group-hover:border-gray-300 bg-gray-50 focus:bg-white resize-none"
                      placeholder="Tell us about your project or how we can help you..."
                    />
                  </div>

                  {/* Enhanced Submit Button */}
                  <div className="flex justify-end pt-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`group relative px-8 py-4 rounded-xl font-semibold text-white transition-all duration-300 transform hover:scale-105 focus:scale-105 ${
                        isSubmitting 
                          ? 'bg-gray-400 cursor-not-allowed' 
                          : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {isSubmitting ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Submitting...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                            <span>Send Message</span>
                          </>
                        )}
                      </div>
                    </button>
                  </div>

                  {/* Enhanced Success / Error Messages */}
                  {isSubmitted && (
                    <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl text-green-800" suppressHydrationWarning>
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <p className="font-medium">Thank you! Your message has been sent successfully. We'll get back to you soon!</p>
                    </div>
                  )}
                  
                  {errorMessage && (
                    <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-800" suppressHydrationWarning>
                      <AlertCircle className="w-5 h-5 text-red-600" />
                      <p className="font-medium">{errorMessage}</p>
                    </div>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Additional Trust Elements */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors duration-300">
                <Phone className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Quick Response</h4>
              <p className="text-gray-600">We respond to all inquiries within 24 hours</p>
            </div>
            
            <div className="text-center group">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors duration-300">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Expert Consultation</h4>
              <p className="text-gray-600">Free consultation with our technical experts</p>
            </div>
            
            <div className="text-center group">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors duration-300">
                <Mail className="w-8 h-8 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Dedicated Support</h4>
              <p className="text-gray-600">Ongoing support throughout your project</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ContactInfo;