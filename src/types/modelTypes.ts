import mongoose, { Document } from "mongoose";

export interface IUser extends Document {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    isAdmin: boolean;
    reservedRooms: mongoose.Types.ObjectId[];
    ratings: mongoose.Types.ObjectId[];
    refreshToken: string;
}

export interface IFeedback extends Document {
    fromMail: string;
    description: string;
    isRead: boolean;
    isSoftDeleted: boolean;
}

export interface IRoom extends Document {
    _id: mongoose.Types.ObjectId,
    name: string;
    slug: string;
    description: string;
    images: string[];
    pricePerNight: number;
    reservations: mongoose.Types.ObjectId[]
    ratings: mongoose.Types.ObjectId[];
    averageRating: number;
    ratingCount: number;
    isSoftDeleted: boolean;
    createdAt: Date
}

export interface IRating extends Document {
    roomId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    value: number;
}

export interface IReservation extends Document {
    _id:  mongoose.Types.ObjectId;
    roomId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    startReservedTime: Date;
    endReservedTime: Date;
    status: "pending" | "confirmed" | "cancelled";
    isSoftDeleted: boolean;
    endingStatusTime: Date | null;
    depositPaid: number;
    remainingAmount: number;
}

export interface IReservationforMail extends Document {
    _id:  mongoose.Types.ObjectId;
    roomId: IRoom;
    userId: mongoose.Types.ObjectId;
    startReservedTime: Date;
    endReservedTime: Date;
    status: "pending" | "confirmed" | "cancelled";
    isSoftDeleted: boolean;
    endingStatusTime: Date | null;
}