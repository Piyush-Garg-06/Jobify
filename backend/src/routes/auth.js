import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// @desc    Authenticate student & get token
// @route   POST /api/auth/login
// @access  Public
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (user && (await bcrypt.compare(password, user.password))) {
      // Create JWT Token
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "30d",
      });

      res.json({
        success: true,
        token,
        user: {
          id: user._id,
          username: user.username,
          name: user.name,
          domain: user.domain,
          duration: user.duration,
          college: user.college,
          role: user.role,
        },
      });
    } else {
      res.status(401).json({ success: false, message: "Invalid username or password" });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: `Server error during login: ${error.message}` });
  }
});

// @desc    Get logged in student profile
// @route   GET /api/auth/me
// @access  Private
router.get("/me", protect, async (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
});

export default router;
