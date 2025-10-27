// frontend/src/components/admin/InternshipModal.js
import React, { useState } from 'react';
import { X, Upload } from 'lucide-react';

const InternshipModal = ({ internship, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: internship?.title || '',
    description: internship?.description || '',
    detailed_description: internship?.detailed_description || '',
    category: internship?.category || '',
    duration: internship?.duration || '3 Months',
    internship_type: internship?.internship_type || 'remote',
    location: internship?.location || '',
    skills: internship?.skills || [],
    eligibility: internship?.eligibility || '',
    perks: internship?.perks || [],
    image_url: internship?.image_url || '',
    is_active: internship?.is_active ?? true
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(internship?.image_url || '');
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleArrayInput = (field, value) => {
    const array = value.split('\n').filter(item => item.trim());
    setFormData(prev => ({ ...prev, [field]: array }));
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const submitData = new FormData();
      
      Object.keys(formData).forEach(key => {
        if (Array.isArray(formData[key])) {
          submitData.append(key, JSON.stringify(formData[key]));
        } else {
          submitData.append(key, formData[key]);
        }
      });

      if (imageFile) {
        submitData.append('image', imageFile);
      }

      const url = internship 
        ? `http://localhost:7000/admin/internships/${internship.id}`
        : 'http://localhost:7000/admin/internships';
      
      const method = internship ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('admin_token')}`
        },
        body: submitData
      });

      if (response.ok) {
        onSave();
        onClose();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to save internship');
      }
    } catch (err) {
      console.error('Error saving internship:', err);
      alert('Failed to save internship');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">
            {internship ? 'Edit Internship' : 'Add New Internship'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Internship Image</label>
            <div className="flex items-start space-x-4">
              {imagePreview && (
                <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover rounded-lg" />
              )}
              <div className="flex-1">
                <label className="flex items-center justify-center px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500">
                  <Upload className="w-5 h-5 mr-2" />
                  <span>Upload Image</span>
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                </label>
              </div>
            </div>
          </div>

          {/* Title and Category */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black"
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              />
            </div>
          </div>

          {/* Short Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Short Description</label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black"
              rows="3"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            />
          </div>

          {/* Detailed Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Detailed Description</label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black"
              rows="5"
              value={formData.detailed_description}
              onChange={(e) => setFormData(prev => ({ ...prev, detailed_description: e.target.value }))}
            />
          </div>

          {/* Duration, Type, Location */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black"
                value={formData.duration}
                onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
              >
                <option>1 Month</option>
                <option>2 Months</option>
                <option>3 Months</option>
                <option>6 Months</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black"
                value={formData.internship_type}
                onChange={(e) => setFormData(prev => ({ ...prev, internship_type: e.target.value }))}
              >
                <option value="remote">Remote</option>
                <option value="onsite">Onsite</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              />
            </div>
          </div>

          {/* Skills Required */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Skills Required (one per line)</label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black"
              rows="4"
              placeholder="digital marketing campaigns&#10;social media websites&#10;SEO"
              value={formData.skills.join('\n')}
              onChange={(e) => handleArrayInput('skills', e.target.value)}
            />
          </div>

          {/* Eligibility */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Eligibility</label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black"
              rows="2"
              value={formData.eligibility}
              onChange={(e) => setFormData(prev => ({ ...prev, eligibility: e.target.value }))}
            />
          </div>

          {/* Perks & Benefits */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Perks & Benefits (one per line)</label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black"
              rows="4"
              placeholder="Internship Certificate&#10;Letter of Recommendation&#10;Full-Time Placement Opportunity"
              value={formData.perks.join('\n')}
              onChange={(e) => handleArrayInput('perks', e.target.value)}
            />
          </div>

          {/* Active Status */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_active"
              className="mr-2"
              checked={formData.is_active}
              onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
            />
            <label htmlFor="is_active" className="text-sm text-gray-700">Active Internship</label>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Internship'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InternshipModal;