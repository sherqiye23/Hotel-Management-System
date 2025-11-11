import mongoose from "mongoose";
import { IUser } from "../types/modelTypes";
import Feedback from "./feedbackModel";
import Reservation from "./reservationModel";
import Rating from "./ratingModel";
import Room from "./roomModel";

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

userSchema.post("findOneAndDelete", async function (user) {
    if (!user) return;
    await Feedback.deleteMany({ fromMail: user.email });

    const reservations = await Reservation.find({ userId: user._id })
    const ratings = await Rating.find({ userId: user._id })

    await Reservation.deleteMany({ userId: user._id })
    await Rating.deleteMany({ userId: user._id })

    const reservationIds = reservations.map(r => r._id.toString());
    const ratingIds = ratings.map(r => r._id.toString());

    const rooms = await Room.find()

    for (const room of rooms) {
        const undeletedRatings = room.ratings.filter((ratingId: string) => !ratingIds.includes(ratingId.toString()));
        const undeletedReservations = room.reservations.filter((reservationId: string) => !reservationIds.includes(reservationId.toString()));

        if (
            undeletedRatings.length !== room.ratings.length ||
            undeletedReservations.length !== room.reservations.length
        ) {
            room.ratings = undeletedRatings;
            room.reservations = undeletedReservations;

            const remainingRatings = await Rating.find({
                _id: { $in: undeletedRatings },
            });

            const ratingCount = remainingRatings.length;
            const total = remainingRatings.reduce((sum, r) => sum + r.value, 0);
            room.ratingCount = ratingCount;
            room.averageRating = ratingCount > 0 ? total / ratingCount : 0;
            await room.save()
        }
    }
});

const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);
export default User
