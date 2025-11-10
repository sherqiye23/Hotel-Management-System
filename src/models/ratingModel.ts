import mongoose from "mongoose";
import { IRating } from "../types/modelTypes";
import Room from "./roomModel";
import User from "./userModel";

const ratingSchema = new mongoose.Schema<IRating>(
    {
        roomId: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        value: { type: Number, min: 1, max: 5, required: true },
    },
    { timestamps: { createdAt: true, updatedAt: false } }
)

ratingSchema.post("save", async function (doc) {
    const ratings = await Rating.find({ roomId: doc.roomId });
    const total = ratings.reduce((sum, r) => sum + r.value, 0);
    const room = await Room.findById(doc.roomId);
    if (room && !room.ratings.includes(doc._id)) {
        room.ratings.push(doc._id);
        room.ratingCount = ratings.length;
        room.averageRating = total / ratings.length;
        await room.save();
    }

    const user = await User.findById(doc.userId);
    if (user && !user.ratings.includes(doc._id)) {
        user.ratings.push(doc._id);
        await user.save();
    }
});


ratingSchema.post("findOneAndUpdate", async function (doc) {
    if (!doc) return;
    const ratings = await Rating.find({ roomId: doc.roomId });
    const total = ratings.reduce((sum, r) => sum + r.value, 0);
    const room = await Room.findById(doc.roomId);
    if (room) {
        room.ratingCount = ratings.length;
        room.averageRating = total / ratings.length;
        await room.save();
    }
});

const Rating = mongoose.models.Rating || mongoose.model<IRating>('Rating', ratingSchema);
export default Rating