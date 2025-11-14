"use client";
import { useGetAllRoomsQuery } from "@/src/lib/features/room/roomSlice";
import RoomCard from "./RoomCard";
import Loader from "../Loader";

export default function Rooms() {
  const { data, isLoading } = useGetAllRoomsQuery()
  console.log(data)


  return (
    isLoading ? <Loader /> : (
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
        <div className="bg-linear-to-r from-blue-50 to-blue-100 rounded-3xl p-5 sm:p-10 mb-10 text-center shadow-sm">
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-800 mb-3">
            Discover Our Rooms
          </h1>
          <p className="max-w-2xl mx-auto text-gray-600">
            Choose from a variety of comfortable rooms designed to make your stay
            relaxing and memorable. Whether you’re visiting for business or
            leisure, we have the perfect space for you.
          </p>
        </div>

        <div className="flex flex-wrap justify-between items-center mb-8">
          <h2 className="text-xl font-semibold text-gray-800">All Rooms</h2>
          <div className="flex flex-wrap gap-3">
            <select className="border rounded-lg px-3 py-2 text-sm">
              <option>Sort by</option>
              <option className="p-2 shadow-[0_0_10px_100px_#1882A8_inset]">Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Rating</option>
            </select>
            <select className="border rounded-lg px-3 py-2 text-sm">
              <option>Filter</option>
              <option>Price under $100</option>
              <option>Rating above 4.5</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {(data ?? []).map((room) => (
            <RoomCard key={room._id} room={room} />
          ))}
        </div>
      </div>
    )
  );
}
