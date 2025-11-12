"use client"
import React from 'react';
import { Star, Users, Briefcase, Clock, BookOpen, Target, Zap, Award } from 'lucide-react';
import { useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";

// Reusable Button Component
const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyles = 'px-6 py-2.5 rounded font-medium transition-all duration-200';
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-white text-gray-800 border border-gray-300 hover:bg-gray-50'
  };
  
  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

// Reusable Card Component
const Card = ({ children, className = '' }) => {
  return (
    <div className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ${className}`}>
      {children}
    </div>
  );
};

// Reusable Section Container
const Section = ({ children, className = '', dark = false }) => {
  return (
    <section className={`py-16 ${dark ? 'bg-gray-800 text-white' : 'bg-white'} ${className}`}>
      <div className="max-w-6xl mx-auto px-4">
        {children}
      </div>
    </section>
  );
};

// Hero Section Component
const HeroSection = () => {
  return (
    <Section className="py-20">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        {/* Text Content */}
        <div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Learn with expert<br />anytime anywhere
          </h1>
          <p className="text-gray-600 mb-8">
            Our dream is to help people find the best course online and learn with experts anytime, anywhere.
          </p>
          <div className="flex gap-4">
            <Button variant="primary">Enroll Now →</Button>
            <Button variant="secondary">Know More</Button>
          </div>
        </div>

        {/* Image Section */}
        <div className="relative">
          <img
            src="/home/Images.png" alt="Learning with experts" className="w-full h-full object-cover" />
        </div>
      </div>
    </Section>
  );
};


// Training Program Banner
const TrainingBanner = () => {
  return (
 <Section className="relative bg-[url('/home/Gemini_Generated.png')] bg-cover bg-center bg-no-repeat py-16 px-6">
  <div className="bg-black bg-opacity-50 p-8 sm:p-16 md:p-32 lg:p-40 rounded-lg text-center md:text-left max-w-5xl mx-auto">
    <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-white">
      Training cum Placement Program –{" "}
      <span className="text-blue-600">Learn, Grow & Get Hired Instantly!</span>
    </h2>
    <p className="text-gray-200 leading-relaxed text-base sm:text-lg">
      Kick start your IT career with our Training cum Placement Program. Gain
      industry-ready skills, work on real-time projects, and get guaranteed
      placement assistance from top tech companies. Learn from experts, build
      confidence, and secure your dream job!
    </p>
  </div>
</Section>

  );
};

// Company Info Section
const CompanyInfo = () => {
    const router = useRouter();

  const handleRedirect = () => {
    router.push("/subcourses");
  };
  return (
 <Section className="relative bg-[url('/home/bgImage.png')] bg-cover bg-center bg-no-repeat py-16 px-6">
  <div className="bg-black bg-opacity-50 p-6 sm:p-16 md:p-24 lg:p-32 rounded-lg text-center sm:text-left flex flex-col items-center sm:items-start">
    <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-white">Build Skills ! <span className="text-blue-600">Gain Experience !</span> Get Hired !
</h2>
    <p className="text-gray-200 mb-6 leading-relaxed text-sm sm:text-base max-w-xl">
          Our Training & Placement Program is designed to help students and fresh graduates become industry-ready professionals. We focus on practical learning, real-time projects, internships, and placement support to prepare students for successful careers in the IT industry.
    </p>
    <p className="text-gray-200 mb-6 leading-relaxed text-sm sm:text-base max-w-xl">This approach ensures students gain hands-on experience while companies benefit from job-ready talent</p>
    <Button onClick={handleRedirect} variant="primary" className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-md transition duration-300z">
      More About us
    </Button>
  </div>
</Section>

  );
};


// CTA Section
const CTASection = ({ title, description, buttons }) => {
  return (
    <Section className="py-12 bg-gray-50">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">{title}</h2>
        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">{description}</p>
        <div className="flex gap-4 justify-center">
          {buttons.map((btn, index) => (
            <Button key={index} variant={btn.variant}>
              {btn.text}
            </Button>
          ))}
        </div>
      </div>
    </Section>
  );
};

// Stats Component
const StatsCard = ({ icon: Icon, value, label }) => {
  return (
    <div className="text-center">
      <div className="flex justify-center mb-3">
        <Icon size={40} className="text-blue-600" />
      </div>
      <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
      <div className="text-gray-600 text-sm">{label}</div>
    </div>
  );
};

// Why Choose Section
const WhyChooseSection = () => {
  const features = [
    { icon: BookOpen, title: 'Learn from Experts', description: 'In every professional with 7+ years of experience guide you every step of the way.' },
    { icon: Target, title: 'Hands-On Learning', description: 'Learn what you learn with real-world projects, interactive strategies, and portfolio-ready work that prepare you for on-the-job tasks.' },
    { icon: Zap, title: 'Flexible Learning', description: 'Study on your terms with 1:1 or group sessions, or classes led by you and fast-track your career at your own pace.' },
    { icon: Award, title: 'Career-Focused', description: 'We understand the real-time IT work flow, deliver interviews and get targeted industry-relevant training made to clear set for a path to your life and career success.' }
  ];

  return (
    <Section className="relative bg-[url('/home/Gemini.png')] bg-cover bg-center bg-no-repeat py-16 px-6">
      <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">Why Choose PCL placement</h2>
      <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
        At PCL INFOTECH, we're dedicated to providing a complete training and placement program that prepares you for real-world success. 
        With industry-focused learning, hands-on projects, and expert guidance, we help you build the right skills and achieve your dream career with confidence.
      </p>
      
      <div className="grid md:grid-cols-3 gap-8 mb-12">
        <StatsCard icon={Target} value="95%" label="Job Placement Rate" />
        <StatsCard icon={Briefcase} value="500+" label="Partner Companies" />
        <StatsCard icon={Clock} value="24/7" label="Mentor Support" />
      </div>

      <div className="grid md:grid-cols-2 gap-6 ">
        {features.map((feature, index) => (
          <div key={index} className="p-6 bg-black bg-opacity-60 p-8 rounded-lg">
            <div className="flex items-start gap-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <feature.icon className="text-blue-600" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-white-900 mb-2">{feature.title}</h3>
                <p className="text-white-600 text-sm">{feature.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
};

// How It Works Section
const HowItWorksSection = () => {
  const steps = [
    { title: 'Choose your Domain', description: 'Browse our catalog and pick a course that matches your career goals and interests.' },
    { title: 'Enroll Instantly', description: 'Sign up in minutes and get immediate access to expert-led lessons and resources.' },
    { title: 'Learn Through Practical Tasks', description: 'Study anytime, anywhere with flexible, self-paced content designed for busy schedules.' },
    { title: 'Work on a Real-Time Project', description: 'Earn a recognized certificate, build your portfolio, and unlock new career opportunities.' },
    { title: 'Internship', description: 'Earn a recognized certificate, build your portfolio, and unlock new career opportunities.' },
    { title: 'Placement', description: 'Earn a recognized certificate, build your portfolio, and unlock new career opportunities.' }
  ];

  return (
    <Section className="bg-gray-50">
      <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">How it works</h2>
      <p className="text-center text-gray-600 mb-12">
        Our Training & Placement Program follows a step-by-step learning and career building process:
      </p>
      <div className="grid md:grid-cols-4 gap-6">
        {steps.map((step, index) => (
          <Card key={index} className="p-6 text-center">
            <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
              {index + 1}
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">{step.title}</h3>
            <p className="text-gray-600 text-sm">{step.description}</p>
          </Card>
        ))}
      </div>
    </Section>
  );
};

export default function CourseTrainings() {
  return (
    <div className="min-h-screen bg-white">
      <CompanyInfo />
      <HeroSection />
      <TrainingBanner />
      <CTASection 
        title="Ready to Build your Own Project?"
        description="Whether you need guidance and tech services or want to showcase your skills through our cutting-edge tools, we're here to help you succeed."
        buttons={[
          { text: 'Explore Services →', variant: 'primary' },
          { text: 'View Training Programs', variant: 'secondary' }
        ]}
      />
      <WhyChooseSection />
      <HowItWorksSection />
    </div>
  );
}
