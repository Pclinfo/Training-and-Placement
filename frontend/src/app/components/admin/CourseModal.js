import React, { useState, useEffect } from 'react';
import { Plus, X, Upload, ImageIcon } from 'lucide-react';

export default function CourseModal({ course, onClose, onSave }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    detailed_description: '',
    level: 'Beginner',
    rating: 4.5,
    students: '0',
    duration: '',
    price: '',
    original_price: '',
    discount: '',
    image_url: '',
    category: '',
    instructor: '',
    course_fees: '',
    course_code: '',
    total_amount: '',
    features: []
  });

  const [newFeature, setNewFeature] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (course) {
      setFormData({
        ...course,
        features: course.features || []
      });
      if (course.image_url) {
        setImagePreview(`http://localhost:7000${course.image_url}`);
      }
    }
  }, [course]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        alert('Please select a valid image file (JPG, PNG, GIF, or WebP)');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }

      setSelectedImage(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      const token = sessionStorage.getItem('admin_token');
      const url = course
        ? `http://localhost:7000/admin/courses/${course.id}`
        : 'http://localhost:7000/admin/courses';

      const formDataToSend = new FormData();

      Object.keys(formData).forEach(key => {
        if (key === 'features') {
          formDataToSend.append(key, JSON.stringify(formData[key]));
        } else if (key !== 'image_url') {
          formDataToSend.append(key, formData[key]);
        }
      });

      if (selectedImage) {
        formDataToSend.append('image', selectedImage);
      } else if (!selectedImage && formData.image_url) {
        formDataToSend.append('image_url', formData.image_url);
      }

      const response = await fetch(url, {
        method: course ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Course saved:', result);
        onSave();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to save course');
      }
    } catch (err) {
      console.error('Error saving course:', err);
      alert('Failed to save course. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  const removeFeature = (index) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">
            {course ? 'Edit Course' : 'Add New Course'}
          </h2>
        </div>

        <div className="p-6 space-y-6">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Course Image
            </label>

            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => {
                    setSelectedImage(null);
                    setImagePreview(null);
                    setFormData(prev => ({ ...prev, image_url: '' }));
                  }}
                  className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8">
                <ImageIcon className="w-12 h-12 text-gray-400 mb-3" />
                <label className="cursor-pointer">
                  <span className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 inline-flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    Choose Image
                  </span>
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
                <p className="text-sm text-gray-500 mt-2">
                  JPG, PNG, GIF or WebP (Max 5MB)
                </p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Course Title</label>
              <input
                type="text"
                className="text-black w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <input
                type="text"
                className="text-black w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Instructor</label>
              <input
                type="text"
                className="text-black w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={formData.instructor}
                onChange={(e) => setFormData(prev => ({ ...prev, instructor: e.target.value }))}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
              <input
                type="text"
                className="text-black w-full px-3 py-2 border border-gray-300 rounded-lg"
                value={formData.duration}
                onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                placeholder="e.g., 40 Hours"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
              <input
                type="text"
                className="text-black w-full px-3 py-2 border border-gray-300 rounded-lg"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                placeholder="e.g., 89.99"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Original Price</label>
              <input
                type="text"
                className="text-black w-full px-3 py-2 border border-gray-300 rounded-lg"
                value={formData.original_price}
                onChange={(e) => setFormData(prev => ({ ...prev, original_price: e.target.value }))}
                placeholder="e.g., 199.99"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Course Fees (INR)</label>
              <input
                type="text"
                className="text-black w-full px-3 py-2 border border-gray-300 rounded-lg"
                value={formData.course_fees}
                onChange={(e) => setFormData(prev => ({ ...prev, course_fees: e.target.value }))}
                placeholder="e.g., INR 8,999"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Total Amount</label>
              <input
                type="text"
                className="text-black w-full px-3 py-2 border border-gray-300 rounded-lg"
                value={formData.total_amount}
                onChange={(e) => setFormData(prev => ({ ...prev, total_amount: e.target.value }))}
                placeholder="e.g., 8999"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
              <select
                className="text-black w-full px-3 py-2 border border-gray-300 rounded-lg"
                value={formData.level}
                onChange={(e) => setFormData(prev => ({ ...prev, level: e.target.value }))}
              >
                <option value="Beginner">Beginner</option>
                <option value="Beginner to Advanced">Beginner to Advanced</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
              <input
                type="number"
                step="0.1"
                min="1"
                max="5"
                className="text-black w-full px-3 py-2 border border-gray-300 rounded-lg"
                value={formData.rating}
                onChange={(e) => setFormData(prev => ({ ...prev, rating: parseFloat(e.target.value) }))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Students Count</label>
              <input
                type="text"
                className="text-black w-full px-3 py-2 border border-gray-300 rounded-lg"
                value={formData.students}
                onChange={(e) => setFormData(prev => ({ ...prev, students: e.target.value }))}
                placeholder="e.g., 12,456"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Discount</label>
              <input
                type="text"
                className="text-black w-full px-3 py-2 border border-gray-300 rounded-lg"
                value={formData.discount}
                onChange={(e) => setFormData(prev => ({ ...prev, discount: e.target.value }))}
                placeholder="e.g., 55% OFF"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Course Code</label>
              <input
                type="text"
                className="text-black w-full px-3 py-2 border border-gray-300 rounded-lg"
                value={formData.course_code}
                onChange={(e) => setFormData(prev => ({ ...prev, course_code: e.target.value }))}
                placeholder="e.g., WD-FS-001"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Short Description</label>
            <textarea
              className="text-black w-full px-3 py-2 border border-gray-300 rounded-lg h-20"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Brief course description..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Detailed Description</label>
            <textarea
              className="text-black w-full px-3 py-2 border border-gray-300 rounded-lg h-24"
              value={formData.detailed_description}
              onChange={(e) => setFormData(prev => ({ ...prev, detailed_description: e.target.value }))}
              placeholder="Comprehensive course description..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Course Features</label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  className="text-black flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  placeholder="Add a course feature..."
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                />
                <button
                  type="button"
                  onClick={addFeature}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {formData.features.length > 0 && (
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {formData.features.map((feature, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded">
                      <span className="text-sm text-gray-700">{feature}</span>
                      <button
                        type="button"
                        onClick={() => removeFeature(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              disabled={uploading}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
              disabled={uploading}
            >
              {uploading ? 'Saving...' : (course ? 'Update Course' : 'Create Course')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
// 'use client';
// import React, { useState, useEffect } from 'react';
// import { Plus, X } from 'lucide-react';

// export default function CourseModal({ course, onClose, onSave }) {
//   const [formData, setFormData] = useState({
//     title: '',
//     description: '',
//     detailed_description: '',
//     level: 'Beginner',
//     rating: 4.5,
//     students: '0',
//     duration: '',
//     price: '',
//     original_price: '',
//     discount: '',
//     image_url: '',
//     category: '',
//     instructor: '',
//     course_fees: '',
//     course_code: '',
//     total_amount: '',
//     features: []
//   });

//   const [newFeature, setNewFeature] = useState('');

//   useEffect(() => {
//     if (course) {
//       setFormData({
//         ...course,
//         features: course.features || []
//       });
//     }
//   }, [course]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const token = sessionStorage.getItem('admin_token');
//       const url = course
//         ? `http://localhost:7000/admin/courses/${course.id}`
//         : 'http://localhost:7000/admin/courses';

//       const response = await fetch(url, {
//         method: course ? 'PUT' : 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//         body: JSON.stringify(formData),
//       });

//       if (response.ok) {
//         onSave();
//       }
//     } catch (err) {
//       console.error('Error saving course:', err);
//     }
//   };

//   const addFeature = () => {
//     if (newFeature.trim()) {
//       setFormData(prev => ({
//         ...prev,
//         features: [...prev.features, newFeature.trim()]
//       }));
//       setNewFeature('');
//     }
//   };

//   const removeFeature = (index) => {
//     setFormData(prev => ({
//       ...prev,
//       features: prev.features.filter((_, i) => i !== index)
//     }));
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
//         <div className="p-6 border-b">
//           <h2 className="text-xl font-bold text-gray-800">
//             {course ? 'Edit Course' : 'Add New Course'}
//           </h2>
//         </div>

//         <form onSubmit={handleSubmit} className="p-6 space-y-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Course Title
//               </label>
//               <input
//                 type="text"
//                 className="text-black w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 value={formData.title}
//                 onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Category
//               </label>
//               <input
//                 type="text"
//                 className="text-black w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 value={formData.category}
//                 onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Instructor
//               </label>
//               <input
//                 type="text"
//                 className="text-black w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 value={formData.instructor}
//                 onChange={(e) => setFormData(prev => ({ ...prev, instructor: e.target.value }))}
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Duration
//               </label>
//               <input
//                 type="text"
//                 className="text-black w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 value={formData.duration}
//                 onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
//                 placeholder="e.g., 40 Hours"
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Price
//               </label>
//               <input
//                 type="text"
//                 className="text-black w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 value={formData.price}
//                 onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
//                 placeholder="e.g., 89.99"
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Original Price
//               </label>
//               <input
//                 type="text"
//                 className="text-black w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 value={formData.original_price}
//                 onChange={(e) => setFormData(prev => ({ ...prev, original_price: e.target.value }))}
//                 placeholder="e.g., 199.99"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Course Fees (INR)
//               </label>
//               <input
//                 type="text"
//                 className="text-black w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 value={formData.course_fees}
//                 onChange={(e) => setFormData(prev => ({ ...prev, course_fees: e.target.value }))}
//                 placeholder="e.g., INR 8,999"
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Total Amount
//               </label>
//               <input
//                 type="text"
//                 className="text-black w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 value={formData.total_amount}
//                 onChange={(e) => setFormData(prev => ({ ...prev, total_amount: e.target.value }))}
//                 placeholder="e.g., 8999"
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Level
//               </label>
//               <select
//                 className="text-black w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 value={formData.level}
//                 onChange={(e) => setFormData(prev => ({ ...prev, level: e.target.value }))}
//               >
//                 <option value="Beginner">Beginner</option>
//                 <option value="Beginner to Advanced">Beginner to Advanced</option>
//                 <option value="Intermediate">Intermediate</option>
//                 <option value="Advanced">Advanced</option>
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Rating
//               </label>
//               <input
//                 type="number"
//                 step="0.1"
//                 min="1"
//                 max="5"
//                 className="text-black w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 value={formData.rating}
//                 onChange={(e) => setFormData(prev => ({ ...prev, rating: parseFloat(e.target.value) }))}
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Students Count
//               </label>
//               <input
//                 type="text"
//                 className="text-black w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 value={formData.students}
//                 onChange={(e) => setFormData(prev => ({ ...prev, students: e.target.value }))}
//                 placeholder="e.g., 12,456"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Discount
//               </label>
//               <input
//                 type="text"
//                 className="text-black w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 value={formData.discount}
//                 onChange={(e) => setFormData(prev => ({ ...prev, discount: e.target.value }))}
//                 placeholder="e.g., 55% OFF"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Course Code
//               </label>
//               <input
//                 type="text"
//                 className="text-black w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 value={formData.course_code}
//                 onChange={(e) => setFormData(prev => ({ ...prev, course_code: e.target.value }))}
//                 placeholder="e.g., WD-FS-001"
//               />
//             </div>

//             <div className="md:col-span-2">
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Image URL
//               </label>
//               <input
//                 type="url"
//                 className="text-black w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 value={formData.image_url}
//                 onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
//                 placeholder="https://example.com/course-image.jpg"
//               />
//             </div>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Short Description
//             </label>
//             <textarea
//               className="text-black w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-20"
//               value={formData.description}
//               onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
//               placeholder="Brief course description..."
//               required
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Detailed Description
//             </label>
//             <textarea
//               className="text-black w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24"
//               value={formData.detailed_description}
//               onChange={(e) => setFormData(prev => ({ ...prev, detailed_description: e.target.value }))}
//               placeholder="Comprehensive course description..."
//               required
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Course Features
//             </label>
//             <div className="space-y-2">
//               <div className="flex gap-2">
//                 <input
//                   type="text"
//                   className="text-black flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   value={newFeature}
//                   onChange={(e) => setNewFeature(e.target.value)}
//                   placeholder="Add a course feature..."
//                   onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
//                 />
//                 <button
//                   type="button"
//                   onClick={addFeature}
//                   className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//                 >
//                   <Plus className="w-4 h-4" />
//                 </button>
//               </div>

//               {formData.features.length > 0 && (
//                 <div className="space-y-2 max-h-32 overflow-y-auto">
//                   {formData.features.map((feature, index) => (
//                     <div
//                       key={index}
//                       className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded"
//                     >
//                       <span className="text-sm text-gray-700">{feature}</span>
//                       <button
//                         type="button"
//                         onClick={() => removeFeature(index)}
//                         className="text-red-600 hover:text-red-800"
//                       >
//                         <X className="w-4 h-4" />
//                       </button>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>

//           <div className="flex justify-end space-x-4 pt-6 border-t">
//             <button
//               type="button"
//               onClick={onClose}
//               className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//             >
//               {course ? 'Update Course' : 'Create Course'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }