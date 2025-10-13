"use client";
import React, { useState, useEffect } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const ContactModelForm = ({ close }) => {
    const [formData, setFormData] = useState({
        fname: "",
        lname: "",
        email: "",
        mobile: "",
        message: "",
    });

    const [status, setStatus] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isClient, setIsClient] = useState(false); // 👈 add this
    useEffect(() => {
        setIsClient(true); // 👈 set true after mounting (client-side)
    }, []);

    // handle generic input
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // handle phone input
    const handlePhoneChange = (value) => {
        setFormData((prev) => ({ ...prev, mobile: value || "" }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setStatus("");
        setError("");

        try {
            if (!process.env.NEXT_PUBLIC_BACKEND_URL) {
                throw new Error("Backend URL not configured");
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/pclinfo`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();
            console.log(result)

            if (response.ok) {
                setStatus("Message sent successfully!");
                setFormData({ fname: "", lname: "", email: "", mobile: "", message: "" });

                setTimeout(() => close(), 2000);
            } else {
                setError(result?.message || "Submission failed. Please try again.");
            }
        } catch (error) {
            console.error("Form submission error:", error);
            setError("An unexpected error occurred. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 z-50">
            {/* Modal Box */}
            <div
                className="bg-white rounded-lg shadow-lg w-full max-w-md relative"
                onClick={(e) => e.stopPropagation()} // prevent outside click from closing
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h3 className="text-xl font-semibold text-blue-600">Contact Us</h3>
                    <button
                        onClick={close}
                        className="text-gray-400 text-2xl font-bold hover:text-red-500 transition-colors duration-200"
                        aria-label="Close modal"
                    >
                        ×
                    </button>
                </div>

                {/* Form */}
                <div className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Name Fields */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-700 block mb-1">
                                    First Name *
                                </label>
                                <input
                                    type="text"
                                    name="fname"
                                    value={formData.fname}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                                    placeholder="Enter first name"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700 block mb-1">
                                    Last Name *
                                </label>
                                <input
                                    type="text"
                                    name="lname"
                                    value={formData.lname}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                                    placeholder="Enter last name"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="text-sm font-medium text-gray-700 block mb-1">
                                Email *
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                                placeholder="Enter email address"
                            />
                        </div>

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
                  
                        {/* Message */}
                        <div>
                            <label className="text-sm font-medium text-gray-700 block mb-1">
                                Message *
                            </label>
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                required
                                rows="4"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 resize-none"
                                placeholder="Enter your message..."
                            ></textarea>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 disabled:opacity-50"
                        >
                            {isSubmitting ? "Sending..." : "Send Message"}
                        </button>
                    </form>

                    {/* Status/Error Messages */}
                    {status && (
                        <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-md text-center">
                            ✅ {status}
                        </div>
                    )}
                    {error && (
                        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-center">
                            ❌ {error}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ContactModelForm;
