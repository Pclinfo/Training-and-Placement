import Image from "next/image";
import Link from "next/link";

// Feature Card Component (Server Component)
const FeatureCard = ({ image, title, href }) => (
  <Link
    href={href}
    className="flex justify-center items-center w-48 h-32 md:w-44 md:h-28 sm:w-40 sm:h-24 
               bg-white rounded-lg shadow-lg hover:scale-105 hover:shadow-blue-200 
               hover:border-b-4 hover:border-blue-600 transition-all cursor-pointer"
  >
    <div className="flex flex-col items-center p-4 space-y-2">
      <Image src={image} alt={title} width={48} height={48} className="object-contain" />
      <p className="text-center text-gray-800 font-medium text-sm">{title}</p>
    </div>
  </Link>
);

const CourseTrainings = () => {
  const features = [
    { image: "/Courses/full_stack_developer_icon.png", title: "Full Stack Developer", href: "#fullStack" },
    { image: "/Courses/ui_icon.png", title: "UI & UX Designer", href: "#UIUX" },
    { image: "/Courses/digital_marketing_icon.png", title: "Digital Marketing", href: "#digitalMarketing" },
    { image: "/Courses/data_analyst_icon.png", title: "Data Analyst", href: "#dataAnalytics" },
    { image: "/Courses/cyber_security_icon.png", title: "Cyber Security", href: "#cyberSecurity" },
    { image: "/Courses/data_science_icon.png", title: "Data Science", href: "#dataScience" },
    { image: "/Courses/devops_icon.png", title: "DevOps", href: "#devOps" },
    { image: "/Courses/robotics_icon.png", title: "Robotics", href: "#robotics" },
  ];

  return (
    <div className="relative">
      {/* Banner Image */}
      <div className="w-full">
        <Image
          src="/Courses/Advanced-placement-2.webp"
          alt="Training Banner"
          width={1920}
          height={500}
          className="w-full h-auto object-cover"
        />
      </div>

      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Training Intro Section */}
          <div className="mb-16 flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/2">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Real-Time IT Training and Placement Courses in India
              </h1>
              <p className="text-gray-600 mb-6">
                Take advantage of our comprehensive training programs and placement opportunities to kickstart your career in technology. Our expert-led courses are designed to help you
                  succeed in today's competitive job market.
              </p>
              <Link
                href="/"
                target="_blank"
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
              >
                Learn More
              </Link>
            </div>
            <div className="md:w-1/2">
              <Image
                src="/Courses/Training-And-Placement-Opportunities-Advanced-placement.webp"
                alt="Graduate"
                width={600}
                height={400}
                className="w-full"
              />
            </div>
          </div>

          {/* Placements Section */}
          <div className="mb-16 flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/2 order-2 md:order-1">
              <Image
                src="/Courses/Placement-Advanced-placement.webp"
                alt="Placement"
                width={600}
                height={400}
                className="rounded-lg shadow-lg w-full"
              />
            </div>
            <div className="md:w-1/2 order-1 md:order-2">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Placements</h2>
              <p className="text-gray-600 mb-6">
                Our placement program has successfully helped numerous students secure positions at leading companies.
              </p>
              <Link href="/coursepage/internship" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors">
                View Details
              </Link>
            </div>
          </div>

          {/* Courses Section */}
          <section id="courses" className="flex flex-col items-center px-4 sm:px-6 md:px-8 lg:px-16 py-12 md:py-16">
            <h2 className="text-2xl md:text-3xl font-bold text-blue-600 mb-12 text-center">
              We are Offering these Training Courses
            </h2>

            {/* Features */}
            <div className="w-full max-w-7xl mb-12">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                {features.map((feature, idx) => (
                  <FeatureCard key={idx} image={feature.image} title={feature.title} href={feature.href} />
                ))}
              </div>
            </div>
      
          </section>
        </div>
      </div>
    </div>
  );
};

export default CourseTrainings;