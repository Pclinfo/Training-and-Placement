'use client'
import React, { useState, useRef, useEffect } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

export default function InternshipModalForm({ isOpen, onClose }) {
  // roles list
  const roles = [
    'FULL STACK DEVELOPER',
    'UI UX DESIGNER',
    'DATA ANALYST',
    'DIGITAL MARKETING',
    'CYBER SECURITY',
    'DATA SCIENCE',
    'DEVOPS',
    'ROBOTICS AUTOMATION',
  ];

  const [formData, setFormData] = useState({
    fname: '',
    lname: '',
    email: '',
    mobile: '',
    internship: '',
    message: '',
    cv: null,
  });

  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- searchable dropdown states ---
  const [roleQuery, setRoleQuery] = useState('');
  const [showRoleList, setShowRoleList] = useState(false);
  const roleContainerRef = useRef(null);

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (e) => {
      if (roleContainerRef.current && !roleContainerRef.current.contains(e.target)) {
        setShowRoleList(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // keep the query in sync when internship is changed programmatically
  useEffect(() => {
    setRoleQuery(formData.internship || '');
  }, [formData.internship]);

  // Handle general input changes (text/file)
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'cv') {
      setFormData((prev) => ({ ...prev, cv: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handlePhoneChange = (value) => {
    setFormData((prev) => ({ ...prev, mobile: value }));
  };

  // Role input handlers
  const handleRoleInputChange = (e) => {
    const val = e.target.value;
    setRoleQuery(val);
    setFormData((prev) => ({ ...prev, internship: val }));
    setShowRoleList(true);
  };

  const filteredRoles = roles.filter((r) =>
    r.toLowerCase().includes((roleQuery || '').toLowerCase())
  );

  const handleRoleSelect = (role) => {
    setFormData((prev) => ({ ...prev, internship: role }));
    setRoleQuery(role);
    setShowRoleList(false);
  };

  // Form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus('');
    setError('');

    // basic client-side validation: ensure internship is not empty
    if (!formData.internship || formData.internship.trim() === '') {
      setError('Please select or enter an internship role.');
      setIsSubmitting(false);
      return;
    }

    const form = new FormData();
    form.append('fname', formData.fname);
    form.append('lname', formData.lname);
    form.append('email', formData.email);
    form.append('mobile', formData.mobile);
    form.append('internship', formData.internship);
    form.append('message', formData.message);

    if (formData.cv) {
      form.append('cv', formData.cv);
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || process.env.REACT_APP_BACKEND_URL}/internship`, {
        method: 'POST',
        body: form,
      });

      const result = await response.json();

      if (response.ok) {
        setStatus('Message sent successfully!');
        setFormData({
          fname: '',
          lname: '',
          email: '',
          mobile: '',
          internship: '',
          message: '',
          cv: null,
        });

        setTimeout(() => {
          onClose();
          window.location.reload();
        }, 1500);
      } else {
        setError(result?.message || 'Submission failed.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-opacity-50" onClick={onClose}></div>
      <div className="flex items-center justify-center min-h-screen p-4 text-black">
        <div className="bg-white w-full max-w-md rounded-xl shadow-2xl relative">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h3 className="text-xl font-semibold">Apply for Internship</h3>
            <button onClick={onClose} className="text-gray-400 text-xl font-semibold hover:text-red-500">
              ✕
            </button>
          </div>

          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-left block">First Name</label>
                  <input
                    name="fname"
                    value={formData.fname}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="text-sm text-left block">Last Name</label>
                  <input
                    name="lname"
                    value={formData.lname}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-left block">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="text-sm text-left block">Phone Number</label>
                  <PhoneInput
                    country={"in"}
                    value={formData.mobile}
                    onChange={(value) => setFormData((prev) => ({ ...prev, mobile: value }))}
                    enableSearch={true}
                    required
                    inputClass="!w-full !h-12 !pl-12 !pr-3 !rounded-md !border !border-gray-300 focus:!border-blue-500 focus:!ring-2 focus:!ring-blue-500 text-black"
                    buttonClass="!h-12 !border !border-gray-300 !rounded-l-md text-black"
                    dropdownClass="!bg-white text-black !border !border-gray-300 !shadow-lg !max-h-72 overflow-y-auto"
                    placeholder="Enter mobile number"
                  />

                </div>
              </div>

              {/* --- SEARCHABLE DROPDOWN FOR INTERNSHIP ROLE (REPLACES <select>) --- */}
              <div ref={roleContainerRef}>
                <label className="text-sm text-left block">Internship Role</label>
                <div className="relative">
                  <input
                    type="text"
                    name="internship"
                    value={roleQuery}
                    onChange={handleRoleInputChange}
                    onFocus={() => setShowRoleList(true)}
                    placeholder="Search or select role..."
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />

                  {/* {showRoleList && filteredRoles.length > 0 && (
                    <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-40 overflow-y-auto shadow-lg">
                      {filteredRoles.map((role, index) => (
                        <li
                          key={index}
                          onClick={() => handleRoleSelect(role)}
                          className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                        >
                          {role}
                        </li>
                      ))}
                    </ul>
                  )} */}
                </div>
              </div>

              <div>
                <label className="text-sm text-left block">Upload CV</label>
                <input
                  type="file"
                  name="cv"
                  accept=".pdf,.doc,.docx"
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="text-sm text-left block">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="4"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#004aad] text-white py-2 rounded hover:bg-blue-700 transition"
              >
                {isSubmitting ? 'Sending...' : 'Send Application'}
              </button>
            </form>

            {status && <div className="mt-4 text-green-600 text-center">{status}</div>}
            {error && <div className="mt-4 text-red-600 text-center">{error}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
