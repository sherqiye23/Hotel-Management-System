import mongoose, { Document } from "mongoose";

export interface IUser extends Document {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    isAdmin: boolean;
    reservedRooms: string[];
    ratings: string[];
}

export interface IFeedback extends Document {
    fromMail: string;
    description: string;
    isRead: boolean;
    isSoftDeleted: boolean;
}

export interface IRoom extends Document {
    _id: string,
    name: string;
    slug: string;
    description: string;
    images: string[];
    pricePerNight: number;
    reservations: string[]
    ratings: string[];
    averageRating: number;
    ratingCount: number;
    isSoftDeleted: boolean;
}

export interface IRating extends Document {
    roomId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    value: number;
}

export interface IReservation extends Document {
    roomId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    startReservedTime?: Date;
    endReservedTime?: Date;
    status: "pending" | "confirmed" | "cancelled";
    isSoftDeleted: boolean;
    endingStatusTime: Date | null;
}
