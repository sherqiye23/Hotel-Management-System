'use client'
import AboutSection from "@/src/components/Home components/AboutSection";
import FeedbackSection from "@/src/components/Home components/FeedbackSection";
import HeroSection from "@/src/components/Home components/HeroSection";
import Loader from "@/src/components/Loader";
import { useMyContext } from "@/src/context/UserInfoContext";

export default function Home() {
  const { userInfo, setUserInfo, isLoading } = useMyContext()
  console.log(userInfo);
  return (
    isLoading ? (
      <div className="flex justify-center items-center h-[91.5vh] bg-gray-950">
        <Loader />
      </div>
    ) : (
      <div className="rounded-4xl">
        <HeroSection />
        <AboutSection />
        <FeedbackSection />
      </div>
    )
  );
}
