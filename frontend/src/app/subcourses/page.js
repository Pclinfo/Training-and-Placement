// frontend/src/app/subcourses/page.js
'use client';
import React, { useState, useEffect } from 'react';
import { Star, Clock, Users, Calendar, ChevronRight, Search, Filter } from 'lucide-react';
import Layout from '@/components/Layout';
import ContactModelForm from '@/modelform/ContactModalForm';

// Configuration - Update this to match your backend URL
const API_BASE_URL = 'http://localhost:7000';

// Helper function to get full image URL
const getImageUrl = (imageUrl) => {
  if (!imageUrl) return '/api/placeholder/400/300';
  
  // If it's already a full URL (starts with http), return as is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  
  // If it's a relative path, prepend the API base URL
  return `${API_BASE_URL}${imageUrl}`;
};

const DynamicCoursesPage = () => {
  const [popup, setPopup] = useState(false);
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [levelFilter, setLevelFilter] = useState('all');
  
  // Dynamic offer countdown state
  const [timeLeft, setTimeLeft] = useState({
    days: 1,
    hours: 8,
    minutes: 23,
    seconds: 10
  });
  const [isOfferActive, setIsOfferActive] = useState(true);
  // Close popup on Escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setPopup(false);
      }
    };

    if (popup) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [popup]);

  const handlePopupOpen = () => {
    setPopup(true);
  };

  const handlePopupClose = () => {
    setPopup(false);
  };


  // Fetch courses from API
  useEffect(() => {
    fetchCourses();
  }, []);

  // Filter courses based on search and filters
  useEffect(() => {
    let filtered = courses;
    
    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(course => 
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(course => 
        course.category.toLowerCase() === categoryFilter.toLowerCase()
      );
    }
    
    // Level filter
    if (levelFilter !== 'all') {
      filtered = filtered.filter(course => 
        course.level.toLowerCase().includes(levelFilter.toLowerCase())
      );
    }
    
    setFilteredCourses(filtered);
  }, [courses, searchTerm, categoryFilter, levelFilter]);

  // Dynamic countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        } else {
          setIsOfferActive(false);
          return prev;
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/courses`);
      const data = await response.json();
      
      if (data.success) {
        setCourses(data.courses);
      } else {
        setError('Failed to fetch courses');
      }
    } catch (err) {
      setError('Failed to connect to backend server');
      console.error('Error fetching courses:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCourseClick = (courseSlug) => {
    window.location.href = `/subcourses/paymentoption/${courseSlug}`;
  };

  const handleViewDetails = (e, courseSlug) => {
    e.stopPropagation();
    handleCourseClick(courseSlug);
  };

  const handleEnrollNow = (e, courseSlug) => {
    e.stopPropagation();
    handleCourseClick(courseSlug);
  };

  // Get unique categories and levels for filters
  const categories = [...new Set(courses.map(course => course.category))];
  const levels = [...new Set(courses.map(course => course.level))];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading courses...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg">
            <h2 className="text-xl font-bold mb-2">Error Loading Courses</h2>
            <p>{error}</p>
            <button 
              onClick={fetchCourses}
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
      {/* Dynamic Header Section */}
      <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full animate-pulse"></div>
          <div className="absolute top-32 right-20 w-16 h-16 bg-yellow-300 rounded-full animate-bounce"></div>
          <div className="absolute bottom-20 left-1/3 w-12 h-12 bg-green-300 rounded-full animate-ping"></div>
        </div>

        <div className="container mx-auto px-6 py-16 relative z-10">
          {/* Dynamic Offer Banner */}
          {isOfferActive && (
            <div className="bg-red-500 text-white px-4 py-2 rounded-full inline-flex items-center mb-8 animate-pulse">
              <span className="w-2 h-2 bg-white rounded-full mr-2 animate-ping"></span>
              <span className="font-semibold">LIMITED TIME OFFER!</span>
            </div>
          )}

          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="lg:w-1/2 text-white mb-10 lg:mb-0">
              <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Master <span className="text-yellow-300 animate-pulse">Technology</span> Skills
              </h1>
              <p className="text-xl mb-8 text-blue-100">
                Join thousands of professionals who have transformed their careers with our 
                industry-leading online courses. Get up to 60% OFF on selected programs!
              </p>

              {/* Dynamic Stats */}
              <div className="flex flex-wrap gap-6 mb-8">
                <div className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  <span>50,000+ Students</span>
                </div>
                <div className="flex items-center">
                  <Star className="w-5 h-5 mr-2 text-yellow-300 fill-current" />
                  <span>Industry Certified</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  <span>4.9/5 Rating</span>
                </div>
              </div>
               <button
                onClick={handlePopupOpen}
                className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-4 px-8 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Start Learning Today
              </button>

              
            </div>

            {/* Dynamic Countdown Timer */}
            <div className="lg:w-1/2 flex justify-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <div className="text-center mb-4">
                  <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Offer Ends Soon!
                  </span>
                </div>
                
                <div className="grid grid-cols-4 gap-4 text-center">
                  {[
                    { label: 'Days', value: timeLeft.days },
                    { label: 'Hours', value: timeLeft.hours },
                    { label: 'Min', value: timeLeft.minutes },
                    { label: 'Sec', value: timeLeft.seconds }
                  ].map((item, index) => (
                    <div key={index} className="bg-white/20 rounded-lg p-4">
                      <div className="text-3xl font-bold text-white">{item.value.toString().padStart(2, '0')}</div>
                      <div className="text-blue-100 text-sm">{item.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters Section */}
      <div className="container mx-auto px-6 py-8">
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search courses, instructors, or categories..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="appearance-none bg-white text-black border border-gray-300 rounded-lg px-4 py-3 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <Filter className="absolute right-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>

            {/* Level Filter */}
            <div className="relative">
              <select
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value)}
                className="appearance-none bg-white text-black border border-gray-300 rounded-lg px-4 py-3 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Levels</option>
                {levels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
              <Filter className="absolute right-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Results count */}
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredCourses.length} of {courses.length} courses
            {searchTerm && ` for "${searchTerm}"`}
          </div>
        </div>
      </div>

      {/* Courses Section */}
      <div className="container mx-auto px-6 pb-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Courses</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose from our wide range of industry-relevant courses designed by experts and trusted by professionals worldwide
          </p>
        </div>

        {/* Dynamic Courses Grid */}
        {filteredCourses.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-500 text-lg mb-4">
              {searchTerm || categoryFilter !== 'all' || levelFilter !== 'all' 
                ? 'No courses match your filters' 
                : 'No courses available'}
            </div>
            {(searchTerm || categoryFilter !== 'all' || levelFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setCategoryFilter('all');
                  setLevelFilter('all');
                }}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course) => (
              <div key={course.id} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden group cursor-pointer" onClick={() => handleCourseClick(course.slug)} >
                {/* Course Image */}
                <div className="relative w-full h-48 overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600">
                  <img 
                    src={getImageUrl(course.image_url)} 
                    alt={course.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      // Hide broken image and show gradient background
                      e.target.style.display = 'none';
                    }}
                  />
                  
                  {/* Overlay content */}
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur-sm text-blue-600 px-3 py-1 rounded-full text-sm font-semibold">
                      {course.level}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <div className="flex items-center bg-white/90 backdrop-blur-sm rounded-full px-2 py-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                      <span className="text-sm font-semibold">{course.rating}</span>
                    </div>
                  </div>
                  
                  {/* Animated overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-600/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <button 
                      className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold transform scale-0 group-hover:scale-100 transition-transform duration-300 hover:bg-blue-50"
                      onClick={(e) => handleViewDetails(e, course.slug)}
                    >
                      View Details
                    </button>
                  </div>
                </div>

                {/* Course Content */}
                <div className="p-6">
                  <div className="mb-2">
                    <span className="text-blue-600 text-sm font-semibold">{course.category}</span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors">
                    {course.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {course.description}
                  </p>

                  {/* Course Stats */}
                  <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {course.students}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {course.duration}
                    </div>
                  </div>

                  {/* Instructor */}
                  <div className="text-sm text-gray-600 mb-4">
                    By {course.instructor}
                  </div>

                  {/* Pricing */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-2xl font-bold text-blue-600">₹{course.total_amount}</span>
                      {course.original_price && (
                        <span className="text-gray-400 line-through ml-2">₹{(parseFloat(course.total_amount) * 2).toLocaleString()}</span>
                      )}
                    </div>
                    {course.discount && (
                      <span className="bg-red-500 text-white px-2 py-1 rounded text-sm font-semibold">
                        {course.discount}
                      </span>
                    )}
                  </div>

                  {/* Course Features Preview */}
                  {course.features && course.features.length > 0 && (
                    <div className="mb-4">
                      <div className="text-sm text-gray-600">
                        ✓ {course.features[0]}
                      </div>
                      {course.features.length > 1 && (
                        <div className="text-sm text-gray-600">
                          ✓ {course.features[1]}
                        </div>
                      )}
                      {course.features.length > 2 && (
                        <div className="text-sm text-gray-500">
                          +{course.features.length - 2} more features
                        </div>
                      )}
                    </div>
                  )}

                  {/* Enroll Button */}
                  <button 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center group"
                    onClick={(e) => handleEnrollNow(e, course.slug)}
                  >
                    Enroll Now
                    <ChevronRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Call to Action Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your Career?
          </h2>
          <p className="text-blue-100 text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who have already upgraded their skills and advanced their careers.
          </p>
          <button 
                onClick={handlePopupOpen} className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-4 px-8 rounded-lg text-lg transition-all duration-300 transform hover:scale-105">
            Get Started Today
          </button>
        </div>
      </div>
    </div>
     {/* Popup Form */}
      {popup && (
        <div className='fixed inset-0 flex items-center justify-center z-[9999] animate-fade-in'>
          <div className='absolute inset-0  bg-opacity-50 backdrop-blur-sm' onClick={handlePopupClose}></div>
          <div className='relative bg-white rounded-lg max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto shadow-2xl'>
            <ContactModelForm close={handlePopupClose} />
          </div>
        </div>
      )}
    </Layout>
  );
};

export default DynamicCoursesPage;