"use client";
import { cloudinaryUrl } from "@/src/lib/urls";
import { IRoom } from "@/src/types/modelTypes";
import { Star } from "lucide-react";
import Image from "next/image";
import React from "react";
import { useRouter } from "next/navigation";

interface RoomCardProps {
    room: IRoom;
}

const RoomCard: React.FC<RoomCardProps> = ({ room }) => {
    const router = useRouter()
    const stars = Array.from({ length: 5 }, (_, i) => i + 1);

    return (
        <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition duration-300">
            <div className="relative h-48 w-full">
                <Image
                    src={cloudinaryUrl + room.images[0]}
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
                <div className="flex justify-between items-center">
                    <span className="font-semibold text-(--element-bg)">
                        ${room.pricePerNight}/night
                    </span>
                    <button onClick={() => router.push(`/rooms/${room.slug}`)}
                        className="bg-(--element-bg) text-white text-sm px-3 py-1 rounded-lg hover:bg-(--element-bg-hover) transition">
                        View Details
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RoomCard;
