import mongoose from "mongoose";
import { IFeedback } from "../types/modelTypes";

const feedbackSchema = new mongoose.Schema<IFeedback>(
    {
        fromMail: {
            type: String,
            trim: true,
            lowercase: true,
            required: [true, 'Email address is required'],
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                'Please enter a valid email'
            ],
        },
        description: {
            type: String,
            trim: true,
            required: [true, 'Feedback description is required'],
            maxlength: 100,
        },
        isRead: {
            type: Boolean,
            default: false,
        },
        isSoftDeleted: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: { createdAt: true, updatedAt: false } }
)

const Feedback = mongoose.models.Feedback || mongoose.model<IFeedback>('Feedback', feedbackSchema);
export default Feedback
