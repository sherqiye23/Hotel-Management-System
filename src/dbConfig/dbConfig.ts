import mongoose from "mongoose";

let isConnected = false;
export async function connect() {
    if (isConnected) return; // if connected, do not repeat.
    try {
        if (!process.env.MONGO_URL) {
            throw new Error("MONGO_URI is not defined in environment variables");
        }

        await mongoose.connect(process.env.MONGO_URL);
        isConnected = true;
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.log("MongoDB connection error:", error);
        process.exit(1); // Stop the server due to MongoDB connection error
    }
}

connect()