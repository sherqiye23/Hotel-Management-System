import mongoose from "mongoose";
import { IReservation } from "../types/modelTypes";

const reservationSchema = new mongoose.Schema<IReservation>(
    {
        roomId: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        startReservedTime: {
            type: Date,
            default: null,
        },
        endReservedTime: {
            type: Date,
            default: null,
        },
        status: { type: String, enum: ["pending", "confirmed", "cancelled"], default: "pending" },
        isSoftDeleted: {
            type: Boolean,
            default: false,
        },
        endingStatusTime: { type: Date },
    },
    { timestamps: { createdAt: true, updatedAt: false } }
)

reservationSchema.pre("save", function (next) {
    if (this.startReservedTime) {
        this.startReservedTime.setHours(12, 0, 0, 0);
    }
    if (this.endReservedTime) {
        this.endReservedTime.setHours(12, 0, 0, 0);
    }
    next();
});

const Reservation = mongoose.models.Reservation || mongoose.model<IReservation>('Reservation', reservationSchema);
export default Reservation