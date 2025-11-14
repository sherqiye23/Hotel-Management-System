import mongoose from "mongoose";
import { IRoom } from "../types/modelTypes";
import Reservation from "./reservationModel";
import Rating from "./ratingModel";
import User from "./userModel";

const roomSchema = new mongoose.Schema<IRoom>(
    {
        name: {
            type: String,
            trim: true,
            required: [true, 'Room name is required'],
            maxlength: 15,
            minlength: 3,
            unique: true
        },
        slug: {
            type: String,
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
        isSoftDeleted: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: { createdAt: true, updatedAt: false } }
)

roomSchema.post("findOneAndDelete", async function (room) {
    if (!room) return;

    const reservations = await Reservation.find({ roomId: room._id })
    const ratings = await Rating.find({ roomId: room._id })

    await Reservation.deleteMany({ roomId: room._id })
    await Rating.deleteMany({ roomId: room._id })

    const reservationIds = reservations.map(r => r._id.toString());
    const ratingIds = ratings.map(r => r._id.toString());

    const users = await User.find()

    for (const user of users) {
        const undeletedRatings = user.ratings.filter((ratingId: string) => !ratingIds.includes(ratingId.toString()));
        const undeletedReservations = user.reservations.filter((reservationId: string) => !reservationIds.includes(reservationId.toString()));

        if (
            undeletedRatings.length !== user.ratings.length ||
            undeletedReservations.length !== user.reservations.length
        ) {
            user.ratings = undeletedRatings;
            user.reservations = undeletedReservations;
            await user.save()
        }
    }
});

const Room = mongoose.models.Room || mongoose.model<IRoom>('Room', roomSchema);
export default Room