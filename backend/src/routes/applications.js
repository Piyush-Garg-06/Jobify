import express from "express";
import bcrypt from "bcryptjs";
import Application from "../models/Application.js";
import User from "../models/User.js";
import { protect } from "../middleware/auth.js";
import {
  generateOfferLetterPDF,
  sendApprovalEmail,
  sendDeclineEmail,
} from "../services/emailService.js";

const router = express.Router();

// Middleware to check if user is admin
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ success: false, message: "Access denied. Admins only." });
  }
};

// @desc    Submit a new application (Google Form webhook / website form)
// @route   POST /api/applications/apply
// @access  Public
// Helper to map form domains to LMS curriculum tracks
const mapDomainToTrack = (rawDomain) => {
  if (!rawDomain) return "Web Development";
  const d = rawDomain.toLowerCase();
  if (d.includes("web")) return "Web Development";
  if (d.includes("python")) return "Python";
  if (d.includes("machine") || d.includes("ai") || d.includes("ml")) return "AI / ML";
  if (d.includes("dsa") || d.includes("algorithm")) return "DSA";
  if (d.includes("java")) return "Java";
  if (d.includes("c++")) return "C++";
  return "Web Development"; // default fallback
};

// @desc    Submit a new application (Google Form webhook / website form)
// @route   POST /api/applications/apply
// @access  Public
router.post("/apply", async (req, res) => {
  const { name, email, phone, qualification, college, domain, duration, utr, accountHolder, paymentScreenshot } = req.body;

  if (!name || !email || !phone || !qualification || !college || !domain || !utr || !accountHolder) {
    return res.status(400).json({
      success: false,
      message: "Please fill all required fields (name, email, phone, qualification, college, domain, utr, accountHolder).",
    });
  }

  try {
    const newApplication = await Application.create({
      name,
      email,
      phone,
      qualification,
      college,
      domain,
      duration: duration || "45 Days",
      utr,
      accountHolder,
      paymentScreenshot: paymentScreenshot || "",
      status: "Pending",
    });

    res.status(201).json({
      success: true,
      message: "Application submitted successfully! Awaiting admin verification.",
      application: newApplication,
    });
  } catch (error) {
    console.error("Apply error:", error);
    res.status(500).json({ success: false, message: "Error submitting application." });
  }
});

// @desc    Get all applications (Admin dashboard)
// @route   GET /api/applications/admin/list
// @access  Private (Admin)
router.get("/admin/list", protect, adminOnly, async (req, res) => {
  try {
    const applications = await Application.find().sort({ createdAt: -1 });
    res.json({ success: true, applications });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching applications." });
  }
});

// @desc    Verify (Accept/Decline) an application
// @route   POST /api/applications/admin/:id/verify
// @access  Private (Admin)
router.post("/admin/:id/verify", protect, adminOnly, async (req, res) => {
  const { id } = req.params;
  const { action } = req.body; // "accept" or "decline"

  if (!action || !["accept", "decline"].includes(action)) {
    return res.status(400).json({ success: false, message: "Valid action ('accept' or 'decline') is required." });
  }

  try {
    const appRecord = await Application.findById(id);

    if (!appRecord) {
      return res.status(404).json({ success: false, message: "Application not found." });
    }

    if (appRecord.status !== "Pending") {
      return res.status(400).json({
        success: false,
        message: `Application is already processed (Status: ${appRecord.status}).`,
      });
    }

    if (action === "accept") {
      // 1. Check if user already exists
      const userExists = await User.findOne({ username: appRecord.email });
      if (userExists) {
        return res.status(400).json({ success: false, message: "A student user with this email/username already exists." });
      }

      // 2. Generate LMS credentials
      // Username is email prefix + random suffix (or just the email directly to guarantee uniqueness)
      const username = appRecord.email.split("@")[0] + "_" + Math.floor(100 + Math.random() * 900);
      const rawPassword = Math.random().toString(36).slice(-8); // Random 8 character password
      const hashedPassword = await bcrypt.hash(rawPassword, 10);

      // 3. Create active User
      const mappedTrack = mapDomainToTrack(appRecord.domain);
      const newStudentUser = await User.create({
        username,
        password: hashedPassword,
        name: appRecord.name,
        domain: mappedTrack,
        duration: appRecord.duration || "45 Days",
        college: appRecord.college,
        role: "student",
      });

      // 4. Generate Offer Letter PDF
      const pdfBuffer = await generateOfferLetterPDF(
        appRecord.name,
        appRecord.domain,
        appRecord.duration || "45 Days",
        appRecord.college
      );

      // 5. Send Approval Email (auto-generates ethereal link if credentials are blank)
      await sendApprovalEmail(
        appRecord.email,
        appRecord.name,
        username,
        rawPassword,
        pdfBuffer
      );

      // 6. Update status
      appRecord.status = "Approved";
      await appRecord.save();

      res.json({
        success: true,
        message: `Application approved! Student credentials sent to ${appRecord.email}.`,
        user: {
          username,
          name: newStudentUser.name,
        },
      });
    } else {
      // Decline Action
      await sendDeclineEmail(appRecord.email, appRecord.name);

      appRecord.status = "Declined";
      await appRecord.save();

      res.json({
        success: true,
        message: `Application declined. Notification sent to ${appRecord.email}.`,
      });
    }
  } catch (error) {
    console.error("Verification error:", error);
    res.status(500).json({ success: false, message: "Error verifying application." });
  }
});

export default router;
