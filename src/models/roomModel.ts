import mongoose from "mongoose";
import { IRoom } from "../types/modelTypes";

const roomSchema = new mongoose.Schema<IRoom>(
    {
        name: {
            type: String,
            trim: true,
            required: [true, 'Room name is required'],
            maxlength: 15,
            minlength: 3,
        },
        description: {
            type: String,
            trim: true,
            required: [true, 'Room description is required'],
            maxlength: 100,
        },
        images: {
            type: [String],
            default: []
        },
        pricePerNight: {
            type: Number,
            required: [true, "Price per night is required"],
            min: 0,
        },
        reservations: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Reservation"
        }],
        ratings: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Rating"
        }],
        averageRating: {
            type: Number,
            min: 0,
            max: 5,
            default: 0,
        },
        ratingCount: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: { createdAt: true, updatedAt: false } }
)

const Room = mongoose.models.Room || mongoose.model<IRoom>('Room', roomSchema);
export default Room