import Link from 'next/link'
import { AiOutlineArrowLeft } from "react-icons/ai";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100 text-gray-800">
      <h1 className="text-[10rem] font-extrabold text-transparent bg-clip-text bg-linear-to-r from-blue-500 to-indigo-600 leading-none">
        404
      </h1>

      <h2 className="text-3xl font-semibold mt-4 mb-2">Oops! Page not found</h2>
      <p className="text-gray-600 mb-8 max-w-md text-center">
        The page you're looking for might have been removed, renamed, or is temporarily unavailable.
      </p>

      <Link
        href="/"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition duration-300"
      >
        <AiOutlineArrowLeft className="w-5 h-5" />
        Go back home
      </Link>

      <div className="absolute inset-0 -z-10 flex justify-center items-center overflow-hidden opacity-10">
        <div className="w-[500px] h-[500px] bg-blue-300 rounded-full blur-3xl animate-pulse"></div>
      </div>
    </div>
  )
}

export default NotFoundPage