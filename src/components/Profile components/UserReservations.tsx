import React from 'react';
import { FaCalendarCheck, FaEuroSign } from 'react-icons/fa';
import { IoIosCloseCircle } from "react-icons/io";
import { IReservationProfile } from '@/src/types/modelTypes';
import { useRouter } from 'next/navigation';
import { IoLogoUsd } from "react-icons/io5";
import { IReservationContextType } from '@/src/types/contextTypes';

interface UserReservationsProps {
    reservations: IReservationContextType[];
}

const getStatusColor = (status: IReservationProfile['status']): string => {
    switch (status) {
        case 'confirmed':
            return 'text-green-600 bg-green-100';
        case 'pending':
            return 'text-yellow-600 bg-yellow-100';
        case 'cancelled':
            return 'text-red-600 bg-red-100';
        default:
            return 'text-gray-600 bg-gray-100';
    }
};

const getReservationClass = (reservationDate: Date) => {
    return new Date(reservationDate) < new Date()
        ? 'bg-gray-50 opacity-60'
        : 'bg-white';
}

const UserReservations: React.FC<UserReservationsProps> = ({ reservations }) => {
    const router = useRouter();

    return (
        reservations.length === 0 ? (
            <div className="p-6 text-center text-gray-500 bg-white rounded-lg shadow-inner">
                You currently have no reservations
            </div>
        ) : (
            <div className="grid gap-6">
                {reservations.map((res) => (
                    <div
                        key={String(res._id)}
                        onClick={() => router.push(`/rooms/${res.roomId.slug}`)}
                        className={`cursor-pointer flex flex-col overflow-hidden rounded-xl shadow-md border-gray-200 transition duration-300 md:flex-row ${getReservationClass(res.endReservedTime)}`}>
                        <div className="flex-1 p-5">
                            <div className='flex flex-col md:flex-row gap-2'>
                                <h3 className="mb-2 text-xl font-semibold text-gray-900">
                                    {res.roomId.name}
                                </h3>
                                <div
                                    className={`px-3 text-sm font-semibold capitalize rounded-full flex items-center justify-center ${getStatusColor(res.status)}`}
                                >
                                    {res.status}
                                </div>
                            </div>

                            <p className="mb-4 text-sm text-gray-500">
                                <strong>Created: </strong>{new Date(res.createdAt).toLocaleDateString()}
                            </p>

                            <div className="grid grid-cols-2 gap-3 mb-4 text-sm">

                                <div className="flex items-center text-gray-700">
                                    <FaCalendarCheck className="w-4 h-4 mr-2 text-blue-500" />
                                    <strong>Check-in: </strong>
                                    <span className='ml-1'>{new Date(res.startReservedTime).toLocaleString("az-AZ", { timeZone: "Asia/Baku" })}</span>
                                </div>

                                <div className="flex items-center text-gray-700">
                                    <IoIosCloseCircle className="w-4 h-4 mr-2 text-blue-500" />
                                    <strong>Check-out: </strong><span className='ml-1'>{new Date(res.endReservedTime

                                    ).toLocaleString("az-AZ", { timeZone: "Asia/Baku" })}</span>
                                </div>

                                <div className="flex items-center text-gray-700">
                                    <IoLogoUsd className="w-4 h-4 mr-2 text-indigo-500" />
                                    <strong>Deposit: </strong><span className='ml-1'>${res.depositPaid}</span>
                                </div>

                                <div className="flex items-center text-gray-700">
                                    <IoLogoUsd className="w-4 h-4 mr-2 text-indigo-500" />
                                    <strong>Remaining: </strong><span className='ml-1'>${res.remainingAmount.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

        )
    );
};

export default UserReservations;