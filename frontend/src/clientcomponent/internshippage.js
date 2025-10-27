"use client";
import React, { useState } from 'react';
import Head from 'next/head';
import InternshipModalForm from '@/modelform/InternshipModalForm';
import InternshipsPage from '@/app/internships/page';


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
      <div className="items-center mt-10">
        <InternshipsPage />
      </div>
    </div>
  );
};

export default InternshipClient;