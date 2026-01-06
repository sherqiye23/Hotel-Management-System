"use client";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Star, Users } from "lucide-react";
import { useGetBySlugRoomQuery, useRateRoomMutation } from "@/src/lib/features/room/roomSlice";
import Loader from "../../Loader";
import { cloudinaryUrl } from "@/src/lib/urls";
import { ReservationCalendar } from "./ReservationCalendar";
import toast from "react-hot-toast";
import { IReservation } from "@/src/types/modelTypes";
import { addDays } from "date-fns";
import { usePostReservationMutation } from "@/src/lib/features/reservation/reservationSlice";
import { handleFormError } from "@/src/utils/handleFormError";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { ResData } from "@/src/app/(main)/rooms/[roomname]/page";
import { useMyContext } from "@/src/context/UserInfoContext";
import { IRatingContextType, UserInfoContextType } from "@/src/types/contextTypes";

type Props = {
  setReservationData: React.Dispatch<React.SetStateAction<ResData>>;
  setShowPayment: React.Dispatch<React.SetStateAction<boolean>>;
};

const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export default function RoomDetail({ setShowPayment, setReservationData }: Props) {
  const [open, setOpen] = useState<boolean>(false);
  const { userInfo, setUserInfo } = useMyContext();
  const { roomname } = useParams();
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const {
    data: room,
    isLoading,
    isError,
  } = useGetBySlugRoomQuery(`${roomname}`);

  const [postReservation] = usePostReservationMutation()
  const [rateRoom] = useRateRoomMutation()

  // rating finded and clicked
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);
  const [findedRating, setFindedRating] = useState<IRatingContextType | { _id: string; userId: string; value: number; roomId: { _id: string } } | null>(null);

  useEffect(() => {
    if (userInfo && room) {
      const rating = userInfo.ratings?.find(
        (r) => r.roomId?._id && room?.id && r.roomId._id.toString() === room.id.toString()
      ) || null;
      setFindedRating(rating);
      console.log(rating);
    }
  }, [userInfo, room]);


  const onClickFunctionRating = async (value: number) => {
    if (!room || !userInfo) return;

    try {
      const resData = await rateRoom({ id: room.id, ratingBody: { value } }).unwrap();
      const updatedRating = resData.message;

      setUserInfo((prev: UserInfoContextType | null) => {
        if (!prev) return prev;

        const existingIndex = prev.ratings.findIndex(
          r => r.roomId._id === room.id
        );

        let newRatings;
        if (existingIndex >= 0) {
          newRatings = [...prev.ratings];
          newRatings[existingIndex] = {
            ...newRatings[existingIndex],
            value: updatedRating.value,
          };
        } else {
          newRatings = [...prev.ratings, {
            _id: updatedRating._id,
            userId: updatedRating.userId,
            value: updatedRating.value,
            roomId: { _id: room.id }
          }];
        }

        return { ...prev, ratings: newRatings };
      });
    } catch (error: unknown) {
      const err = error as FetchBaseQueryError;
      if ("status" in err && (err.status === 401 || err.status === 403)) {
        router.push("/login");
        return;
      }
      handleFormError(error);
    }
  };

  // error page
  useEffect(() => {
    if (!isLoading && isError) {
      router.push("/404");
    }
  }, [isLoading, isError, router]);

  if (isLoading || !room) return <Loader />;

  // slider
  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === room.images.length - 1 ? 0 : prev + 1));
  };
  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? room.images.length - 1 : prev - 1));
  };

  // stars
  const stars = Array.from({ length: 5 }, (_, i) => i + 1);

  // reservation
  const reservations = room.reservations as unknown as IReservation[];

  const bookedDates: Date[] = [];

  reservations.forEach((res) => {
    if (res.status === "cancelled") return;
    const start = new Date(res.startReservedTime);
    const end = new Date(res.endReservedTime);

    for (let d = start; d <= end; d = addDays(d, 1)) {
      bookedDates.push(d);
    }
  });
  const bookedDatesStrings: string[] = bookedDates.map(
    (d) => d.toISOString().split("T")[0]
  );

  const handleReservationConfirm = async (startDate: Date, endDate: Date) => {
    const checkIn = formatDate(startDate);
    const checkOut = formatDate(endDate);
    const resData = {
      roomId: room.id,
      startReservedTime: checkIn,
      endReservedTime: checkOut,
    };
    try {
      const response = await postReservation(resData).unwrap();
      toast.success(`Success! Booking confirmed from ${checkIn} to ${checkOut}.`);
      setReservationData({
        depositPaid: response.depositPaid,
        reservationId: response.reservationId,
      });
      setShowPayment(true);
    } catch (error: unknown) {
      const err = error as FetchBaseQueryError;
      if ("status" in err && err.status === 401) {
        router.push("/login");
        return;
      }
      handleFormError(error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-5 gap-6 mt-4 lg:mt-10">
      <div className="lg:col-span-3 relative">
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-lg">
          <Image
            src={cloudinaryUrl + room.images[currentIndex]}
            alt={room.name}
            fill
            className="object-cover"
          />
        </div>

        <button
          onClick={prevSlide}
          className="absolute top-2/5 sm:top-1/2 left-4 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/60 transition cursor-pointer"
        >
          <ChevronLeft />
        </button>

        <button
          onClick={nextSlide}
          className="absolute top-2/5 sm:top-1/2 right-4 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/60 transition cursor-pointer"
        >
          <ChevronRight />
        </button>

        <div className="flex gap-3 mt-4">
          {room.images.map((img, i) => (
            <div
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`relative w-24 h-16 rounded-lg overflow-hidden border cursor-pointer transition 
              ${currentIndex === i
                  ? "border-(--element-bg) scale-105"
                  : "border-gray-300"
                }`}
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

      <div className="lg:col-span-2 bg-white rounded-2xl shadow-md p-6 h-fit border-gray-400">
        <h1 className="text-xl sm:text-2xl font-semibold mb-2">{room.name}</h1>

        <div className="flex items-center mb-4">
          {stars.map((star) => (
            <Star
              key={star}
              size={20}
              className={
                (hoveredStar !== null
                  ? star <= hoveredStar
                  : star <= (findedRating?.value ?? 0))
                  ? "text-yellow-400 fill-yellow-400 cursor-pointer"
                  : "text-gray-300 cursor-pointer"
              }
              onMouseOver={() => setHoveredStar(star)}
              onMouseLeave={() => setHoveredStar(null)}
              onClick={() => onClickFunctionRating(star)}
            />
          ))}
          <span className="ml-2 text-gray-600 font-medium flex justify-center items-center gap-2">
            <span>{room.averageRating.toFixed(1)}</span>
            <span className="flex gap-1 justify-center items-center">
              <Users className="w-[18px] h-[18px]" />
              <span>({room.ratingCount})</span>
            </span>
          </span>
        </div>

        <p className="text-gray-700 leading-relaxed mb-4 text-sm">
          {room.description}
        </p>

        <p className="text-lg sm:text-xl font-semibold text-(--element-bg)">
          ${room.pricePerNight}
        </p>

        <button
          className="cursor-pointer mt-6 w-full bg-(--element-bg) hover:bg-(--element-bg-hover) text-white py-2 rounded-lg transition"
          onClick={() => setOpen(true)}
        >
          Reserve Now
        </button>

        {open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-md p-6 relative">
              <button
                onClick={() => setOpen(false)}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl font-bold cursor-pointer"
              >
                ×
              </button>
              <ReservationCalendar
                onReservationConfirm={handleReservationConfirm}
                reservedRooms={bookedDatesStrings as string[]}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
