import mongoose from "mongoose";
import { env } from "./env.js";

const connectDB = async () => {
  try {
    mongoose.set("strictQuery", true);

    await mongoose.connect(env.mongoUri, {
      autoIndex: env.nodeEnv !== "production",
      serverSelectionTimeoutMS: 5000,
    });

    console.log("✅ MongoDB connected");

    mongoose.connection.on("error", (err) => {
      console.error("❌ MongoDB runtime error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("⚠️ MongoDB disconnected");
    });

  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;
