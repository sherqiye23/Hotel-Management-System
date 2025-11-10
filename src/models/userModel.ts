import mongoose from "mongoose";
import { IUser } from "../types/modelTypes";

const userSchema = new mongoose.Schema<IUser>(
    {
        firstname: {
            type: String,
            trim: true,
            required: [true, 'First name is required'],
            maxlength: 15,
        },
        lastname: {
            type: String,
            trim: true,
            required: [true, 'Last name is required'],
            maxlength: 15,
        },
        email: {
            type: String,
            trim: true,
            lowercase: true,
            required: [true, 'Email address is required'],
            unique: true,
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                'Please enter a valid email'
            ],
        },
        password: {
            type: String,
        },
        isAdmin: {
            type: Boolean,
            default: false,
        },
        reservedRooms: [{ type: mongoose.Schema.Types.ObjectId, ref: "Reservation" }],
        ratings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Rating" }],
    },
    { timestamps: { createdAt: true, updatedAt: false } }
)

const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);
export default User
