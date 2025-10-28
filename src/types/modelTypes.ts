import { Document } from "mongoose";

export interface IUser extends Document {
    firstname: string,
    lastname: string,
    email: string,
    password: string,
    isAdmin: boolean,
    reservedRooms: string[]
}