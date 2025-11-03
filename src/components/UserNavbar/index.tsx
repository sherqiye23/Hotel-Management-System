'use client'
import Link from 'next/link';
import { useMyContext } from '@/src/context/UserInfoContext';
import { useLogoutUserMutation } from '@/src/lib/features/user/userSlice';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import toast from 'react-hot-toast';

const UserNavbar = () => {
    const { userInfo, setUserInfo } = useMyContext()
    const [logoutUser] = useLogoutUserMutation()

    const logOutFunction = async () => {
        try {
            const response = await logoutUser({}).unwrap();
            if (response.status) {
                setUserInfo(null)
            }
            toast.success(response.message);
        } catch (error) {
            if ((error as FetchBaseQueryError)?.data) {
                const err = error as FetchBaseQueryError;
                const message =
                    (err.data as any)?.message ||
                    (err.data as any)?.error ||
                    "Something went wrong";
                toast.error(message);
            } else if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("Something went wrong");
            }
        }
    }

    return (
        <nav className="w-full bg-white shadow-md px-6 py-3 flex items-center justify-between fixed top-0 left-0 z-10">
            {/* Left */}
            <div className="flex items-center gap-8">
                <Link href="/" className="text-2xl font-bold text-blue-600">
                    Logo
                </Link>

                <div className="flex items-center gap-6 text-gray-700 font-medium">
                    <Link href="/">Home</Link>
                    <Link href="/hotels">Hotels</Link>
                    <Link href="/profile">Profile</Link>
                </div>
            </div>

            {/* Right */}
            <div className="flex items-center gap-3">
                {
                    userInfo?.firstname ? (
                        <>
                            <div className='text-lg font-semibold'>Hello, {userInfo?.firstname} {userInfo?.lastname}</div>
                            <button onClick={() => logOutFunction()} className="p-2 rounded-lg border border-solid border-rose-500 text-rose-500 hover:bg-rose-500 hover:text-white cursor-pointer transition">
                                <span>Logout</span>
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/login">
                                <button className="p-2 rounded-lg border border-solid border-sky-500 text-sky-500 hover:bg-sky-500 hover:text-white cursor-pointer transition">
                                    Login
                                </button>
                            </Link>
                            <span>or</span>
                            <Link href="/register">
                                <button className="p-2 rounded-lg border border-solid border-sky-500 text-sky-500 hover:bg-sky-500 hover:text-white cursor-pointer transition">
                                    Signup
                                </button>
                            </Link>
                        </>
                    )
                }
            </div>
        </nav>
    )
}

export default UserNavbar