'use client';
import React, { useState } from 'react';
import UserReservations from './UserReservations';
import UserRatings from './UserRatings';
import { FaBookmark, FaStar, FaSpinner } from 'react-icons/fa';
import { useGetByIdUserQuery } from '@/src/lib/features/user/userSlice';
import { IRatingProfile, IReservationProfile, IUserProfile } from '@/src/types/modelTypes';
import { TabState } from '@/src/types/stateTypes';
import { useMyContext } from '@/src/context/UserInfoContext';
import { skipToken } from "@reduxjs/toolkit/query";

const emptyUserProfile: IUserProfile = {
  _id: "",
  firstname: "Guest",
  lastname: "",
  email: "",
  password: "",
  isAdmin: false,
  reservedRooms: [] as IReservationProfile[],
  ratings: [] as IRatingProfile[]
};

const TabButton: React.FC<{ tab: TabState, label: string, icon: React.ReactNode, activeTab: TabState, setActiveTab: (tab: TabState) => void }> = ({ tab, label, icon, activeTab, setActiveTab }) => (
  <button
    onClick={() => setActiveTab(tab)}
    className={`
            px-4 py-3 text-sm font-medium transition-all duration-300 flex items-center space-x-2
            ${activeTab === tab
        ? 'text-blue-600 border-b-4 border-blue-600 bg-blue-50/50'
        : 'text-gray-500 hover:text-gray-700 hover:border-gray-300 border-b-4 border-transparent'
      }
        `}
  >
    {icon}
    <span>{label}</span>
  </button>
);


const ProfileTabs: React.FC = () => {
  const { userInfo, isLoading } = useMyContext()
  const { data: user, isLoading: userLoading, error } = useGetByIdUserQuery(
    userInfo?._id ?? skipToken
  );

  const [activeTab, setActiveTab] = useState<TabState>('reservations');
  const userProfile = user || emptyUserProfile;

  const renderContent = () => {
    if (userLoading) {
      return (
        <div className="flex items-center justify-center p-10 text-lg text-blue-500">
          <FaSpinner className="w-6 h-6 mr-3 animate-spin" />
          Loading user data...
        </div>
      );
    }

    if (error) {
      console.error("Profile data fetching error:", error);
      return (
        <div className="p-10 text-center text-red-600 bg-red-50 rounded-lg border border-red-200">
          Error loading profile data. Please try again.
        </div>
      );
    }

    // switch (activeTab) {
    //   case 'reservations':
    //     return <UserReservations reservations={userProfile.reservedRooms} />;
    //   case 'ratings':
    //     return <UserRatings ratings={userProfile.ratings} />;
    //   default:
    //     return null;
    // }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome, {isLoading ? '...' : userProfile.firstname} {isLoading ? '' : userProfile.lastname}
        </h1>
      </header>

      <div className="mb-6 border-b border-gray-200 sticky top-0 bg-white z-10 shadow-sm">
        <nav className={`flex -mb-px space-x-4 sm:space-x-8 ${isLoading ? 'pointer-events-none opacity-50' : ''}`}>
          <TabButton
            tab="reservations"
            label="My Reservations"
            icon={<FaBookmark className="w-4 h-4" />}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
          <TabButton
            tab="ratings"
            label="My Ratings"
            icon={<FaStar className="w-4 h-4" />}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </nav>
      </div>

      <div className="py-4">
        {renderContent()}
      </div>
    </div>
  );
};

export default ProfileTabs;