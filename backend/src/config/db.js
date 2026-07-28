import mongoose from "mongoose";

export let lastDbError = null;

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    lastDbError = null;
  } catch (error) {
    console.error(`Database connection error: ${error.message}`);
    lastDbError = error.message;
  }
};
