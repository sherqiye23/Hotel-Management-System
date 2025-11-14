"use client";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { useGetBySlugRoomQuery } from "@/src/lib/features/room/roomSlice";
import Loader from "../../Loader";
import { cloudinaryUrl } from "@/src/lib/urls";

export default function RoomDetail() {
    const { roomname } = useParams();
    const router = useRouter()
    const [currentIndex, setCurrentIndex] = useState(0);
    const { data: room, isLoading, isError } = useGetBySlugRoomQuery(`${roomname}`)

    useEffect(() => {
        if (!isLoading && isError) {
            router.push("/404");
        }
    }, [isLoading, isError, router]);

    if (isLoading || !room) return <Loader />;

    const nextSlide = () => {
        setCurrentIndex((prev) =>
            prev === room.images.length - 1 ? 0 : prev + 1
        );
    };

    const prevSlide = () => {
        setCurrentIndex((prev) =>
            prev === 0 ? room.images.length - 1 : prev - 1
        );
    };

    const stars = Array.from({ length: 5 }, (_, i) => i + 1);

    return (
        <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* LEFT 2/3: Main Slider */}
            <div className="lg:col-span-2 relative">
                <div className="relative w-full h-[450px] rounded-2xl overflow-hidden shadow-lg">
                    <Image
                        src={cloudinaryUrl + room.images[currentIndex]}
                        alt={room.name}
                        fill
                        className="object-cover"
                    />
                </div>

                {/* Slider arrows */}
                <button
                    onClick={prevSlide}
                    className="absolute top-1/2 left-4 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/60 transition"
                >
                    ‹
                </button>

                <button
                    onClick={nextSlide}
                    className="absolute top-1/2 right-4 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/60 transition"
                >
                    ›
                </button>

                {/* Thumbnails */}
                <div className="flex gap-3 mt-4">
                    {room.images.map((img, i) => (
                        <div
                            key={i}
                            onClick={() => setCurrentIndex(i)}
                            className={`relative w-24 h-16 rounded-lg overflow-hidden border cursor-pointer transition 
              ${currentIndex === i ? "border-(--element-bg) scale-105" : "border-gray-300"}`}
                        >
                            <Image
                                src={cloudinaryUrl + img}
                                alt={`thumb-${i}`}
                                fill
                                className="object-cover"
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* RIGHT 1/3: Info Panel */}
            <div className="bg-white rounded-2xl shadow-md p-6 h-fit border">
                <h1 className="text-2xl font-semibold mb-2">{room.name}</h1>

                <div className="flex items-center mb-4">
                    {stars.map((star) => (
                        <Star
                            key={star}
                            size={20}
                            className={
                                room.averageRating >= star
                                    ? "text-yellow-400 fill-yellow-400"
                                    : "text-gray-300"
                            }
                        />
                    ))}
                    <span className="ml-2 text-gray-600 font-medium">
                        {room.averageRating.toFixed(1)} ({room.ratingCount})
                    </span>
                </div>

                <p className="text-gray-700 leading-relaxed mb-4">
                    {room.description}
                </p>

                <p className="text-xl font-semibold text-(--element-bg)">
                    ${room.pricePerNight}/night
                </p>

                <button className="mt-6 w-full bg-(--element-bg) hover:bg-(--element-bg-hover) text-white py-2 rounded-lg transition">
                    Reserve Now
                </button>
            </div>
        </div>
    );
}
