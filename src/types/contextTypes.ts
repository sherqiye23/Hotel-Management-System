import mongoose from "mongoose";
import { RegisterRequest } from "./rtkSlicesTypes";
import { IRoom } from "./modelTypes";

export type UserInfoContextStatesType = {
    userInfo: UserInfoContextType | null;
    setUserInfo: React.Dispatch<React.SetStateAction<UserInfoContextType | null>>;
    isLoading: boolean;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
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

export interface IRatingContextType extends Document {
    _id: string,
    roomId: IRoom;
    userId: mongoose.Types.ObjectId;
    value: number;
}

type IRatingStateItem = IRatingContextType | {
  _id: string;
  userId: string;
  value: number;
  roomId: { _id: string };
};


export interface UserInfoContextType extends RegisterRequest {
    _id: string;
    reservedRooms: IReservationContextType[],
    ratings: IRatingStateItem[]
};

export interface Context {
    params: Promise<{ id: string }>;
}

export interface ContextSlug {
    params: Promise<{ slug: string; }>;
}