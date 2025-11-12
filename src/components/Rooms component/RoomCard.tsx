"use client";

import { Star } from "lucide-react";
import Image from "next/image";
import React from "react";

interface Room {
    _id: string;
    name: string;
    description: string;
    images: string[];
    pricePerNight: number;
    averageRating: number;
}

interface RoomCardProps {
    room: Room;
}

const RoomCard: React.FC<RoomCardProps> = ({ room }) => {
    const stars = Array.from({ length: 5 }, (_, i) => i + 1);

    return (
        <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition duration-300">
            <div className="relative h-48 w-full">
                <Image
                    src={room.images[0] || "/placeholder.jpg"}
                    alt={room.name}
                    fill
                    className="object-cover"
                />
            </div>
            <div className="p-4">
                <h3 className="font-semibold text-lg">{room.name}</h3>
                <div className="flex items-center mt-1 mb-2">
                    {stars.map((star) => (
                        <Star
                            key={star}
                            size={18}
                            className={`${room.averageRating >= star
                                    ? "text-yellow-400 fill-yellow-400"
                                    : "text-gray-300"
                                }`}
                        />
                    ))}
                    <span className="ml-2 text-sm text-gray-600">
                        {room.averageRating.toFixed(1)}
                    </span>
                </div>
                <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                    {room.description}
                </p>
                <div className="flex justify-between items-center">
                    <span className="font-semibold text-blue-600">
                        ${room.pricePerNight}/night
                    </span>
                    <button className="bg-blue-600 text-white text-sm px-3 py-1 rounded-lg hover:bg-blue-700 transition">
                        View Details
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RoomCard;
