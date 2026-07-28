import mongoose from "mongoose";

export let lastDbError = null;
let dbConnectionPromise = null;

export const connectDB = () => {
  if (!dbConnectionPromise) {
    dbConnectionPromise = mongoose.connect(process.env.MONGODB_URI)
      .then((conn) => {
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        lastDbError = null;
        return conn;
      })
      .catch((error) => {
        console.error(`Database connection error: ${error.message}`);
        lastDbError = error.message;
        dbConnectionPromise = null; // reset to allow retries
        throw error;
      });
  }
  return dbConnectionPromise;
};
