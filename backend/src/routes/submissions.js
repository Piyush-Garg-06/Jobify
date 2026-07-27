import express from "express";
import Submission from "../models/Submission.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// @desc    Get all submissions for logged in student
// @route   GET /api/submissions
// @access  Private
router.get("/", protect, async (req, res) => {
  try {
    const submissions = await Submission.find({ studentId: req.user._id });
    res.json({ success: true, submissions });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching submissions" });
  }
});

// @desc    Submit weekly task links
// @route   POST /api/submissions
// @access  Private
router.post("/", protect, async (req, res) => {
  const { week, repoUrl, linkedinUrl } = req.body;

  if (!week || !repoUrl || !linkedinUrl) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  try {
    // Upsert submission (insert or update if exists)
    const submission = await Submission.findOneAndUpdate(
      { studentId: req.user._id, week },
      {
        repoUrl,
        linkedinUrl,
        status: "Pending Review",
        grade: "Awaiting Grading",
      },
      { new: true, upsert: true }
    );

    res.json({ success: true, submission });
  } catch (error) {
    console.error("Submission save error:", error);
    res.status(500).json({ success: false, message: "Error saving submission" });
  }
});

// @desc    Reset/Delete week submission to start over
// @route   POST /api/submissions/reset
// @access  Private
router.post("/reset", protect, async (req, res) => {
  const { week } = req.body;

  if (!week) {
    return res.status(400).json({ success: false, message: "Week number is required" });
  }

  try {
    await Submission.findOneAndDelete({ studentId: req.user._id, week });
    res.json({ success: true, message: `Submission for week ${week} reset successfully` });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error resetting submission" });
  }
});

// @desc    Get all submissions (Admin dashboard)
// @route   GET /api/submissions/admin/list
// @access  Private (Admin)
router.get("/admin/list", protect, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ success: false, message: "Access denied." });
  }

  try {
    const submissions = await Submission.find()
      .populate("studentId", "name username domain college")
      .sort({ createdAt: -1 });
    res.json({ success: true, submissions });
  } catch (error) {
    console.error("Fetch submissions error:", error);
    res.status(500).json({ success: false, message: "Error fetching submissions" });
  }
});

// @desc    Grade/Approve/Reject a student's submission
// @route   POST /api/submissions/admin/:id/grade
// @access  Private (Admin)
router.post("/admin/:id/grade", protect, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ success: false, message: "Access denied." });
  }

  const { id } = req.params;
  const { status, grade } = req.body;

  if (!status || !["Approved", "Rejected"].includes(status)) {
    return res.status(400).json({ success: false, message: "Valid status ('Approved' or 'Rejected') is required" });
  }

  try {
    const submission = await Submission.findByIdAndUpdate(
      id,
      { status, grade: grade || "Graded" },
      { new: true }
    );

    if (!submission) {
      return res.status(404).json({ success: false, message: "Submission not found" });
    }

    res.json({ success: true, message: `Submission graded as ${status} successfully!`, submission });
  } catch (error) {
    console.error("Grading error:", error);
    res.status(500).json({ success: false, message: "Error grading submission" });
  }
});

export default router;
