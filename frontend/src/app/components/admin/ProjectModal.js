// // frontend/src/components/admin/ProjectModal.js
import React, { useState, useEffect } from 'react';
import { Plus, X, Upload, ImageIcon, DollarSign, Star } from 'lucide-react';

export default function ProjectModal({ project, onClose, onSave }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    detailed_description: '',
    category: '',
    duration: '4 Weeks',
    project_type: 'individual',
    difficulty_level: 'Intermediate',
    image_url: '',
    project_code: '',
    technologies: [],
    prerequisites: [],
    learning_outcomes: [],
    // Pricing fields
    price: '',
    original_price: '',
    course_fees: '',
    total_amount: '',
    discount: '',
    level: '',
    rating: '4.5',
    students_count: '0'
  });

  const [newTechnology, setNewTechnology] = useState('');
  const [newPrerequisite, setNewPrerequisite] = useState('');
  const [newOutcome, setNewOutcome] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (project) {
      setFormData({
        ...project,
        technologies: project.technologies || [],
        prerequisites: project.prerequisites || [],
        learning_outcomes: project.learning_outcomes || [],
        // Ensure pricing fields are included
        price: project.price || '',
        original_price: project.original_price || '',
        course_fees: project.course_fees || '',
        total_amount: project.total_amount || '',
        discount: project.discount || '',
        level: project.level || '',
        rating: project.rating?.toString() || '4.5',
        students_count: project.students_count || '0'
      });
      if (project.image_url) {
        setImagePreview(`http://localhost:7000${project.image_url}`);
      }
    }
  }, [project]);

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
      const url = project
        ? `http://localhost:7000/admin/projects/${project.id}`
        : 'http://localhost:7000/admin/projects';

      const formDataToSend = new FormData();

      Object.keys(formData).forEach(key => {
        if (key === 'technologies' || key === 'prerequisites' || key === 'learning_outcomes') {
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
        method: project ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Project saved:', result);
        onSave();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to save project');
      }
    } catch (err) {
      console.error('Error saving project:', err);
      alert('Failed to save project. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const addTechnology = () => {
    if (newTechnology.trim()) {
      setFormData(prev => ({
        ...prev,
        technologies: [...prev.technologies, newTechnology.trim()]
      }));
      setNewTechnology('');
    }
  };

  const removeTechnology = (index) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies.filter((_, i) => i !== index)
    }));
  };

  const addPrerequisite = () => {
    if (newPrerequisite.trim()) {
      setFormData(prev => ({
        ...prev,
        prerequisites: [...prev.prerequisites, newPrerequisite.trim()]
      }));
      setNewPrerequisite('');
    }
  };

  const removePrerequisite = (index) => {
    setFormData(prev => ({
      ...prev,
      prerequisites: prev.prerequisites.filter((_, i) => i !== index)
    }));
  };

  const addOutcome = () => {
    if (newOutcome.trim()) {
      setFormData(prev => ({
        ...prev,
        learning_outcomes: [...prev.learning_outcomes, newOutcome.trim()]
      }));
      setNewOutcome('');
    }
  };

  const removeOutcome = (index) => {
    setFormData(prev => ({
      ...prev,
      learning_outcomes: prev.learning_outcomes.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-gray-800">
            {project ? 'Edit Project' : 'Add New Project'}
          </h2>
        </div>

        <div className="p-6 space-y-6">
          {/* Image Upload */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Project Image
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

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Project Title *</label>
              <input
                type="text"
                className="text-black w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
              <input
                type="text"
                className="text-black w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                placeholder="e.g., Web Development, AI/ML, Mobile Apps"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Duration *</label>
              <input
                type="text"
                className="text-black w-full px-3 py-2 border border-gray-300 rounded-lg"
                value={formData.duration}
                onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                placeholder="e.g., 4 Weeks"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Project Type *</label>
              <select
                className="text-black w-full px-3 py-2 border border-gray-300 rounded-lg"
                value={formData.project_type}
                onChange={(e) => setFormData(prev => ({ ...prev, project_type: e.target.value }))}
              >
                <option value="individual">Individual</option>
                <option value="team">Team</option>
                <option value="guided">Guided</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty Level *</label>
              <select
                className="text-black w-full px-3 py-2 border border-gray-300 rounded-lg"
                value={formData.difficulty_level}
                onChange={(e) => setFormData(prev => ({ ...prev, difficulty_level: e.target.value }))}
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Project Code</label>
              <input
                type="text"
                className="text-black w-full px-3 py-2 border border-gray-300 rounded-lg"
                value={formData.project_code}
                onChange={(e) => setFormData(prev => ({ ...prev, project_code: e.target.value }))}
                placeholder="e.g., PROJ-WD-001"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
              <input
                type="text"
                className="text-black w-full px-3 py-2 border border-gray-300 rounded-lg"
                value={formData.level}
                onChange={(e) => setFormData(prev => ({ ...prev, level: e.target.value }))}
                placeholder="e.g., Beginner, Intermediate"
              />
            </div>
          </div>

          {/* Pricing Information Section */}
          <div className="border-2 border-blue-200 rounded-lg p-6 bg-blue-50">
            <div className="flex items-center mb-4">
              <DollarSign className="w-5 h-5 text-blue-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-800">Pricing Information</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹)</label>
                <input
                  type="text"
                  className="text-black w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  placeholder="e.g., 4999"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Original Price (₹)</label>
                <input
                  type="text"
                  className="text-black w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={formData.original_price}
                  onChange={(e) => setFormData(prev => ({ ...prev, original_price: e.target.value }))}
                  placeholder="e.g., 9999"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Discount (%)</label>
                <input
                  type="text"
                  className="text-black w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={formData.discount}
                  onChange={(e) => setFormData(prev => ({ ...prev, discount: e.target.value }))}
                  placeholder="e.g., 50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Course Fees (INR)</label>
                <input
                  type="text"
                  className="text-black w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={formData.course_fees}
                  onChange={(e) => setFormData(prev => ({ ...prev, course_fees: e.target.value }))}
                  placeholder="e.g., 5000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Total Amount (₹)</label>
                <input
                  type="text"
                  className="text-black w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={formData.total_amount}
                  onChange={(e) => setFormData(prev => ({ ...prev, total_amount: e.target.value }))}
                  placeholder="e.g., 5900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Star className="w-4 h-4 text-yellow-500 mr-1" />
                  Rating
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  className="text-black w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={formData.rating}
                  onChange={(e) => setFormData(prev => ({ ...prev, rating: e.target.value }))}
                  placeholder="e.g., 4.5"
                />
              </div>

              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">Students Count</label>
                <input
                  type="text"
                  className="text-black w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={formData.students_count}
                  onChange={(e) => setFormData(prev => ({ ...prev, students_count: e.target.value }))}
                  placeholder="e.g., 1,234 students enrolled"
                />
              </div>
            </div>
          </div>

          {/* Descriptions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Short Description *</label>
            <textarea
              className="text-black w-full px-3 py-2 border border-gray-300 rounded-lg h-20"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Brief project overview..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Detailed Description *</label>
            <textarea
              className="text-black w-full px-3 py-2 border border-gray-300 rounded-lg h-32"
              value={formData.detailed_description}
              onChange={(e) => setFormData(prev => ({ ...prev, detailed_description: e.target.value }))}
              placeholder="Comprehensive project description..."
              required
            />
          </div>

          {/* Technologies */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Technologies Used</label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  className="text-black flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                  value={newTechnology}
                  onChange={(e) => setNewTechnology(e.target.value)}
                  placeholder="e.g., React, Node.js, MongoDB"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
                />
                <button
                  type="button"
                  onClick={addTechnology}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {formData.technologies.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.technologies.map((tech, index) => (
                    <div key={index} className="flex items-center bg-blue-50 px-3 py-1 rounded-full">
                      <span className="text-sm text-blue-700">{tech}</span>
                      <button
                        type="button"
                        onClick={() => removeTechnology(index)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Prerequisites */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Prerequisites</label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  className="text-black flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                  value={newPrerequisite}
                  onChange={(e) => setNewPrerequisite(e.target.value)}
                  placeholder="Add a prerequisite..."
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addPrerequisite())}
                />
                <button
                  type="button"
                  onClick={addPrerequisite}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {formData.prerequisites.length > 0 && (
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {formData.prerequisites.map((prereq, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded">
                      <span className="text-sm text-gray-700">{prereq}</span>
                      <button
                        type="button"
                        onClick={() => removePrerequisite(index)}
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

          {/* Learning Outcomes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Learning Outcomes</label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  className="text-black flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                  value={newOutcome}
                  onChange={(e) => setNewOutcome(e.target.value)}
                  placeholder="What will students learn?"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addOutcome())}
                />
                <button
                  type="button"
                  onClick={addOutcome}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {formData.learning_outcomes.length > 0 && (
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {formData.learning_outcomes.map((outcome, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded">
                      <span className="text-sm text-gray-700">{outcome}</span>
                      <button
                        type="button"
                        onClick={() => removeOutcome(index)}
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

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t sticky bottom-0 bg-white">
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
              {uploading ? 'Saving...' : (project ? 'Update Project' : 'Create Project')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// import React, { useState, useEffect } from 'react';
// import { Plus, X, Upload, ImageIcon } from 'lucide-react';

// export default function ProjectModal({ project, onClose, onSave }) {
//   const [formData, setFormData] = useState({
//     title: '',
//     description: '',
//     detailed_description: '',
//     category: '',
//     duration: '4 Weeks',
//     project_type: 'individual',
//     difficulty_level: 'Intermediate',
//     image_url: '',
//     project_code: '',
//     technologies: [],
//     prerequisites: [],
//     learning_outcomes: []
//   });

//   const [newTechnology, setNewTechnology] = useState('');
//   const [newPrerequisite, setNewPrerequisite] = useState('');
//   const [newOutcome, setNewOutcome] = useState('');
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [imagePreview, setImagePreview] = useState(null);
//   const [uploading, setUploading] = useState(false);

//   useEffect(() => {
//     if (project) {
//       setFormData({
//         ...project,
//         technologies: project.technologies || [],
//         prerequisites: project.prerequisites || [],
//         learning_outcomes: project.learning_outcomes || []
//       });
//       if (project.image_url) {
//         setImagePreview(`http://localhost:7000${project.image_url}`);
//       }
//     }
//   }, [project]);

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
//       if (!validTypes.includes(file.type)) {
//         alert('Please select a valid image file (JPG, PNG, GIF, or WebP)');
//         return;
//       }

//       if (file.size > 5 * 1024 * 1024) {
//         alert('Image size should be less than 5MB');
//         return;
//       }

//       setSelectedImage(file);

//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setImagePreview(reader.result);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setUploading(true);

//     try {
//       const token = sessionStorage.getItem('admin_token');
//       const url = project
//         ? `http://localhost:7000/admin/projects/${project.id}`
//         : 'http://localhost:7000/admin/projects';

//       const formDataToSend = new FormData();

//       Object.keys(formData).forEach(key => {
//         if (key === 'technologies' || key === 'prerequisites' || key === 'learning_outcomes') {
//           formDataToSend.append(key, JSON.stringify(formData[key]));
//         } else if (key !== 'image_url') {
//           formDataToSend.append(key, formData[key]);
//         }
//       });

//       if (selectedImage) {
//         formDataToSend.append('image', selectedImage);
//       } else if (!selectedImage && formData.image_url) {
//         formDataToSend.append('image_url', formData.image_url);
//       }

//       const response = await fetch(url, {
//         method: project ? 'PUT' : 'POST',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//         },
//         body: formDataToSend,
//       });

//       if (response.ok) {
//         const result = await response.json();
//         console.log('Project saved:', result);
//         onSave();
//       } else {
//         const error = await response.json();
//         alert(error.error || 'Failed to save project');
//       }
//     } catch (err) {
//       console.error('Error saving project:', err);
//       alert('Failed to save project. Please try again.');
//     } finally {
//       setUploading(false);
//     }
//   };

//   const addTechnology = () => {
//     if (newTechnology.trim()) {
//       setFormData(prev => ({
//         ...prev,
//         technologies: [...prev.technologies, newTechnology.trim()]
//       }));
//       setNewTechnology('');
//     }
//   };

//   const removeTechnology = (index) => {
//     setFormData(prev => ({
//       ...prev,
//       technologies: prev.technologies.filter((_, i) => i !== index)
//     }));
//   };

//   const addPrerequisite = () => {
//     if (newPrerequisite.trim()) {
//       setFormData(prev => ({
//         ...prev,
//         prerequisites: [...prev.prerequisites, newPrerequisite.trim()]
//       }));
//       setNewPrerequisite('');
//     }
//   };

//   const removePrerequisite = (index) => {
//     setFormData(prev => ({
//       ...prev,
//       prerequisites: prev.prerequisites.filter((_, i) => i !== index)
//     }));
//   };

//   const addOutcome = () => {
//     if (newOutcome.trim()) {
//       setFormData(prev => ({
//         ...prev,
//         learning_outcomes: [...prev.learning_outcomes, newOutcome.trim()]
//       }));
//       setNewOutcome('');
//     }
//   };

//   const removeOutcome = (index) => {
//     setFormData(prev => ({
//       ...prev,
//       learning_outcomes: prev.learning_outcomes.filter((_, i) => i !== index)
//     }));
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
//         <div className="p-6 border-b">
//           <h2 className="text-xl font-bold text-gray-800">
//             {project ? 'Edit Project' : 'Add New Project'}
//           </h2>
//         </div>

//         <div className="p-6 space-y-6">
//           {/* Image Upload */}
//           <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
//             <label className="block text-sm font-medium text-gray-700 mb-3">
//               Project Image
//             </label>

//             {imagePreview ? (
//               <div className="relative">
//                 <img
//                   src={imagePreview}
//                   alt="Preview"
//                   className="w-full h-48 object-cover rounded-lg"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => {
//                     setSelectedImage(null);
//                     setImagePreview(null);
//                     setFormData(prev => ({ ...prev, image_url: '' }));
//                   }}
//                   className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700"
//                 >
//                   <X className="w-4 h-4" />
//                 </button>
//               </div>
//             ) : (
//               <div className="flex flex-col items-center justify-center py-8">
//                 <ImageIcon className="w-12 h-12 text-gray-400 mb-3" />
//                 <label className="cursor-pointer">
//                   <span className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 inline-flex items-center gap-2">
//                     <Upload className="w-4 h-4" />
//                     Choose Image
//                   </span>
//                   <input
//                     type="file"
//                     accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
//                     onChange={handleImageChange}
//                     className="hidden"
//                   />
//                 </label>
//                 <p className="text-sm text-gray-500 mt-2">
//                   JPG, PNG, GIF or WebP (Max 5MB)
//                 </p>
//               </div>
//             )}
//           </div>

//           {/* Basic Information */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Project Title *</label>
//               <input
//                 type="text"
//                 className="text-black w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                 value={formData.title}
//                 onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
//               <input
//                 type="text"
//                 className="text-black w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                 value={formData.category}
//                 onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
//                 placeholder="e.g., Web Development, AI/ML, Mobile Apps"
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Duration *</label>
//               <input
//                 type="text"
//                 className="text-black w-full px-3 py-2 border border-gray-300 rounded-lg"
//                 value={formData.duration}
//                 onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
//                 placeholder="e.g., 4 Weeks"
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Project Type *</label>
//               <select
//                 className="text-black w-full px-3 py-2 border border-gray-300 rounded-lg"
//                 value={formData.project_type}
//                 onChange={(e) => setFormData(prev => ({ ...prev, project_type: e.target.value }))}
//               >
//                 <option value="individual">Individual</option>
//                 <option value="team">Team</option>
//                 <option value="guided">Guided</option>
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty Level *</label>
//               <select
//                 className="text-black w-full px-3 py-2 border border-gray-300 rounded-lg"
//                 value={formData.difficulty_level}
//                 onChange={(e) => setFormData(prev => ({ ...prev, difficulty_level: e.target.value }))}
//               >
//                 <option value="Beginner">Beginner</option>
//                 <option value="Intermediate">Intermediate</option>
//                 <option value="Advanced">Advanced</option>
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Project Code</label>
//               <input
//                 type="text"
//                 className="text-black w-full px-3 py-2 border border-gray-300 rounded-lg"
//                 value={formData.project_code}
//                 onChange={(e) => setFormData(prev => ({ ...prev, project_code: e.target.value }))}
//                 placeholder="e.g., PROJ-WD-001"
//               />
//             </div>
//           </div>

//           {/* Descriptions */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Short Description *</label>
//             <textarea
//               className="text-black w-full px-3 py-2 border border-gray-300 rounded-lg h-20"
//               value={formData.description}
//               onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
//               placeholder="Brief project overview..."
//               required
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Detailed Description *</label>
//             <textarea
//               className="text-black w-full px-3 py-2 border border-gray-300 rounded-lg h-32"
//               value={formData.detailed_description}
//               onChange={(e) => setFormData(prev => ({ ...prev, detailed_description: e.target.value }))}
//               placeholder="Comprehensive project description..."
//               required
//             />
//           </div>

//           {/* Technologies */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Technologies Used</label>
//             <div className="space-y-2">
//               <div className="flex gap-2">
//                 <input
//                   type="text"
//                   className="text-black flex-1 px-3 py-2 border border-gray-300 rounded-lg"
//                   value={newTechnology}
//                   onChange={(e) => setNewTechnology(e.target.value)}
//                   placeholder="e.g., React, Node.js, MongoDB"
//                   onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
//                 />
//                 <button
//                   type="button"
//                   onClick={addTechnology}
//                   className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//                 >
//                   <Plus className="w-4 h-4" />
//                 </button>
//               </div>

//               {formData.technologies.length > 0 && (
//                 <div className="flex flex-wrap gap-2">
//                   {formData.technologies.map((tech, index) => (
//                     <div key={index} className="flex items-center bg-blue-50 px-3 py-1 rounded-full">
//                       <span className="text-sm text-blue-700">{tech}</span>
//                       <button
//                         type="button"
//                         onClick={() => removeTechnology(index)}
//                         className="ml-2 text-blue-600 hover:text-blue-800"
//                       >
//                         <X className="w-3 h-3" />
//                       </button>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Prerequisites */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Prerequisites</label>
//             <div className="space-y-2">
//               <div className="flex gap-2">
//                 <input
//                   type="text"
//                   className="text-black flex-1 px-3 py-2 border border-gray-300 rounded-lg"
//                   value={newPrerequisite}
//                   onChange={(e) => setNewPrerequisite(e.target.value)}
//                   placeholder="Add a prerequisite..."
//                   onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addPrerequisite())}
//                 />
//                 <button
//                   type="button"
//                   onClick={addPrerequisite}
//                   className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//                 >
//                   <Plus className="w-4 h-4" />
//                 </button>
//               </div>

//               {formData.prerequisites.length > 0 && (
//                 <div className="space-y-2 max-h-32 overflow-y-auto">
//                   {formData.prerequisites.map((prereq, index) => (
//                     <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded">
//                       <span className="text-sm text-gray-700">{prereq}</span>
//                       <button
//                         type="button"
//                         onClick={() => removePrerequisite(index)}
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

//           {/* Learning Outcomes */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Learning Outcomes</label>
//             <div className="space-y-2">
//               <div className="flex gap-2">
//                 <input
//                   type="text"
//                   className="text-black flex-1 px-3 py-2 border border-gray-300 rounded-lg"
//                   value={newOutcome}
//                   onChange={(e) => setNewOutcome(e.target.value)}
//                   placeholder="What will students learn?"
//                   onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addOutcome())}
//                 />
//                 <button
//                   type="button"
//                   onClick={addOutcome}
//                   className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//                 >
//                   <Plus className="w-4 h-4" />
//                 </button>
//               </div>

//               {formData.learning_outcomes.length > 0 && (
//                 <div className="space-y-2 max-h-32 overflow-y-auto">
//                   {formData.learning_outcomes.map((outcome, index) => (
//                     <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded">
//                       <span className="text-sm text-gray-700">{outcome}</span>
//                       <button
//                         type="button"
//                         onClick={() => removeOutcome(index)}
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

//           {/* Action Buttons */}
//           <div className="flex justify-end space-x-4 pt-6 border-t">
//             <button
//               type="button"
//               onClick={onClose}
//               className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
//               disabled={uploading}
//             >
//               Cancel
//             </button>
//             <button
//               type="button"
//               onClick={handleSubmit}
//               className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
//               disabled={uploading}
//             >
//               {uploading ? 'Saving...' : (project ? 'Update Project' : 'Create Project')}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }