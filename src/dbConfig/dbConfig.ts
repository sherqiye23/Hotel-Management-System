import mongoose from "mongoose";

export async function connect() {
    try {
        if (!process.env.MONGO_URL) {
            throw new Error("MONGO_URI is not defined in environment variables");
        }

        await mongoose.connect(process.env.MONGO_URL);
        const connection = mongoose.connection;

        connection.on("connected", () => {
            console.log("MongoDB connected successfully");
        });

        connection.on("error", (err) => {
            console.log("MongoDB connection error:", err);
            process.exit(1); // Stop the server due to MongoDB connection error
        });
    } catch (error) {
        console.log("Something went wrong while connecting to MongoDB:", error);
    }
}

