import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Certificate from "../models/Certificate.js";
import Submission from "../models/Submission.js";

export const seedDatabase = async () => {
  try {
    // 1. Seed Student & Admin Users
    let testUser = await User.findOne({ username: "testuser" });
    if (!testUser) {
      console.log("Seeding test student...");
      const hashedPassword = await bcrypt.hash("password123", 10);
      testUser = await User.create({
        username: "testuser",
        password: hashedPassword,
        name: "Test Student",
        domain: "Web Development",
        duration: "45 Days",
        college: "XYZ Institute of Technology",
        role: "student",
      });
      console.log("Test student seeded successfully.");
    }

    let adminUser = await User.findOne({ username: "admin" });
    if (!adminUser) {
      console.log("Seeding admin user...");
      const hashedPassword = await bcrypt.hash("password123", 10);
      adminUser = await User.create({
        username: "admin",
        password: hashedPassword,
        name: "Jobify Admin",
        domain: "Management",
        duration: "N/A",
        college: "Jobify Office",
        role: "admin",
      });
      console.log("Admin user seeded successfully.");
    }

    // 2. Seed Mock Certificates
    const certCount = await Certificate.countDocuments();
    if (certCount === 0) {
      console.log("No certificates found. Seeding mock certificates...");
      await Certificate.create([
        {
          certId: "JBF-2025-001",
          studentName: "Priya Sharma",
          domain: "Python",
          duration: "45 Days",
          college: "VIT Vellore",
          issued: new Date("2025-03-15"),
        },
        {
          certId: "JBF-2025-042",
          studentName: "Rahul Mehta",
          domain: "Web Development",
          duration: "2 Months",
          college: "BITS Pilani",
          issued: new Date("2025-04-02"),
        },
        {
          certId: "JBF-2025-078",
          studentName: "Sneha Patel",
          domain: "AI / ML",
          duration: "1 Month",
          college: "NIT Surat",
          issued: new Date("2025-05-10"),
        },
      ]);
      console.log("Mock certificates seeded.");
    }

    // 3. Seed Submissions for testuser if none exist
    if (testUser) {
      const submissionCount = await Submission.countDocuments({ studentId: testUser._id });
      if (submissionCount === 0) {
        console.log("Seeding submissions for testuser...");
        await Submission.create([
          {
            studentId: testUser._id,
            week: 1,
            repoUrl: "https://github.com/testuser/html-landing",
            linkedinUrl: "https://linkedin.com/posts/testuser-week1",
            status: "Approved",
            grade: "A+",
          },
          {
            studentId: testUser._id,
            week: 2,
            repoUrl: "https://github.com/testuser/js-dynamic-app",
            linkedinUrl: "https://linkedin.com/posts/testuser-week2",
            status: "Approved",
            grade: "A",
          },
        ]);
        console.log("Submissions seeded.");
      }
    }
  } catch (error) {
    console.error("Seeding error:", error);
  }
};
