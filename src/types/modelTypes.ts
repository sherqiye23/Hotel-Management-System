import { Document } from "mongoose";

export interface IUser extends Document {
    firstname: string,
    lastname: string,
    email: string,
    password: string,
    isAdmin: boolean,
    reservedRooms: string[]
}

export interface IFeedback extends Document {
    fromMail: string,
    description: string,
    isRead: boolean,
    isSoftDeleted: boolean
}

export interface IHotel extends Document {
    name: string;
    description: string;
    images: string[];
    pricePerNight: number;
    reservedStatus: boolean;
    startReservedTime?: Date;
    endReservedTime?: Date;
    reservedBy?: string;
}