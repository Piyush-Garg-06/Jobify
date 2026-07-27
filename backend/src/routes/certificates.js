import express from "express";
import Certificate from "../models/Certificate.js";
import Submission from "../models/Submission.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// @desc    Verify a certificate by ID
// @route   GET /api/certificates/verify/:certId
// @access  Public
router.get("/verify/:certId", async (req, res) => {
  const { certId } = req.params;

  try {
    const certificate = await Certificate.findOne({
      certId: certId.trim().toUpperCase(),
    });

    if (certificate) {
      res.json({
        success: true,
        certificate: {
          id: certificate.certId,
          name: certificate.studentName,
          domain: certificate.domain,
          duration: certificate.duration,
          college: certificate.college,
          issued: certificate.issued.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
        },
      });
    } else {
      res.status(404).json({ success: false, message: "Certificate not found" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Error verifying certificate" });
  }
});

// @desc    Generate/Issue certificate for the authenticated student
// @route   POST /api/certificates/generate
// @access  Private
router.post("/generate", protect, async (req, res) => {
  try {
    const student = req.user;

    // Check if certificate already exists for this student in this domain
    const existingCert = await Certificate.findOne({
      studentName: student.name,
      domain: student.domain,
    });

    if (existingCert) {
      return res.json({ success: true, certificate: existingCert });
    }

    // Determine expected number of weeks based on duration
    let expectedWeeks = 8;
    if (student.duration === "1 Month") expectedWeeks = 4;
    else if (student.duration === "45 Days") expectedWeeks = 6;

    // Verify if all weeks are submitted and approved
    const approvedSubmissionsCount = await Submission.countDocuments({
      studentId: student._id,
      status: "Approved",
    });

    if (approvedSubmissionsCount < expectedWeeks) {
      return res.status(400).json({
        success: false,
        message: `You must have all ${expectedWeeks} weekly tasks approved. Currently approved: ${approvedSubmissionsCount}`,
      });
    }

    // Generate unique Certificate ID
    const count = await Certificate.countDocuments();
    const certNum = String(count + 100).padStart(3, "0");
    const certId = `JBF-2026-${certNum}`;

    const newCertificate = await Certificate.create({
      certId,
      studentName: student.name,
      domain: student.domain,
      duration: student.duration,
      college: student.college,
    });

    res.json({ success: true, certificate: newCertificate });
  } catch (error) {
    console.error("Certificate generation error:", error);
    res.status(500).json({ success: false, message: "Error generating certificate" });
  }
});

export default router;
