'use client'
import Link from 'next/link';
import { useMyContext } from '@/src/context/UserInfoContext';
import { useLogoutUserMutation } from '@/src/lib/features/user/userSlice';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';

type linkArrT = {
    href: string,
    pathname: string
}

const linkArray: linkArrT[] = [
    {
        href: '/',
        pathname: 'Home'
    },
    {
        href: '/hotels',
        pathname: 'Hotels'
    },
    {
        href: '/profile',
        pathname: 'Profile'
    },
]

const UserNavbar = () => {
    const { userInfo, setUserInfo } = useMyContext()
    const [logoutUser] = useLogoutUserMutation()
    const [isOpen, setIsOpen] = useState<boolean>(false)

    const logOutFunction = async () => {
        try {
            const response = await logoutUser({}).unwrap();
            if (response.status) {
                setUserInfo(null);
            }
            toast.success(response.message);
            window.location.reload();
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
        <nav className="w-full bg-white shadow-md px-6 py-3 flex items-center justify-between fixed top-0 left-0 z-20">
            {/* Left */}
            <div className="flex items-center gap-5">
                <Link href="/">
                    {/* Logo */}
                    <Image
                        src="/logo/easthotel-logo-Photoroom.png"
                        width={50}
                        height={50}
                        alt="East hotel logo"
                    />
                </Link>


                <div className="hidden md:flex items-center gap-6 text-gray-700 font-medium">
                    {
                        linkArray.map(link => (
                            <Link key={link.href} href={link.href}>{link.pathname}</Link>
                        ))
                    }
                </div>
            </div>
            {/* Hamburger Button (mobile only) */}
            <button
                className="md:hidden p-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            {/* Right */}
            <div className="hidden md:flex items-center gap-3">
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

            {/* Mobile Menu (Dropdown) */}
            {isOpen && (
                <div className="absolute top-full left-0 w-full bg-white border-t border-gray-200 shadow-md md:hidden flex flex-col items-start p-4 space-y-3 animate-fade-in">
                    {
                        linkArray.map(link => (
                            <Link
                                className='w-full text-gray-700 font-medium'
                                key={link.href}
                                href={link.href}
                                onClick={() => setIsOpen(false)}>
                                {link.pathname}
                            </Link>
                        ))
                    }

                    <hr className="w-full border-gray-200" />

                    {userInfo?.firstname ? (
                        <>
                            <div className="font-semibold">Hello, {userInfo?.firstname}</div>
                            <button
                                onClick={() => { logOutFunction(); setIsOpen(false); }}
                                className="w-full mt-2 p-2 rounded-lg border border-rose-500 text-rose-500 hover:bg-rose-500 hover:text-white transition"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <div className="flex flex-col w-full gap-2">
                            <Link href="/login" onClick={() => setIsOpen(false)}>
                                <button className="w-full p-2 rounded-lg border border-sky-500 text-sky-500 hover:bg-sky-500 hover:text-white transition">
                                    Login
                                </button>
                            </Link>
                            <Link href="/register" onClick={() => setIsOpen(false)}>
                                <button className="w-full p-2 rounded-lg border border-sky-500 text-sky-500 hover:bg-sky-500 hover:text-white transition">
                                    Signup
                                </button>
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </nav>
    )
}

export default UserNavbar