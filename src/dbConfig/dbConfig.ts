import mongoose from "mongoose";

let isConnected = false;

export async function connect() {
  if (isConnected) return;
  if (!process.env.MONGO_URL) throw new Error("MONGO_URL is not defined");

  try {
    await mongoose.connect(process.env.MONGO_URL);
    isConnected = true;
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    // process.exit(1);
    throw err;
  }
}
