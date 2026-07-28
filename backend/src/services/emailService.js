import nodemailer from "nodemailer";
import PDFDocument from "pdfkit";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Setup NodeMailer Transporter
const getTransporter = async () => {
  const host = process.env.SMTP_HOST || "smtp.ethereal.email";
  const port = parseInt(process.env.SMTP_PORT || "587");
  let user = process.env.SMTP_USER;
  let pass = process.env.SMTP_PASS;

  // Fallback to Ethereal test account if credentials are not provided
  if (!user || !pass) {
    console.log("No SMTP credentials. Creating ethereal.email test account...");
    const testAccount = await nodemailer.createTestAccount();
    return nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // true for 465, false for other ports
    auth: { user, pass },
  });
};

// Helper to calculate duration label, start date, and end date dynamically
const getDurationDetails = (durationStr) => {
  let days = 45;
  let label = "One and half month (45 days)";
  
  const d = (durationStr || "").toLowerCase();
  if (d.includes("1 month") || d.includes("30 day") || d.includes("starter") || d.includes("4 week")) {
    days = 30;
    label = "One month (30 days)";
  } else if (d.includes("2 month") || d.includes("60 day") || d.includes("pro") || d.includes("8 week")) {
    days = 60;
    label = "Two months (60 days)";
  } else if (d.includes("45 day") || d.includes("advanced") || d.includes("6 week") || d.includes("1.5 month")) {
    days = 45;
    label = "One and half month (45 days)";
  }
  
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const yyyy = today.getFullYear();
  const startDateStr = `${dd}-${mm}-${yyyy}`;
  
  const endDate = new Date();
  endDate.setDate(today.getDate() + days);
  const edd = String(endDate.getDate()).padStart(2, '0');
  const emm = String(endDate.getMonth() + 1).padStart(2, '0');
  const eyyyy = endDate.getFullYear();
  const endDateStr = `${edd}-${emm}-${eyyyy}`;
  
  return { days, label, startDateStr, endDateStr };
};

// Generates Offer Letter PDF returning a Buffer
export const generateOfferLetterPDF = (name, domain, duration, college) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: 40 });
    const chunks = [];

    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", (err) => reject(err));

    const logoPath = path.join(__dirname, "../assets/logo.png");
    const logoExists = fs.existsSync(logoPath);
    
    const qrPath = path.join(__dirname, "../assets/qrcode.png");
    const qrExists = fs.existsSync(qrPath);

    // 1. Watermark Background Logo (drawn first)
    if (logoExists) {
      doc.save();
      doc.opacity(0.15);
      doc.image(logoPath, 15, 140, { width: 565 });
      doc.restore();
    }

    // 2. Footer background decorative waves covering entire width
    doc.save();
    // Gold Wave (drawn first, behind)
    doc.fillColor("#FFB800")
       .moveTo(0, 841)
       .lineTo(0, 765)
       .bezierCurveTo(120, 795, 280, 775, 420, 735)
       .bezierCurveTo(490, 715, 550, 745, 595, 770)
       .lineTo(595, 841)
       .closePath()
       .fill();
       
    // Navy Blue Wave (drawn on top, shifted down to create a gold stripe effect)
    doc.fillColor("#0A2540")
       .moveTo(0, 841)
       .lineTo(0, 780)
       .bezierCurveTo(120, 810, 280, 790, 420, 750)
       .bezierCurveTo(490, 730, 550, 760, 595, 785)
       .lineTo(595, 841)
       .closePath()
       .fill();
    doc.restore();

    // 3. Header Section
    // Logo (Top Left)
    if (logoExists) {
      doc.image(logoPath, 40, 15, { width: 160 });
    }

    // QR Code (Top Middle)
    if (qrExists) {
      doc.image(qrPath, 210, 12, { width: 85, height: 85 });
    }

    // Contact info (Top Right) with actual vector SVG paths
    // Map Pin Icon (Red)
    doc.save()
       .translate(365, 38)
       .scale(0.45)
       .path("M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z")
       .fill("#E53E3E")
       .restore();

    // Phone Icon (Grey)
    doc.save()
       .translate(365, 53)
       .scale(0.45)
       .path("M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z")
       .fill("#4A5568")
       .restore();

    // Envelope Icon (Blue)
    doc.save()
       .translate(365, 68)
       .scale(0.45)
       .path("M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z")
       .fill("#3182CE")
       .restore();

    // Contact info text
    doc.fontSize(9.5).font("Helvetica").fillColor("#1A202C");
    doc.text("Jaipur, Rajasthan, India", 380, 39);
    doc.text("+91 79764 86392", 380, 54);
    doc.text("jobify.internship@gmail.com", 380, 69);

    // Blue horizontal divider line
    doc.strokeColor("#0A2540").lineWidth(2.5).moveTo(40, 105).lineTo(555, 105).stroke();

    // 4. Document Title
    doc.fontSize(28).font("Times-Bold").fillColor("#0A2540").text("Offer Letter", 40, 122, { align: "center" });

    // Date (Top Right)
    const letterDate = new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    doc.fontSize(12).font("Times-Roman").fillColor("#000000").text(letterDate, 40, 150, { align: "right" });

    // 5. Greeting
    doc.fontSize(13).font("Times-Bold").fillColor("#000000").text(`Dear ${name},`, 40, 175);

    // 6. Body text
    const { label: durationLabel, startDateStr, endDateStr } = getDurationDetails(duration);
    
    doc.font("Times-Roman").fontSize(12.5).lineGap(1.5).fillColor("#000000");
    
    const bodyText1 = `We are pleased to offer you a virtual internship at Jobify Technology & Services Private Limited in the domain of ${domain}.\n\nCongratulations! This internship is designed to provide you with practical exposure, hands-on learning, and project-based experience in your selected field. During the internship, you will work on assigned tasks, learning activities, documentation, and project submissions through the Jobify portal.`;
    doc.text(bodyText1, 40, 205, { width: 515 });

    // Internship Details block
    const yDetailsHeader = doc.y + 20;
    doc.font("Times-Bold").text("Your internship details are as follows:", 40, yDetailsHeader);
    
    const yDetailsList = doc.y + 8;
    doc.font("Times-Roman").lineGap(2.0);
    doc.text("Domain: ", 40, yDetailsList, { continued: true }).font("Times-Bold").text(domain);
    doc.font("Times-Roman").text("Mode: ", 40, doc.y + 5, { continued: true }).font("Times-Bold").text("Virtual");
    doc.font("Times-Roman").text("Duration: ", 40, doc.y + 5, { continued: true }).font("Times-Bold").text(durationLabel);
    doc.font("Times-Roman").text("Start Date: ", 40, doc.y + 5, { continued: true }).font("Times-Bold").text(startDateStr);
    doc.font("Times-Roman").text("End Date: ", 40, doc.y + 5, { continued: true }).font("Times-Bold").text(endDateStr);

    // Commitment and terms
    const yCommitment = doc.y + 15;
    doc.font("Times-Bold").text("Weekly Commitment: 5 hours per week", 40, yCommitment);
    
    const yBody2 = doc.y + 15;
    doc.font("Times-Roman").lineGap(1.5);
    const bodyText2 = `The internship will be conducted for ${durationLabel}, as selected during registration.To be eligible for the internship completion certificate, the intern must complete.\n\nthe assigned tasks, project work, and required submissions within the specified timeline.\n\nThisinternship is intended for learning and skill development purposes and does not create an employer-employee relationship with Jobify Technology & Services Private Limited.\n\nWe welcome you to the Jobify internship program and wish you a successful learning experience.`;
    doc.text(bodyText2, 40, yBody2, { width: 515 });

    // 7. Signature / Regards
    const yRegards = doc.y + 25;
    doc.font("Times-Roman").fontSize(12.5).lineGap(2).text("Regards,", 40, yRegards);
    doc.font("Times-Bold").fontSize(13).text("HR Jobify", 40, doc.y + 4);

    doc.end();
  });
};

// Send Approval Email with credentials and offer letter attachment
export const sendApprovalEmail = async (email, name, username, password, pdfBuffer) => {
  try {
    const transporter = await getTransporter();
    const portalUrl = "https://jobify-internships.netlify.app/#/lms";

    const mailOptions = {
      from: process.env.SMTP_FROM || `"Jobify LMS Portal" <noreply@jobify.com>`,
      to: email,
      subject: `🎉 Congratulations! Your Jobify Internship Application is Approved!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
          <h2 style="color: #0070f3; text-align: center;">Welcome to Jobify!</h2>
          <p>Dear <strong>${name}</strong>,</p>
          <p>We are thrilled to inform you that your application for the internship track has been <strong>Approved</strong> after verification of your payment.</p>
          
          <div style="background-color: #f7fafc; padding: 15px; border-left: 4px solid #0070f3; border-radius: 8px; margin: 20px 0;">
            <h4 style="margin: 0 0 10px 0; color: #2d3748;">🔑 Your LMS Portal Credentials:</h4>
            <p style="margin: 5px 0;"><strong>Portal URL:</strong> <a href="${portalUrl}" style="color: #0070f3;">${portalUrl}</a></p>
            <p style="margin: 5px 0;"><strong>Username:</strong> <code style="background: #edf2f7; padding: 2px 6px; border-radius: 4px;">${username}</code></p>
            <p style="margin: 5px 0;"><strong>Password:</strong> <code style="background: #edf2f7; padding: 2px 6px; border-radius: 4px;">${password}</code></p>
          </div>

          <p>Please log in using the credentials above, select your weekly tasks, submit your GitHub links, and complete your curriculum tasks to receive your final Internship Certificate.</p>
          <p>We have attached your official <strong>Offer Letter</strong> to this email.</p>
          
          <hr style="border: 0; border-top: 1px solid #edf2f7; margin: 20px 0;" />
          <p style="font-size: 12px; color: #a0aec0; text-align: center;">This is an automated notification. If you did not apply, please ignore this email.</p>
        </div>
      `,
      attachments: [
        {
          filename: `Jobify_Offer_Letter_${name.replace(/\s+/g, "_")}.pdf`,
          content: pdfBuffer,
        },
      ],
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Approval email sent successfully to ${email}. Message ID: ${info.messageId}`);
    if (transporter.options.host === "smtp.ethereal.email") {
      console.log(`Ethereal Email URL to preview sent email: ${nodemailer.getTestMessageUrl(info)}`);
    }
  } catch (error) {
    console.error("Error sending approval email:", error);
    throw error;
  }
};

// Send Rejection/Decline Email
export const sendDeclineEmail = async (email, name) => {
  try {
    const transporter = await getTransporter();

    const mailOptions = {
      from: process.env.SMTP_FROM || `"Jobify LMS Portal" <noreply@jobify.com>`,
      to: email,
      subject: `Jobify Internship Application Update`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
          <h2 style="color: #e53e3e; text-align: center;">Application Status Update</h2>
          <p>Dear <strong>${name}</strong>,</p>
          <p>Thank you for your interest in the Jobify Internship track.</p>
          <p>We regret to inform you that we were unable to verify your payment credentials or details, and your application has been declined at this time.</p>
          <p>If you believe this is a mistake or would like to re-submit with correct transaction details, please apply again via our website portal.</p>
          
          <hr style="border: 0; border-top: 1px solid #edf2f7; margin: 20px 0;" />
          <p style="font-size: 12px; color: #a0aec0; text-align: center;">Jobify Support Team</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Decline email sent successfully to ${email}. Message ID: ${info.messageId}`);
    if (transporter.options.host === "smtp.ethereal.email") {
      console.log(`Ethereal Email URL to preview sent email: ${nodemailer.getTestMessageUrl(info)}`);
    }
  } catch (error) {
    console.error("Error sending decline email:", error);
    throw error;
  }
};
