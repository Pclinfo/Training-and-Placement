"use client";

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaChevronDown } from "react-icons/fa";
import React, { useState, useEffect } from 'react';
import { GiHamburgerMenu } from "react-icons/gi";
import { FiPhoneCall } from 'react-icons/fi';
import { FaLocationDot } from 'react-icons/fa6';
import { TfiEmail } from 'react-icons/tfi';
import { FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa";
import ContactModelForm from '@/modelform/ContactModalForm';

export default function Navbar() {
  const [popup, setPopup] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Prevent body scroll when popup is open
  useEffect(() => {
    if (popup) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [popup]);

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

  const toggleDropdown = (menu) => {
    setActiveDropdown((prev) => (prev === menu ? null : menu));
  };

  const handleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handlePopupOpen = () => {
    setPopup(true);
  };

  const handlePopupClose = () => {
    setPopup(false);
  };

  const addressdetail = [
    {
      icon: <FiPhoneCall className='text-red-600 text-sm font-bold' />,
      title: "Call Us Anytime",
      cnt: "+91 72000 - 74253",
    },
    {
      icon: <TfiEmail className='text-red-600 text-xl font-semibold' />,
      title: "Send Mail",
      cnt: "info@pclinfotech.com"
    },
    {
      icon: <FaLocationDot className='text-red-600 text-xl font-semibold' />,
      title: "Our Address",
      cnt: "No.2/156, 1st Floor, Poonamalle-Avadi Road,Senneerkuppam, Chennai-56"
    },
  ];

  const followMedia = [
    {
      icon: <FaTwitter size={26} />,
      path: "/"
    },
    {
      icon: <FaLinkedin size={26} />,
      path: "/"
    },
    {
      icon: <FaInstagram size={26} />,
      path: "/"
    },
  ];


  // const followMedia = [    
  //   {
  //     icon: '/socila-media-icons/twitter.svg',
  //     path: "/"
  //   },
  //   {
  //     icon: '/socila-media-icons/linkedin.svg',
  //     path: "/"
  //   },
  //   {
  //     icon: '/socila-media-icons/insta.svg',
  //     path: "/"
  //   },
  // ];

  const menus = [
    // Uncomment and modify as needed
    // {
    //   name: "Study Abroad",
    //   links: ["Study Abroad", "Study USA"],
    //   paths: [
    //     "/studyabroad",
    //     "/studyabroad/usa"
    //   ],
    // },
    // {
    //   name: "Coaching",
    //   links: ["GRE", "TOEFL", "SAT", "GMAT", "IELTS", "PTE"],
    //   paths: [
    //     "/coaching/gre-coaching-in-chennai",
    //     "/coaching/toefl-coaching-in-chennai",
    //     "/coaching/sat-coaching-in-chennai",
    //     "/coaching/gmat-coaching-in-chennai",
    //     "/coaching/ielts-coaching-in-chennai",
    //     "/coaching/pte-coaching-in-chennai",
    //   ],
    // },
    // {
    //   name: "Visa Services",
    //   links: ["Work Visa", "Immigration"],
    //   paths: [
    //     "/visa/work-visa",
    //     "/visa/immigration"
    //   ],
    // },
  ];

  return (

    <>
      <section className='bg-white w-full shadow-lg sticky top-0 z-50'>
        <div className='container mx-auto px-4'>
          <div className='flex items-center justify-between py-4'>
            {/* Header Logo */}
            <div className='flex-shrink-0'>
              <Link className='no-underline' href="/">
                <Image src="/logo.png" alt="Pcl logo - Best Training & Placement"
                  width={160} height={32} className="w-full h-auto max-w-[100px] md:max-w-[200px]"
                  sizes="(max-width: 768px) 100px, 200px" loading="lazy" />
              </Link>
            </div>



            {/* Desktop Menu */}
            <div className='hidden xl:flex items-center space-x-6'>
              {menus.map((menu, index) => (
                <div key={index} className='relative group'>
                  <div className='flex items-center space-x-1'>
                    {menu.name === "Coaching" ? (
                      <Link href="/coaching" className="no-underline">
                        <h6
                          onMouseEnter={() => setActiveDropdown(menu.name)}
                          className={`text-base font-bold text-black mb-0 cursor-pointer hover:text-red-600 relative pb-6 transition-colors duration-300 ${pathname.includes('/coaching') ? 'text-red-600 after:w-full' : ''
                            } after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-red-600 after:transition-all after:duration-500 hover:after:w-full`}>
                          {menu.name}
                        </h6>
                      </Link>
                    ) : (
                      <h6
                        onMouseEnter={() => setActiveDropdown(menu.name)}
                        className={`text-base font-bold text-black mb-0 cursor-pointer hover:text-red-600 relative pb-6 transition-colors duration-300 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-red-600 after:transition-all after:duration-500 hover:after:w-full`}>
                        {menu.name}
                      </h6>
                    )}
                    <div className={`flex justify-end transition-transform duration-300 ${activeDropdown === menu.name ? 'rotate-180' : ''
                      }`}>
                      <FaChevronDown size={16} color='#000' />
                    </div>
                  </div>
                  {activeDropdown === menu.name && (
                    <div
                      className='absolute top-full left-0 mt-2 bg-white shadow-lg rounded-md py-2 min-w-max z-50'
                      onMouseLeave={() => setActiveDropdown(null)}
                    >
                      {menu.links.map((link, linkIndex) => (
                        <Link
                          key={linkIndex}
                          className='block px-4 py-2 text-black hover:bg-gray-100 hover:text-red-600 no-underline transition-colors duration-200'
                          href={`${menu.paths[linkIndex] || '/coaching'}`}
                        >
                          <p className='text-base mb-0'>{link}</p>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              <Link className='no-underline' href="/">
                <h6 className={`text-base py-4 font-bold mb-0 cursor-pointer hover:text-red-600 relative pb-6 transition-colors duration-300 ${pathname === '/' ? 'text-red-600 after:w-full' : 'text-black'
                  } after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-red-600 after:transition-all after:duration-500 hover:after:w-full`}>
                  Home
                </h6>
              </Link>

              <Link className='no-underline' href="/coursepage/internship">
                <h6 className={`text-base py-4 font-bold mb-0 cursor-pointer hover:text-red-600 relative pb-6 transition-colors duration-300 ${pathname === '/coursepage/internship' ? 'text-red-600 after:w-full' : 'text-black'
                  } after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-red-600 after:transition-all after:duration-500 hover:after:w-full`}>
                  Internship
                </h6>
              </Link>
             
              <Link className='no-underline' href="/admin">
                <h6 className={`text-base py-4 font-bold mb-0 cursor-pointer hover:text-red-600 relative pb-6 transition-colors duration-300 ${pathname === '/admin' ? 'text-red-600 after:w-full' : 'text-black'
                  } after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-red-600 after:transition-all after:duration-500 hover:after:w-full`}>
                  admin
                </h6>
              </Link>
              <Link className='no-underline' href="/subcourses">
                <h6 className={`text-base py-4 font-bold mb-0 cursor-pointer hover:text-red-600 relative pb-6 transition-colors duration-300 ${pathname === '/subcourses' ? 'text-red-600 after:w-full' : 'text-black'} after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-red-600 after:transition-all after:duration-500 hover:after:w-full`}>
                  CoursePaymentPage
                </h6>
              </Link>
              <Link className='no-underline' href="/coursepage/contactpage">
                <h6 className={`text-base py-4 font-bold mb-0 cursor-pointer hover:text-red-600 relative pb-6 transition-colors duration-300 ${pathname === '/coursepage/contactpage' ? 'text-red-600 after:w-full' : 'text-black'} after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-red-600 after:transition-all after:duration-500 hover:after:w-full`}>
                  Contact Us
                </h6>
              </Link>
            </div>

            {/* Book Appointment Button - Desktop */}
            <div className='hidden md:block'>
              <button
                onClick={handlePopupOpen}
                className='bg-blue-600 text-white px-6 py-2 rounded-md font-semibold text-sm hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-300'
              >
                Book an Appointment
              </button>
            </div>

            {/* Burger Icon */}
            <div
              className={`xl:hidden cursor-pointer ${isMobileMenuOpen ? 'hidden' : 'block'}`}
              onClick={handleMobileMenu}
            >
              <GiHamburgerMenu size={24} color='#B31942' />
            </div>
          </div>
        </div>

        {/* Mobile Nav Overlay */}
        {isMobileMenuOpen && (
          <div className='fixed inset-0 bg-black bg-opacity-50 z-40' onClick={handleMobileMenu}></div>
        )}

        {/* Mobile Nav */}
        <div className={`fixed top-0 left-0 w-80 h-full bg-gray-800 transition-transform duration-300 ease-in-out z-50 overflow-y-auto ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}>
          <div className='p-4'>
            <div className='flex items-center justify-between mb-8'>
              <div className='flex-shrink-0'>
                <Link className='no-underline' href="/">
                  <Image src="/logo.png" alt="Pcl logo - Best Training & Placement"
                    width={160} height={32} className="w-full h-auto max-w-[100px] md:max-w-[200px]"
                    sizes="(max-width: 768px) 100px, 200px" loading="lazy" />
                </Link>
              </div>
              <button
                className='text-white text-2xl font-bold hover:text-gray-300 transition-colors duration-200'
                onClick={handleMobileMenu}
                aria-label="Close menu"
              >
                ×
              </button>
            </div>

            {/* Mobile Menu Items */}
            <div className='space-y-4'>
              {menus.map((menu, index) => (
                <div key={index}>
                  <div
                    className='flex items-center justify-between cursor-pointer'
                    onClick={() => toggleDropdown(menu.name)}
                  >
                    <p className='text-base font-semibold text-white mb-0'>{menu.name}</p>
                    <div className={`transition-transform duration-300 ${activeDropdown === menu.name ? 'rotate-180' : '-rotate-90'
                      }`}>
                      <FaChevronDown size={16} color='#FFFFFF' />
                    </div>
                  </div>
                  {activeDropdown === menu.name && (
                    <div className='mt-4 pl-4 space-y-2'>
                      {menu.links.map((link, idx) => (
                        <Link
                          className='block no-underline'
                          key={idx}
                          href={menu.paths[idx]}
                          onClick={handleMobileMenu}
                        >
                          <p className={`text-base font-medium py-2 px-3 rounded transition-colors duration-200 mb-0 ${pathname === menu.paths[idx]
                            ? 'bg-red-600 text-white'
                            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                            }`}>
                            {link}
                          </p>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              <Link className='block no-underline' href="/" onClick={handleMobileMenu}>
                <p className={`text-base font-semibold py-2 mb-0 ${pathname === '/' ? 'text-red-400' : 'text-white'
                  }`}>
                  Home
                </p>
              </Link>

              <Link className='block no-underline' href="/coursepage/internship" onClick={handleMobileMenu}>
                <p className={`text-base font-semibold py-2 mb-0 ${pathname === '/coursepage/internship' ? 'text-red-400' : 'text-white'
                  }`}>
                  Internship
                </p>
              </Link>
              <Link className='block no-underline' href="/subcourses" onClick={handleMobileMenu}>
                <p className={`text-base font-semibold py-2 mb-0 ${pathname === '/subcourses' ? 'text-red-400' : 'text-white'
                  }`}>
                  CoursePaymentPage
                </p>
              </Link>
              <Link className='block no-underline' href="/coursepage/contactpage" onClick={handleMobileMenu}>
                <p className={`text-base font-semibold py-2 mb-0 ${pathname === '/coursepage/contactpage' ? 'text-red-400' : 'text-white'
                  }`}>
                  Contact Us
                </p>
              </Link>


              {/* Book Appointment Button - Mobile */}
              <div className='pt-4'>
                <button
                  onClick={() => {
                    handlePopupOpen();
                    handleMobileMenu();
                  }}
                  className='w-full bg-blue-600 text-white px-6 py-3 rounded-md font-bold text-sm hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-300'
                >
                  Book an Appointment
                </button>
              </div>
            </div>

            {/* Contact Info */}
            <div className='mt-8 space-y-6'>
              {addressdetail.map((items, index) => (
                <div className='flex gap-6' key={index}>
                  <div className="bg-white rounded-full p-2 w-9 h-9 flex items-center justify-center flex-shrink-0">
                    {items.icon}
                  </div>
                  <div>
                    <p className='text-sm font-semibold text-white mb-2'>{items.title}</p>
                    <p className='text-sm font-medium text-white break-words'>{items.cnt}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Social Media */}
            <div className="flex items-center gap-4 mt-10 pb-4">
              <h2 className="text-lg font-bold text-white">Follow us</h2>
              {followMedia.map((media, index) => (
                <Link
                  href={media.path}
                  key={index}
                  className="hover:opacity-80 transition-opacity duration-200 text-white"
                >
                  {media.icon}
                </Link>
              ))}
            </div>


            {/* Social Media */}
            {/* <div className='flex items-center gap-4 mt-10 pb-4'>
              <h2 className='text-lg font-bold text-white'>Follow us</h2>
              {followMedia.map((icons, iconIndex) => (
                <Link href={icons.path} key={iconIndex} className="hover:opacity-80 transition-opacity duration-200">
                  <Image
                    src={icons.icon}
                    width={26}
                    height={26}
                    alt='Social media icon'
                  />
                </Link>
              ))}
            </div> */}
          </div>
        </div>
      </section>

      {/* Popup Form */}
      {popup && (
        <div className='fixed inset-0 flex items-center justify-center z-[9999] animate-fade-in'>
          <div className='absolute inset-0  bg-opacity-50 backdrop-blur-sm' onClick={handlePopupClose}></div>
          <div className='relative bg-white rounded-lg max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto shadow-2xl'>
            <ContactModelForm close={handlePopupClose} />
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
