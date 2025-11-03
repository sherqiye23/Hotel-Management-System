import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import ReduxProvider from "../lib/provider/ReduxProvider";
import UserInfoContext from "../context/UserInfoContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hotel Management System",
  description: "A hotel management system (HMS) is a comprehensive software platform that automates and streamlines a hotel's daily operations, acting as a central hub for all data and activities. It manages various tasks from both the front and back office, including reservation management, guest check-in.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ReduxProvider>
          <UserInfoContext>
            <Toaster position="top-center" />
            {children}
          </UserInfoContext>
        </ReduxProvider>
      </body>
    </html>
  );
}
