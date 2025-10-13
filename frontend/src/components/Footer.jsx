import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
// import logo from '../Assets/logo.png'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faInstagram, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope, faPhone, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';

const Footer = () => {
    return (
        <footer className="bg-black text-white">
            <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
                {/* Main Content Container */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                    {/* Logo Section */}
                    <div className="lg:col-span-3 flex flex-col items-center sm:items-center text-center sm:text-left">
                        <Link href="/" className="mb-4">
                        <Image
                            src="/logo.png" alt="Pcl logo - Best Training & Placement"
                            width={160} height={32} className="w-full h-auto max-w-[100px] md:max-w-[200px] mx-auto sm:mx-0"
                            sizes="(max-width: 768px) 100px, 200px" loading="lazy" />
                        </Link>
                        <p className="text-lg font-medium mb-2">Training & Placement</p>

                        {/* Social Icons */}
                        <div className="flex space-x-6 mt-2 justify-center sm:justify-start">
                            <a
                                href="https://www.facebook.com/people/PCL-Infotech-Pvt-Ltd/61565409011377/"
                                className="text-white hover:text-[#004aad] transition-colors duration-200 mx-auto sm:mx-0"
                                target="_blank" rel="noopener noreferrer" aria-label="PCL Infotech Facebook"
                            >
                                <FontAwesomeIcon icon={faFacebook} size="lg" />
                            </a>
                            <a
                                href="https://www.instagram.com/pclinfotech/"
                                className="text-white hover:text-[#004aad] transition-colors duration-200 mx-auto sm:mx-0"
                                target="_blank" rel="noopener noreferrer" aria-label="PCL Infotech Instagram"
                            >
                                <FontAwesomeIcon icon={faInstagram} size="lg" />
                            </a>
                            <a
                                href="https://x.com/pcl_infotech"
                                className="text-white hover:text-[#004aad] transition-colors duration-200 mx-auto sm:mx-0"
                                target="_blank" rel="noopener noreferrer" aria-label="PCL Infotech X"
                            >
                                <FontAwesomeIcon icon={faTwitter} size="lg" />
                            </a>
                        </div>
                    </div>

                    {/* Links Grid */}
                    <div className="lg:col-span-9">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {/* About Us Column */}
                            <div className="text-center sm:text-left">
                                <h4 className="text-lg font-semibold mb-4">About Us</h4>
                                <ul className="space-y-3">
                                    <li>
                                        <Link href="/" className="text-gray-400 hover:text-[#004aad] transition-colors duration-200">
                                            Home
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/contact-info" className="text-gray-400 hover:text-[#004aad] transition-colors duration-200">
                                            Contact Us
                                        </Link>
                                    </li>
                                </ul>
                            </div>

                            {/* Our Services Column */}
                            <div className="text-center sm:text-left">
                                <h4 className="text-lg font-semibold mb-4">Our Services</h4>
                                <ul className="space-y-3">
                                    <li><Link href="/web-development" className="text-gray-400 hover:text-[#004aad] transition-colors duration-200">Web Development</Link></li>
                                    <li><Link href="/mobile-app-development" className="text-gray-400 hover:text-[#004aad] transition-colors duration-200">Mobile Development</Link></li>
                                    <li><Link href="/web-design" className="text-gray-400 hover:text-[#004aad] transition-colors duration-200">Web Design</Link></li>
                                    <li><Link href="/digital-marketing" className="text-gray-400 hover:text-[#004aad] transition-colors duration-200">Digital Marketing</Link></li>
                                    <li><Link href="/software-products" className="text-gray-400 hover:text-[#004aad] transition-colors duration-200">Software Products</Link></li>
                                </ul>
                            </div>

                            {/* Other Services Column */}
                            <div className="text-center sm:text-left">
                                <h4 className="text-lg font-semibold mb-4">Other Services</h4>
                                <ul className="space-y-3">
                                    <li><Link href="/domain-registration" className="text-gray-400 hover:text-[#004aad] transition-colors duration-200">Domain Registration</Link></li>
                                    <li><Link href="/vps-hosting" className="text-gray-400 hover:text-[#004aad] transition-colors duration-200">VPS Hosting</Link></li>
                                    <li><Link href="/communication" className="text-gray-400 hover:text-[#004aad] transition-colors duration-200">Communication</Link></li>
                                </ul>
                            </div>

                            {/* Contact Us Column */}
                            <div className="text-center sm:text-left">
                                <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
                                <ul className="space-y-4">
                                    <li className="flex flex-col sm:flex-row sm:items-center sm:space-x-3">
                                        <FontAwesomeIcon icon={faEnvelope} className="w-4 h-4 text-gray-400 mt-1 sm:mt-0 mx-auto sm:mx-0" />
                                        <a href="mailto:info@pclinfotech.com" className="text-gray-400 hover:text-blue-500 transition-colors duration-200 mt-2 sm:mt-0">
                                            info@pclinfotech.com
                                        </a>
                                    </li>
                                    <li className="flex flex-col sm:flex-row sm:items-center sm:space-x-3">
                                        <FontAwesomeIcon icon={faPhone} className="w-4 h-4 text-gray-400 mt-1 sm:mt-0 mx-auto sm:mx-0" />
                                        <a href="tel:+917200074253" className="text-gray-400 hover:text-blue-600 transition-colors duration-200 mt-2 sm:mt-0">
                                            +91 72000 - 74253
                                        </a>
                                    </li>
                                    <li className="flex flex-col sm:flex-row sm:items-start sm:space-x-3">
                                        <FontAwesomeIcon icon={faMapMarkerAlt} className="w-4 h-4 text-gray-400 mt-1 sm:mt-0 mx-auto sm:mx-0 flex-shrink-0" />
                                        <span className="text-gray-400 mt-2 sm:mt-0 block">
                                            No.2/156, 1st Floor, Poonamalle-Avadi Road,<br />
                                            Senneerkuppam, Chennai-56
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Bottom */}
                <div className="mt-12 pt-8 border-t border-gray-800 text-center sm:text-center">
                    <p className="text-gray-400 text-sm">
                        ©{new Date().getFullYear()} PCL Infotech. All rights reserved.{' '}
                        <Link href="/terms-and-conditions" className="text-gray-400 hover:text-white transition-colors duration-200">
                            Terms & Conditions
                        </Link>{' · '}
                        <Link href="/privacy-policy" className="text-gray-400 hover:text-white transition-colors duration-200">
                            Privacy Policy
                        </Link>
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
