import mongoose from "mongoose";
import { IReservation } from "../types/modelTypes";
import Room from "./roomModel";
import User from "./userModel";

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
        this.startReservedTime.setUTCHours(12, 0, 0, 0);
    }
    if (this.endReservedTime) {
        this.endReservedTime.setUTCHours(12, 0, 0, 0);
    }
    next();
});

reservationSchema.post("findOneAndDelete", async function (reservation) {
    if (!reservation) return;

    const room = await Room.findById(reservation.roomId)
    const user = await User.findById(reservation.userId)

    const newRoomReservations = room.reservations.filter((res: mongoose.Schema.Types.ObjectId) => res.toString() !== reservation._id.toString())
    const newUserReservations = user.reservedRooms.filter((res: mongoose.Schema.Types.ObjectId) => res.toString() !== reservation._id.toString())

    room.reservations = newRoomReservations;
    user.reservedRooms = newUserReservations;
    await room.save()
    await user.save()
});

const Reservation = mongoose.models.Reservation || mongoose.model<IReservation>('Reservation', reservationSchema);
export default Reservation