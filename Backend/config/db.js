import mongoose from "mongoose";

const connectDB = async () => {
    try {
     await mongoose.connect(process.env.MONGO_DB_URL);
     console.log("mongodb is connected successfully");
     
    }catch (error){
      console.error('database connection failed:', error.message);
      process.exit(1);
    }
};

export const disconnectDB = async () => {
  await mongoose.disconnect();
  console.log("database disconnected");
  
}

export default connectDB;