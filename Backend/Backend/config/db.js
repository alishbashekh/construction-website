import mongoose from "mongoose";
import logger from "../logger.js";

const connectDB = async () => {
  const uri = process.env.MONGO_DB_URL || process.env.MONGODB_URI;

  if (!uri) {
    throw new Error(
      "MongoDB URI not found in environment variables (MONGO_DB_URL or MONGODB_URI)",
    );
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    logger.info(`MongoDB connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    logger.error(`MongoDB connection failed: ${error.message}`);
    throw error;
  }
};

export default connectDB;
