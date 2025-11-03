'use client'
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
      <div className="flex justify-center items-center h-screen bg-pink-400">
        <h1 className="text-4xl text-white">Home Page</h1>
      </div>
    )
  );
}
