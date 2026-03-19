'use client';
import { useEffect, useState } from 'react';
import { FaBookmark, FaStar } from 'react-icons/fa';
import { IoIosSettings } from "react-icons/io";
import { TabState } from '@/src/types/stateTypes';
import { useMyContext } from '@/src/context/UserInfoContext';
import ProfileTabButton from './ProfileTabButton';
import Loader from '../Loader';
import UserReservations from './UserReservations';
import { useRouter } from 'next/navigation';
import NotFoundPage from '@/src/app/not-found';
import { UserSettings } from './UserSettings';

export default function ProfileTabs() {
  const [activeTab, setActiveTab] = useState<TabState>('reservations');
  const router = useRouter();
  const { userInfo, isLoading } = useMyContext();
  useEffect(() => {
    if (!isLoading && !userInfo?._id) {
      router.push('/login');
    }
  }, [isLoading, userInfo])
  console.log(activeTab);

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-6 border-b border-gray-200 sticky top-0 bg-white z-10 shadow-sm">
        <nav className={`flex -mb-px space-x-4 sm:space-x-8 ${isLoading ? 'pointer-events-none opacity-50' : ''}`}>
          <ProfileTabButton
            tab="reservations"
            label="My Reservations"
            icon={<FaBookmark className="w-4 h-4 text-black" />}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
          <ProfileTabButton
            tab="ratings"
            label="My Ratings"
            icon={<FaStar className="w-4 h-4 text-yellow-300" />}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
          <ProfileTabButton
            tab="settings"
            label="My Settings"
            icon={<IoIosSettings className="w-4 h-4 text-gray-600" />}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </nav>
      </div>

      <div className="py-4">
        {
          isLoading ? (
            <Loader />
          ) : activeTab == 'reservations' ? (
            <UserReservations reservations={userInfo?.reservedRooms ?? []} />
          ) : activeTab == 'ratings' ? (
            <div>Ratings</div>
          ) : activeTab == 'settings' ? (
            <UserSettings />
          ) : <NotFoundPage />
        }
      </div>
    </div>
  );
};