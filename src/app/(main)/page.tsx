'use client'
import AboutSection from "@/src/components/Home components/AboutSection";
import FeedbackSection from "@/src/components/Home components/FeedbackSection";
import HeroSection from "@/src/components/Home components/HeroSection";
import { useMyContext } from "@/src/context/UserInfoContext";

export default function Home() {
  const { userInfo, setUserInfo, isLoading } = useMyContext()
  console.log(userInfo);
  return (
    isLoading ? (
      <div className="flex justify-center items-center h-screen bg-gray-950">
        <h1 className="text-3xl text-white">loading...</h1>
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
