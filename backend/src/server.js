import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./config/db.js";
import { seedDatabase } from "./config/seed.js";

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

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date() });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  // 1. Connect to Database
  await connectDB();

  // 2. Seed Mock Database Values (if needed)
  await seedDatabase();

  // 3. Start Listening
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
