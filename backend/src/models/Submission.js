import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    week: {
      type: Number,
      required: true,
    },
    repoUrl: {
      type: String,
      required: true,
      trim: true,
    },
    linkedinUrl: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["Pending Review", "Approved", "Rejected"],
      default: "Pending Review",
    },
    grade: {
      type: String,
      default: "Awaiting Grading",
    },
  },
  { timestamps: true }
);

// Ensure a student can only submit once per week
submissionSchema.index({ studentId: 1, week: 1 }, { unique: true });

export default mongoose.model("Submission", submissionSchema);
