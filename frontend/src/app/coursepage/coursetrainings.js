import CourseTrainings from "@/clientcomponent/coursepage";

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
      url: "https://pclinfotech.com/coursepage/coursetrainings",
      siteName: "PCL Infotech",
      type: "website",
      images: [
        {
          url: "https://pclinfotech.com/coursetrainings/coursetrainingss2.webp",
          width: 1200,
          height: 630,
          alt: "Course trainings at PCL Infotech",
        },
      ],
    },
    alternates: {
      canonical: "https://pclinfotech.com/coursepage/coursetrainings",
    },
  };
}

export default function CourseTrainingsPage() {
  return <CourseTrainings />;
}