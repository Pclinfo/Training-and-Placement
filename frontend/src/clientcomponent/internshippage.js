"use client";
import React, { useState } from 'react';
import Head from 'next/head';
import InternshipModalForm from '@/modelform/InternshipModalForm';


const InternshipClient = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);


  return (
    <div className="bg-white">
      <div className="flex justify-center items-center p-5">
        <img src="/internship/Internships2.webp" alt="Internship Program" className="w-full h-auto max-w-[1650px]" />
      </div>

      {/* Internship Overview Section */}
      <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-5 lg:gap-20 p-5 mt-10">
        <img src="/internship/tp_insp_img_2.png" alt="Internship Overview" className="w-full h-auto max-w-[550px] sm:max-w-[400px] md:max-w-[380px] lg:max-w-[550px]" />
        <div className="max-w-[950px]">
          <div className="text-left">
            <h1 className="text-4xl text-[#004aad] font-semibold">Best IT Internships in Chennai with Job Placement for Freshers</h1>
          </div>

          <h4 className="mt-5 text-lg font-normal text-gray-600">
            Kick-start your career with our comprehensive internship programs. At PCL Infotech, we offer real-world experience and valuable learning opportunities in a supportive and innovative environment. Our internships provide hands-on learning opportunities, enabling individuals to apply theoretical knowledge in a real-world work environment.
          </h4>
          <h3 className="mt-5 text-xl font-semibold text-[#004aad]">Hands-On Learning</h3>
          <p className="text-lg font-normal text-gray-600">Gain practical experience by working on live projects that challenge and develop your skills.</p>
          <h3 className="mt-5 text-xl font-semibold text-[#004aad]">Mentorship</h3>
          <p className="text-lg font-normal text-gray-600">Receive guidance and feedback from experienced professionals who are dedicated to your growth.</p>
          <h3 className="mt-5 text-xl font-semibold text-[#004aad]">Skill Development</h3>
          <p className="text-lg font-normal text-gray-600">Build a strong foundation in your field with exposure to the latest technologies and industry practices.</p>
          <h3 className="mt-5 text-xl font-semibold text-[#004aad]">Career Preparation</h3>
          <p className="text-lg font-normal text-gray-600">Prepare for your future career in a dynamic, collaborative, and innovative environment.</p>
        </div>
      </div>

      {/* Our Offerings Section */}
      <div className="text-center mt-10">
        <h2 className="text-2xl font-bold text-[#004aad]">Our Offerings</h2>
        <p className="mt-2 text-lg font-normal text-gray-600">One of the industry's leading Project Based Career Programs offered by PCL INFOTECH, promising Placement Guidance upon course completion.</p>
      </div>

      {/* Cards Section */}
      <div className="flex flex-col items-center mt-10">
        <div className="flex flex-wrap justify-center gap-6 p-5">
          {/* Card 1 */}
          <div className="flex flex-col items-center justify-center bg-white shadow-lg rounded-lg w-[350px] p-4">
            <img src="/internship/stack_develop.png" alt="Full Stack Developer" className="w-40 h-auto" />
            <button onClick={openModal} className="flex items-center justify-between bg-[#004aad] text-white rounded py-2 px-4 mt-4 transition duration-300 hover:bg-[#00308a]">
              View Course
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>

            <h3 className="mt-4 text-lg font-normal text-gray-600 font-semibold">FULL STACK DEVELOPER</h3>
          </div>



          {/* Card 2 */}
          <div className="flex flex-col items-center justify-center bg-white shadow-lg rounded-lg w-[350px] p-4">
            <img src="/internship/ui_ux_desinger_1.png" alt="UI UX Designer" className="w-40 h-auto" />
            <button onClick={openModal} className="flex items-center justify-between bg-[#004aad] text-white rounded py-2 px-4 mt-4 transition duration-300 hover:bg-[#00308a]">
              View Course
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
            <h3 className="mt-4 text-lg font-normal text-gray-600 font-semibold">UI UX DESIGNER</h3>
          </div>

          <div className="flex flex-col items-center justify-center bg-white shadow-lg rounded-lg w-[350px] p-4">
            <img src="/internship/data.png" alt="Data Analyst" className="w-40 h-auto" />
            <button onClick={openModal} className="flex items-center justify-between bg-[#004aad] text-white rounded py-2 px-4 mt-4 transition duration-300 hover:bg-[#00308a]">
              View Course
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
            <h3 className="mt-4 text-lg font-normal text-gray-600 font-semibold">DATA ANALYST</h3>
          </div>
          <div className="flex flex-col items-center justify-center bg-white shadow-lg rounded-lg w-[350px] p-4">
            <img src="/internship/digital_market.png" alt="Digital Marketing" className="w-40 h-auto" />
            <button onClick={openModal} className="flex items-center justify-between bg-[#004aad] text-white rounded py-2 px-4 mt-4 transition duration-300 hover:bg-[#00308a]">
              View Course
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
            <h3 className="mt-4 text-lg font-normal text-gray-600 font-semibold">DIGITAL MARKETING</h3>
          </div>

        </div>

        <InternshipModalForm isOpen={isModalOpen} onClose={closeModal}
        />
      </div>
      <div className="flex flex-col items-center mt-10">
        <div className="flex flex-wrap justify-center gap-6 p-5">
          {/* Card 1 */}
          <div className="flex flex-col items-center justify-center bg-white shadow-lg rounded-lg w-[350px] p-4">
            <img src="/internship/Cyber_security.jpg" alt="Cybersecurity" className="w-40 h-auto" />
            <button onClick={openModal} className="flex items-center justify-between bg-[#004aad] text-white rounded py-2 px-4 mt-4 transition duration-300 hover:bg-[#00308a]">
              View Course
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>

            <h3 className="mt-4 text-lg font-normal text-gray-600 font-semibold">Cyber Security</h3>
          </div>



          {/* Card 2 */}
          <div className="flex flex-col items-center justify-center bg-white shadow-lg rounded-lg w-[350px] p-4">
            <img src="/internship/Data_Science.jpg" alt="DataScience" className="w-40 h-auto" />
            <button onClick={openModal} className="flex items-center justify-between bg-[#004aad] text-white rounded py-2 px-4 mt-4 transition duration-300 hover:bg-[#00308a]">
              View Course
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
            <h3 className="mt-4 text-lg font-normal text-gray-600 font-semibold">Data Science</h3>
          </div>

          <div className="flex flex-col items-center justify-center bg-white shadow-lg rounded-lg w-[350px] p-4">
            <img src="/internship/devops.png" alt="DevOps" className="w-40 h-auto" />
            <button onClick={openModal} className="flex items-center justify-between bg-[#004aad] text-white rounded py-2 px-4 mt-4 transition duration-300 hover:bg-[#00308a]">
              View Course
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
            <h3 className="mt-4 text-lg font-normal text-gray-600 font-semibold">DevOps</h3>
          </div>
          <div className="flex flex-col items-center justify-center bg-white shadow-lg rounded-lg w-[350px] p-4">
            <img src="/internship/Robotics_automation.jpg" alt="Roboticsautomation" className="w-40 h-auto" />
            <button onClick={openModal} className="flex items-center justify-between bg-[#004aad] text-white rounded py-2 px-4 mt-4 transition duration-300 hover:bg-[#00308a]">
              View Course
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
            <h3 className="mt-4 text-lg font-normal text-gray-600 font-semibold">Robotics Automation</h3>
          </div>

        </div>

        <InternshipModalForm isOpen={isModalOpen} onClose={closeModal}
        />
      </div>
    </div>
  );
};

export default InternshipClient;