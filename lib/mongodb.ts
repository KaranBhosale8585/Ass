import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) throw new Error("MONGODB_URI is missing!");

mongoose.set("strictQuery", true);

let isConnected = false;

export async function connectDB() {
  if (isConnected) return;

  try {
    await mongoose.connect(MONGODB_URI);
    isConnected = true;
    console.log("Connected to MongoDB");

    mongoose.connection.once("error", (err) => {
      console.error("MongoDB connection error:", err);
      process.exit(1);
    });
  } catch (err) {
    console.error("MongoDB connection failed:", err);
    throw err;
  }
}
