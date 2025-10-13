// src/app/coursepage/internship/page.js
import InternshipClient from "@/clientcomponent/internshippage";
import Layout from "@/components/Layout";
// import InternshipClient from "@/components/InternshipClient";

// Server-side metadata (generateMetadata -> runs on server)
export async function generateMetadata() {
  const title = "Internships in IT Company with Job for Freshers | Training & Placement";
  const description =
    "Get internship in IT companies in Chennai with training & job placement. Best IT internship for freshers to launch your tech career at PCL Infotech.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: "https://pclinfotech.com/coursepage/internship",
      siteName: "PCL Infotech",
      type: "website",
      images: [
        {
          url: "https://pclinfotech.com/internship/Internships2.webp",
          width: 1200,
          height: 630,
          alt: "Internship Program at PCL Infotech",
        },
      ],
    },
    alternates: {
      canonical: "https://pclinfotech.com/coursepage/internship",
    },
  };
}

export default function InternshipPage() {
  return (
    <Layout>
      {/* Interactive content lives in the client component */}
      <InternshipClient />
    </Layout>
  );
}
