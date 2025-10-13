import Layout from "@/components/Layout";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import CourseTrainings from "./coursepage/coursetrainings";
// import Internship from "@/componentPages/InternshipPage";


export default function Home() {
  return (
    // <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
    <div > 
      <Layout>
        <CourseTrainings/>
        {/* <Internship/> */}
      </Layout>
   
    </div>
  );
}
