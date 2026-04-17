import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_URL);
    console.log("✅ MongoDB is connected successfully");
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    process.exit(1);
  }
};

export const getVendorDB = () => {
  return mongoose.connection;
};

export const disconnectDB = async () => {
  await mongoose.disconnect();
  console.log("📡 Database disconnected");
};

export default connectDB;
