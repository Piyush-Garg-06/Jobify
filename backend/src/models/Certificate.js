import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema(
  {
    certId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    studentName: {
      type: String,
      required: true,
    },
    domain: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
    college: {
      type: String,
      required: true,
    },
    issued: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Certificate", certificateSchema);
