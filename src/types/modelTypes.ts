import mongoose, { Document } from "mongoose";

export interface IUser extends Document {
    firstname: string,
    lastname: string,
    email: string,
    password: string,
    isAdmin: boolean,
    reservedRooms: string[],
    ratings: string[],
}

export interface IFeedback extends Document {
    fromMail: string,
    description: string,
    isRead: boolean,
    isSoftDeleted: boolean
}

export interface IRoom extends Document {
    name: string;
    description: string;
    images: string[];
    pricePerNight: number;
    reservations: string[]
    ratings: string[];
    averageRating: number;
    ratingCount: number;
}

export interface IRating extends Document {
    roomId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    value: number
}

export interface IReservation extends Document {
    roomId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    startReservedTime?: Date;
    endReservedTime?: Date;
    status: string
}
