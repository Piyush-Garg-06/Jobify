import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB, lastDbError } from "./config/db.js";
import { seedDatabase } from "./config/seed.js";
import mongoose from "mongoose";

// Routes imports
import authRoutes from "./routes/auth.js";
import submissionRoutes from "./routes/submissions.js";
import certificateRoutes from "./routes/certificates.js";
import applicationRoutes from "./routes/applications.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(helmet({
  contentSecurityPolicy: false, // Turn off CSP for dev convenience if needed
}));
app.use(morgan("dev"));

// API Router Mounts
app.use("/api/auth", authRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/certificates", certificateRoutes);
app.use("/api/applications", applicationRoutes);

// Root endpoint
app.get("/", (req, res) => {
  res.send("Welcome to Jobify LMS Backend API");
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ 
    status: "OK", 
    timestamp: new Date(),
    dbConnected: mongoose.connection.readyState === 1,
    dbState: mongoose.connection.readyState,
    dbError: lastDbError,
    hasMongoUri: !!process.env.MONGODB_URI,
    hasJwtSecret: !!process.env.JWT_SECRET,
    nodeEnv: process.env.NODE_ENV
  });
});

const PORT = process.env.PORT || 5000;

// Connect to Database immediately when module loads
connectDB().then(() => {
  seedDatabase();
}).catch(err => {
  console.error("Database connection error:", err);
});

// Only listen to port if NOT running in Vercel serverless environment
if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;
