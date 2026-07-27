import nodemailer from "nodemailer";
import PDFDocument from "pdfkit";
import path from "path";
import fs from "fs";

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
  if (d.includes("1 month") || d.includes("30 day") || d.includes("starter")) {
    days = 30;
    label = "One month (30 days)";
  } else if (d.includes("2 month") || d.includes("60 day") || d.includes("pro")) {
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

    const logoPath = path.resolve("src/assets/logo.png");
    const logoExists = fs.existsSync(logoPath);

    // 1. Watermark Background Logo (drawn first)
    if (logoExists) {
      doc.save();
      doc.opacity(0.045);
      doc.image(logoPath, 147, 270, { width: 300 });
      doc.restore();
    }

    // 2. Footer background decorative waves (drawn in bottom-right corner)
    doc.save();
    // Dark Blue base wave
    doc.fillColor("#0A2540");
    doc.moveTo(320, 841)
       .bezierCurveTo(400, 790, 480, 770, 595, 770)
       .lineTo(595, 841)
       .lineTo(320, 841)
       .fill();
       
    // Orange/Gold overlap wave
    doc.fillColor("#FFB800");
    doc.moveTo(220, 841)
       .bezierCurveTo(340, 815, 470, 805, 595, 795)
       .lineTo(595, 805)
       .bezierCurveTo(470, 815, 340, 825, 220, 841)
       .fill();
    doc.restore();

    // 3. Header Section
    // Logo (Top Left)
    if (logoExists) {
      doc.image(logoPath, 40, 35, { width: 110 });
    }

    // Contact info (Top Right)
    doc.fontSize(8.5).font("Helvetica").fillColor("#4a6080");
    
    // Address Pin
    doc.fillColor("#E53E3E").circle(420, 47, 3.5).fill();
    doc.fillColor("#4a6080").text("Jaipur, Rajasthan, India", 430, 44);
    
    // Phone
    doc.fillColor("#38A169").circle(420, 60, 3.5).fill();
    doc.fillColor("#4a6080").text("+91 93517 69851", 430, 57);
    
    // Email
    doc.fillColor("#3182CE").circle(420, 73, 3.5).fill();
    doc.fillColor("#4a6080").text("contact@jobify.in", 430, 70);
    
    // Website
    doc.fillColor("#319795").circle(420, 86, 3.5).fill();
    doc.fillColor("#4a6080").text("www.jobify.in", 430, 83);

    // Blue horizontal divider line
    doc.strokeColor("rgba(10,37,64,0.15)").lineWidth(1.5).moveTo(40, 115).lineTo(555, 115).stroke();

    // 4. Document Title
    doc.fontSize(24).font("Helvetica-Bold").fillColor("#0A2540").text("Offer Letter", 40, 135, { align: "center" });

    // Date (Top Right)
    const letterDate = new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    doc.fontSize(10.5).font("Helvetica").fillColor("#333").text(letterDate, 40, 175, { align: "right" });

    // 5. Greeting
    doc.fontSize(10.5).font("Helvetica-Bold").fillColor("#333").text(`Dear ${name},`, 40, 195);

    // 6. Body text
    const { label: durationLabel, startDateStr, endDateStr } = getDurationDetails(duration);
    
    doc.font("Helvetica").fontSize(9.5).lineGap(4.5).fillColor("#333");
    
    const bodyText1 = `We are pleased to offer you a virtual internship at iNeuBytes Technology & Services Private Limited in the domain of ${domain}.\n\nCongratulations! This internship is designed to provide you with practical exposure, hands-on learning, and project-based experience in your selected field. During the internship, you will work on assigned tasks, learning activities, documentation, and project submissions through the iNeuBytes portal.`;
    doc.text(bodyText1, 40, 220, { width: 515 });

    // Internship Details block
    doc.font("Helvetica-Bold").text("Your internship details are as follows:", 40, 330);
    
    doc.font("Helvetica").text("Domain: ", 40, 348, { continued: true }).font("Helvetica-Bold").text(domain);
    doc.font("Helvetica").text("Mode: ", 40, 363, { continued: true }).font("Helvetica-Bold").text("Virtual");
    doc.font("Helvetica").text("Duration: ", 40, 378, { continued: true }).font("Helvetica-Bold").text(durationLabel);
    doc.font("Helvetica").text("Start Date: ", 40, 393, { continued: true }).font("Helvetica-Bold").text(startDateStr);
    doc.font("Helvetica").text("End Date: ", 40, 408, { continued: true }).font("Helvetica-Bold").text(endDateStr);

    // Commitment and terms
    doc.font("Helvetica-Bold").text("Weekly Commitment: 5 hours per week", 40, 435);
    
    const bodyText2 = `The internship will be conducted for ${durationLabel}, as selected during registration. To be eligible for the internship completion certificate, the intern must complete the assigned tasks, project work, and required submissions within the specified timeline. This internship is intended for learning and skill development purposes and does not create an employer-employee relationship with iNeuBytes Technology & Services Private Limited.\n\nWe welcome you to the iNeuBytes internship program and wish you a successful learning experience.`;
    doc.font("Helvetica").fontSize(9.5).lineGap(4.5).fillColor("#333").text(bodyText2, 40, 455, { width: 515 });

    // 7. Signature / Regards
    doc.font("Helvetica").fontSize(9.5).lineGap(3).text("Regards,", 40, 580);
    doc.font("Helvetica-Bold").text("Shruti Kumari", 40, 595);
    doc.font("Helvetica").text("Human Resource", 40, 610);
    doc.font("Helvetica").fillColor("#666").text("iNeuBytes Technology & Services Private Limited.", 40, 625);

    doc.end();
  });
};

// Send Approval Email with credentials and offer letter attachment
export const sendApprovalEmail = async (email, name, username, password, pdfBuffer) => {
  try {
    const transporter = await getTransporter();
    const portalUrl = "http://localhost:5173/#/lms";

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
