import React from 'react';
import { Star, Users, Briefcase, Clock, BookOpen, Target, Zap, Award } from 'lucide-react';

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

// Navigation Component
// const Navbar = () => {
//   const navItems = ['Home', 'About us', 'Careers', 'Internship', 'Project', 'Training cum Placement', 'Contact us'];
  
//   return (
//     <nav className="bg-white shadow-sm sticky top-0 z-50">
//       <div className="max-w-6xl mx-auto px-4">
//         <div className="flex items-center justify-between h-16">
//           <div className="flex items-center space-x-12">
//             {navItems.map((item, index) => (
//               <a
//                 key={index}
//                 href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
//                 className="text-sm text-gray-700 hover:text-blue-600 transition-colors"
//               >
//                 {item}
//               </a>
//             ))}
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// };

// Hero Section Component
const HeroSection = () => {
  return (
    <Section className="py-20">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Learn with expert<br />anytime anywhere
          </h1>
          <p className="text-gray-600 mb-8">
            Our dream is to help people to find the best course online and learn with expert anytime, anywhere.
          </p>
          <div className="flex gap-4">
            <Button variant="primary">Enroll Now →</Button>
            <Button variant="secondary">Know More</Button>
          </div>
        </div>
        <div className="relative">
          <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg p-8 h-80 flex items-center justify-center">
            <div className="text-center text-gray-400">
              <Users size={80} className="mx-auto mb-4" />
              <p>Expert Learning Environment</p>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};

// Training Program Banner
const TrainingBanner = () => {
  return (
    <Section className="py-12 bg-gradient-to-r from-blue-50 to-purple-50">
      <Card className="p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Training cum Placement Program – <span className="text-blue-600">Learn, Grow & Get Hired Instantly!</span>
        </h2>
        <p className="text-gray-600">
          Kick start your IT career with our Training cum Placement Program. Gain industry-ready skills, work on real-time projects, and get guaranteed placement assistance from top tech companies. Learn from experts, build confidence, and secure your dream job!
        </p>
      </Card>
    </Section>
  );
};

// Company Info Section
const CompanyInfo = () => {
  return (
    <Section dark>
      <div>
        <h2 className="text-3xl font-bold mb-4">PCL INFOTECH</h2>
        <p className="text-gray-300 mb-6 leading-relaxed">
          PCL INFOTECH is a leading IT company in Chennai offering custom software, web, and mobile app development, 
          along with digital marketing and web services that help businesses grow through innovation and technology. 
          We believe in building technology that drives success. Our focus on quality, innovation, and client satisfaction 
          has made us a trusted partner for businesses seeking reliable IT solutions in Chennai and beyond.
        </p>
        <Button variant="primary" className="bg-blue-500 hover:bg-blue-600">
          More About us
        </Button>
      </div>
    </Section>
  );
};

// Course Card Component
const CourseCard = ({ badge, title, rating, students, price }) => {
  return (
    <Card className="overflow-hidden">
      <div className="bg-gradient-to-br from-gray-100 to-gray-200 h-40 flex items-center justify-center">
        <BookOpen size={60} className="text-gray-400" />
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="bg-blue-600 text-white text-xs px-3 py-1 rounded">{badge}</span>
          <span className="text-lg font-bold text-blue-600">₹{price}</span>
        </div>
        <h3 className="font-semibold text-gray-900 mb-3">{title}</h3>
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Star size={16} className="fill-yellow-400 text-yellow-400" />
            <span>{rating}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users size={16} />
            <span>{students} students</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

// Industries Section
// const IndustriesSection = () => {
//   const courses = [
//     { badge: 'Design', title: 'Learn Web Design in just 6 Months with 100%...', rating: 5.0, students: '180.7k', price: '30,000' },
//     { badge: 'Business', title: 'Business Analysis Training With 100%...', rating: 5.0, students: '180.7k', price: '28,000' },
//     { badge: 'Development', title: 'Java Full Stack Training with 100%...', rating: 5.0, students: '180.7k', price: '35,000' },
//     { badge: 'Technology', title: 'Learn Generative AI with ChatGPT...', rating: 5.0, students: '180.7k', price: '25,000' }
//   ];

//   return (
//     <Section>
//       <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">Industries We Empower</h2>
//       <p className="text-center text-gray-600 mb-12">
//         PCL INFOTECH offers industry-focused IT training with 100% placement support, helping students and graduates build 
//         real-world skills and start their careers in top tech companies.
//       </p>
//       <div className="grid md:grid-cols-4 gap-6">
//         {courses.map((course, index) => (
//           <CourseCard key={index} {...course} />
//         ))}
//       </div>
//     </Section>
//   );
// };

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
    <Section>
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

      <div className="grid md:grid-cols-2 gap-6">
        {features.map((feature, index) => (
          <Card key={index} className="p-6">
            <div className="flex items-start gap-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <feature.icon className="text-blue-600" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Section>
  );
};

// How It Works Section
const HowItWorksSection = () => {
  const steps = [
    { title: 'Choose your Course', description: 'Browse our catalog and pick a course that matches your career goals and interests.' },
    { title: 'Enroll Instantly', description: 'Sign up in minutes and get immediate access to expert-led lessons and resources.' },
    { title: 'Learn at Your Pace', description: 'Study anytime, anywhere with flexible, self-paced content designed for busy schedules.' },
    { title: 'Get Certified & Grow', description: 'Earn a recognized certificate, build your portfolio, and unlock new career opportunities.' }
  ];

  return (
    <Section className="bg-gray-50">
      <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">How it works</h2>
      <p className="text-center text-gray-600 mb-12">
        Start your journey today – pick your career path, learn step-by-step, and build skills that truly matter.
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

// Final CTA Section
const FinalCTA = () => {
  return (
    <Section className="py-16">
      <Card className="p-12 text-center bg-gradient-to-r from-blue-50 to-purple-50">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Build your Own Project?</h2>
        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
          Join thousands of students who have transformed their ideas into reality. Start your journey with TechMastery today.
        </p>
        <Button variant="primary" className="text-lg px-8 py-3">
          Send Enquiry
        </Button>
      </Card>
    </Section>
  );
};

// Main App Component
export default function CourseTrainings() {
  return (
    <div className="min-h-screen bg-white">
      {/* <Navbar /> */}
      <HeroSection />
      <TrainingBanner />
      <CompanyInfo />
      {/* <IndustriesSection /> */}
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
      <FinalCTA />
    </div>
  );
}



// import Image from "next/image";
// import Link from "next/link";

// // Feature Card Component (Server Component)
// const FeatureCard = ({ image, title, href }) => (
//   <Link
//     href={href}
//     className="flex justify-center items-center w-48 h-32 md:w-44 md:h-28 sm:w-40 sm:h-24 
//                bg-white rounded-lg shadow-lg hover:scale-105 hover:shadow-blue-200 
//                hover:border-b-4 hover:border-blue-600 transition-all cursor-pointer"
//   >
//     <div className="flex flex-col items-center p-4 space-y-2">
//       <Image src={image} alt={title} width={48} height={48} className="object-contain" />
//       <p className="text-center text-gray-800 font-medium text-sm">{title}</p>
//     </div>
//   </Link>
// );

// const CourseTrainings = () => {
//   const features = [
//     { image: "/Courses/full_stack_developer_icon.png", title: "Full Stack Developer", href: "#fullStack" },
//     { image: "/Courses/ui_icon.png", title: "UI & UX Designer", href: "#UIUX" },
//     { image: "/Courses/digital_marketing_icon.png", title: "Digital Marketing", href: "#digitalMarketing" },
//     { image: "/Courses/data_analyst_icon.png", title: "Data Analyst", href: "#dataAnalytics" },
//     { image: "/Courses/cyber_security_icon.png", title: "Cyber Security", href: "#cyberSecurity" },
//     { image: "/Courses/data_science_icon.png", title: "Data Science", href: "#dataScience" },
//     { image: "/Courses/devops_icon.png", title: "DevOps", href: "#devOps" },
//     { image: "/Courses/robotics_icon.png", title: "Robotics", href: "#robotics" },
//   ];

//   return (
//     <div className="relative">
//       {/* Banner Image */}
//       <div className="w-full">
//         <Image
//           src="/Courses/Advanced-placement-2.webp"
//           alt="Training Banner"
//           width={1920}
//           height={500}
//           className="w-full h-auto object-cover"
//         />
//       </div>

//       <div className="bg-white">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
//           {/* Training Intro Section */}
//           <div className="mb-16 flex flex-col md:flex-row items-center gap-8">
//             <div className="md:w-1/2">
//               <h1 className="text-3xl font-bold text-gray-900 mb-4">
//                 Real-Time IT Training and Placement Courses in India
//               </h1>
//               <p className="text-gray-600 mb-6">
//                 Take advantage of our comprehensive training programs and placement opportunities to kickstart your career in technology. Our expert-led courses are designed to help you
//                   succeed in today's competitive job market.
//               </p>
//               <Link
//                 href="/"
//                 target="_blank"
//                 className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
//               >
//                 Learn More
//               </Link>
//             </div>
//             <div className="md:w-1/2">
//               <Image
//                 src="/Courses/Training-And-Placement-Opportunities-Advanced-placement.webp"
//                 alt="Graduate"
//                 width={600}
//                 height={400}
//                 className="w-full"
//               />
//             </div>
//           </div>

//           {/* Placements Section */}
//           <div className="mb-16 flex flex-col md:flex-row items-center gap-8">
//             <div className="md:w-1/2 order-2 md:order-1">
//               <Image
//                 src="/Courses/Placement-Advanced-placement.webp"
//                 alt="Placement"
//                 width={600}
//                 height={400}
//                 className="rounded-lg shadow-lg w-full"
//               />
//             </div>
//             <div className="md:w-1/2 order-1 md:order-2">
//               <h2 className="text-3xl font-bold text-gray-900 mb-4">Placements</h2>
//               <p className="text-gray-600 mb-6">
//                 Our placement program has successfully helped numerous students secure positions at leading companies.
//               </p>
//               <Link href="/coursepage/internship" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors">
//                 View Details
//               </Link>
//             </div>
//           </div>

//           {/* Courses Section */}
//           <section id="courses" className="flex flex-col items-center px-4 sm:px-6 md:px-8 lg:px-16 py-12 md:py-16">
//             <h2 className="text-2xl md:text-3xl font-bold text-blue-600 mb-12 text-center">
//               We are Offering these Training Courses
//             </h2>

//             {/* Features */}
//             <div className="w-full max-w-7xl mb-12">
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
//                 {features.map((feature, idx) => (
//                   <FeatureCard key={idx} image={feature.image} title={feature.title} href={feature.href} />
//                 ))}
//               </div>
//             </div>
      
//           </section>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CourseTrainings;