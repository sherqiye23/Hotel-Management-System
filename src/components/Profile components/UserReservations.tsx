import React from 'react';
import { FaCalendarCheck, FaEuroSign } from 'react-icons/fa';
import { IoIosCloseCircle } from "react-icons/io";
import { IReservationProfile } from '@/src/types/modelTypes';

interface UserReservationsProps {
    reservations: IReservationProfile[];
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

const UserReservations: React.FC<UserReservationsProps> = ({ reservations }) => {
    if (reservations.length === 0) {
        return (
            <div className="p-6 text-center text-gray-500 bg-white rounded-lg shadow-inner">
                You currently have **no reservations**.
            </div>
        );
    }

    return (
        <div className="grid gap-6">
            {reservations.map((res) => (
                <div
                    key={String(res._id)}
                    className="flex flex-col overflow-hidden bg-white border border-gray-200 rounded-xl shadow-md transition duration-300 hover:shadow-lg md:flex-row"
                >
                    {res.roomId.images.length > 0 && (
                        <div className="md:w-1/4 h-48 md:h-auto">
                            <img
                                src={res.roomId.images[0]}
                                alt={res.roomId.name}
                                className="object-cover w-full h-full"
                                onError={(e) => { (e.target as HTMLImageElement).src = '/default-room.jpg'; }} // Fallback image
                            />
                        </div>
                    )}

                    <div className="flex-1 p-5">
                        <h3 className="mb-2 text-xl font-semibold text-gray-900">
                            {res.roomId.name}
                        </h3>
                        <p className="mb-4 text-sm text-gray-500">
                            Booked On: {new Date(res.createdAt).toLocaleDateString()}
                        </p>

                        <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                            <div className="flex items-center text-gray-700">
                                <FaCalendarCheck className="w-4 h-4 mr-2 text-blue-500" />
                                **Check-in:** {new Date(res.startReservedTime).toLocaleDateString()}
                            </div>
                            <div className="flex items-center text-gray-700">
                                <IoIosCloseCircle className="w-4 h-4 mr-2 text-blue-500" />
                                **Check-out:** {new Date(res.endReservedTime).toLocaleDateString()}
                            </div>
                            <div className="flex items-center text-gray-700">
                                <FaEuroSign className="w-4 h-4 mr-2 text-indigo-500" />
                                **Deposit:** ${res.depositPaid.toFixed(2)}
                            </div>
                            <div className="flex items-center text-gray-700">
                                <FaEuroSign className="w-4 h-4 mr-2 text-indigo-500" />
                                **Remaining:** ${res.remainingAmount.toFixed(2)}
                            </div>
                        </div>
                    </div>

                    <div className={`p-4 md:w-1/6 flex items-center justify-center ${getStatusColor(res.status)}`}>
                        <span className={`px-3 py-1 text-sm font-semibold rounded-full capitalize`}>
                            {res.status}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default UserReservations;