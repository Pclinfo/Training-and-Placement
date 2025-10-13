import ContactInfo from "@/clientcomponent/contactinfo";

// ✅ Server-side metadata
export async function generateMetadata() {
  const title = "Course Trainings in IT Company with Job for Freshers | Training & Placement";
  const description =
    "Get course trainings in IT companies in Chennai with training & job placement. Best IT courses for freshers to launch your tech career at PCL Infotech.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: "https://pclinfotech.com/subcourses/contactinfo",
      siteName: "PCL Infotech",
      type: "website",
      images: [
        {
          url: "https://pclinfotech.com/contactinfo/contactinfos2.webp",
          width: 1200,
          height: 630,
          alt: "Course trainings at PCL Infotech",
        },
      ],
    },
    alternates: {
      canonical: "https://pclinfotech.com/subcourses/contactinfo",
    },
  };
}

// ✅ Page component (no manual Layout import here)
export default function ContactPage() {
  return <ContactInfo />;
}
