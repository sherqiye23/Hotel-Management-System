"use client";
import RoomCard from "./RoomCard";

const fakeRooms = [
  {
    _id: "1",
    name: "Deluxe Suite",
    description: "Spacious room with a king-size bed and city view.",
    images: ["/images/room1.jpg"],
    pricePerNight: 120,
    averageRating: 4.5,
  },
  {
    _id: "2",
    name: "Standard Room",
    description: "Comfortable double bed room with modern decor.",
    images: ["/images/room2.jpg"],
    pricePerNight: 80,
    averageRating: 4.1,
  },
  {
    _id: "3",
    name: "Family Suite",
    description: "Perfect for families, includes 2 bedrooms and kitchen.",
    images: ["/images/room3.jpg"],
    pricePerNight: 150,
    averageRating: 4.8,
  },
  {
    _id: "4",
    name: "Economy Room",
    description: "Budget-friendly single bed with all basic amenities.",
    images: ["/images/room4.jpg"],
    pricePerNight: 60,
    averageRating: 3.9,
  },
  {
    _id: "5",
    name: "Luxury Villa",
    description: "Private villa with pool and sea view.",
    images: ["/images/room5.jpg"],
    pricePerNight: 300,
    averageRating: 4.9,
  },
  {
    _id: "6",
    name: "Twin Deluxe",
    description: "Two twin beds and modern interior design.",
    images: ["/images/room6.jpg"],
    pricePerNight: 100,
    averageRating: 4.2,
  },
];

export default function Rooms() {
  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
      {/* 🏨 Header Section */}
      <div className="bg-linear-to-r from-blue-50 to-blue-100 rounded-3xl p-10 mb-10 text-center shadow-sm">
        <h1 className="text-4xl font-bold text-gray-800 mb-3">
          Discover Our Rooms
        </h1>
        <p className="max-w-2xl mx-auto text-gray-600">
          Choose from a variety of comfortable rooms designed to make your stay
          relaxing and memorable. Whether you’re visiting for business or
          leisure, we have the perfect space for you.
        </p>
      </div>

      {/* Filter + Sort section */}
      <div className="flex flex-wrap justify-between items-center mb-8">
        <h2 className="text-xl font-semibold text-gray-800">All Rooms</h2>
        <div className="flex gap-3">
          <select className="border rounded-lg px-3 py-2 text-sm">
            <option>Sort by</option>
            <option>Price: Low to High</option>
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

      {/* Grid of rooms */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {fakeRooms.map((room) => (
          <RoomCard key={room._id} room={room} />
        ))}
      </div>
    </div>
  );
}
