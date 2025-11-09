import mongoose from "mongoose";
import { IHotel } from "../types/modelTypes";

const hotelSchema = new mongoose.Schema<IHotel>(
    {
        name: {
            type: String,
            trim: true,
            required: [true, 'Hotel name is required'],
            maxlength: 15,
            minlength: 3,
        },
        description: {
            type: String,
            trim: true,
            required: [true, 'Hotel description is required'],
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
        reservedStatus: {
            type: Boolean,
            default: false,
        },
        startReservedTime: {
            type: Date,
            default: null,
        },
        endReservedTime: {
            type: Date,
            default: null,
        },
        reservedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
    },
    { timestamps: { createdAt: true, updatedAt: false } }
)

const Hotel = mongoose.models.Hotel || mongoose.model<IHotel>('Hotel', hotelSchema);
export default Hotel