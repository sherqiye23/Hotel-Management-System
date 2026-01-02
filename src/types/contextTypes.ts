import mongoose from "mongoose";
import { RegisterRequest } from "./rtkSlicesTypes";
import { IRoom } from "./modelTypes";

export type UserInfoContextStatesType = {
    userInfo?: UserInfoContextType | null;
    setUserInfo: (info: UserInfoContextType | null) => void;
    isLoading?: boolean;
    setIsLoading?: (info: boolean) => void;
};

export interface IReservationContextType extends Document {
    _id: mongoose.Types.ObjectId;
    roomId: IRoom;
    userId: mongoose.Types.ObjectId;
    startReservedTime: Date;
    endReservedTime: Date;
    status: "pending" | "confirmed" | "cancelled";
    isSoftDeleted: boolean;
    endingStatusTime: Date | null;
    depositPaid: number;
    remainingAmount: number;
    createdAt: Date;
}

export interface UserInfoContextType extends RegisterRequest {
    _id: string;
    reservedRooms: IReservationContextType[]
};

export interface Context {
    params: Promise<{ id: string }>;
}

export interface ContextSlug {
    params: Promise<{ slug: string; }>;
}