import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    domain: {
      type: String,
      required: true,
      default: "Web Development",
    },
    duration: {
      type: String,
      required: true,
      default: "45 Days",
    },
    college: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student",
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
