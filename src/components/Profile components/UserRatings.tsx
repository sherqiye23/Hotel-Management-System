import React from 'react';
import { FaStar } from 'react-icons/fa';
import Link from 'next/link';
import { IRatingProfile } from '@/src/types/modelTypes';

interface UserRatingsProps {
    ratings: IRatingProfile[];
}

const StarRating: React.FC<{ value: number }> = ({ value }) => {
    const stars = Array.from({ length: 5 }, (_, index) => (
        <FaStar
            key={index}
            className={`w-5 h-5 ${index < value ? 'text-yellow-400' : 'text-gray-300'}`}
        />
    ));
    return <div className="flex">{stars}</div>;
};

const UserRatings: React.FC<UserRatingsProps> = ({ ratings }) => {
    if (ratings.length === 0) {
        return (
            <div className="p-6 text-center text-gray-500 bg-white rounded-lg shadow-inner">
                You haven't **rated any rooms** yet.
            </div>
        );
    }

    return (
        <div className="grid gap-6 md:grid-cols-2">
            {ratings.map((rating) => (
                <Link
                    href={`/rooms/${rating.roomId.slug}`}
                    key={String(rating._id)}
                    className="block p-5 bg-white border border-gray-200 rounded-xl shadow-md transition duration-300 hover:shadow-lg hover:border-blue-400"
                >
                    <div className="flex items-start">
                        {rating.roomId.images.length > 0 && (
                            <img
                                src={rating.roomId.images[0]}
                                alt={rating.roomId.name}
                                className="object-cover w-16 h-16 mr-4 rounded-lg"
                                onError={(e) => { (e.target as HTMLImageElement).src = '/default-room.jpg'; }}
                            />
                        )}

                        <div>
                            <h3 className="mb-1 text-lg font-semibold text-gray-900 hover:text-blue-600 transition">
                                {rating.roomId.name}
                            </h3>
                            <div className="flex items-center mb-2">
                                <StarRating value={rating.value} />
                                <span className="ml-2 text-sm font-medium text-gray-600">
                                    ({rating.value} / 5)
                                </span>
                            </div>
                            <p className="text-sm text-gray-500">
                                Rated On: {new Date(rating.createdAt).toLocaleDateString()}
                            </p>
                            <p className="mt-2 text-xs text-blue-500">
                                Go to room for details &rarr;
                            </p>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
};

export default UserRatings;