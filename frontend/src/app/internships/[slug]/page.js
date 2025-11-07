// frontend/src/app/internships/[slug]/page.js
'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MapPin, Clock, Briefcase, CheckCircle, Award, ArrowLeft } from 'lucide-react';
import Layout from '@/components/Layout';

const InternshipDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const [internship, setInternship] = useState(null);
  const [loading, setLoading] = useState(true);

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
      }
    } catch (error) {
      console.error('Error fetching internship details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyClick = () => {
    router.push(`/internships/${params.slug}/enroll`);
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
      <Layout>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Internship Not Found</h2>
          <p className="text-gray-600 mb-4">The internship you're looking for doesn't exist.</p>
          <a href="/internships" className="text-blue-600 hover:text-blue-700">
            ← Back to Internships
          </a>
        </div>
      </div>
      </Layout>
    );
  }

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return '/api/placeholder/1200/400';
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) return imageUrl;
    return imageUrl;
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'remote':
        return 'bg-green-100 text-green-800';
      case 'onsite':
        return 'bg-blue-100 text-blue-800';
      case 'hybrid':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Layout>
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-80 overflow-hidden">
        <img
          src={getImageUrl(internship.image_url)}
          alt={internship.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/api/placeholder/1200/400';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="p-8 border-b">
            <a href="/internships" className="text-blue-600 hover:text-blue-700 mb-4 inline-flex items-center">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Internships
            </a>

            <div className="flex items-start justify-between mt-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                    {internship.category}
                  </span>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(internship.internship_type)}`}>
                    {internship.internship_type}
                  </span>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {internship.title}
                </h1>
                <p className="text-gray-600 text-lg mb-4">
                  {internship.description}
                </p>
                <div className="flex items-center gap-6 text-gray-600">
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 mr-2" />
                    {internship.duration}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 mr-2" />
                    {internship.location}
                  </div>
                  <div className="flex items-center">
                    <Briefcase className="w-5 h-5 mr-2" />
                    {internship.internship_code}
                  </div>
                </div>
              </div>

              <button 
                onClick={handleApplyClick}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
              >
                Apply Now
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Details */}
              <div className="lg:col-span-2 space-y-8">
                {/* About Section */}
                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">About the Internship</h2>
                  <div className="prose prose-blue max-w-none">
                    <p className="text-gray-700 whitespace-pre-line">
                      {internship.detailed_description}
                    </p>
                  </div>
                </section>

                {/* Skills Section */}
                {internship.skills && internship.skills.length > 0 && (
                  <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Skills Required</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {internship.skills.map((skill, index) => (
                        <div key={index} className="flex items-center bg-blue-50 px-4 py-3 rounded-lg">
                          <CheckCircle className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0" />
                          <span className="text-gray-700">{skill}</span>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Eligibility Section */}
                {internship.eligibility && (
                  <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Eligibility</h2>
                    <div className="bg-gray-50 px-6 py-4 rounded-lg">
                      <p className="text-gray-700">{internship.eligibility}</p>
                    </div>
                  </section>
                )}
              </div>

              {/* Right Column - Sidebar */}
              <div className="space-y-6">
                {/* Perks & Benefits */}
                {internship.perks && internship.perks.length > 0 && (
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl">
                    <div className="flex items-center mb-4">
                      <Award className="w-6 h-6 text-blue-600 mr-2" />
                      <h3 className="text-xl font-bold text-gray-900">Perks & Benefits</h3>
                    </div>
                    <ul className="space-y-3">
                      {internship.perks.map((perk, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{perk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* CTA Card */}
                <div className="bg-blue-600 text-white p-6 rounded-xl">
                  <h3 className="text-xl font-bold mb-3">Ready to Apply?</h3>
                  <p className="text-blue-100 mb-4">
                    Take the first step towards your career goals. Apply now and join our team!
                  </p>
                  <button 
                    onClick={handleApplyClick}
                    className="w-full bg-white text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    Apply for this Internship
                  </button>
                </div>

                {/* Info Card */}
                <div className="bg-gray-50 p-6 rounded-xl">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Important Information</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Applications are reviewed on a rolling basis</li>
                    <li>• Selected candidates will be contacted within 7-10 days</li>
                    <li>• All positions are subject to availability</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Margin */}
      <div className="h-16"></div>
    </div>
    </Layout>
  );
};

export default InternshipDetailPage;