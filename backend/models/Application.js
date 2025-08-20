import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: [true, "Job ID is required"],
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters long"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
      lowercase: true,
    },
    resume: {
      type: String,
      required: [true, "Resume file is required"],
    },
  },
  { timestamps: true }
);

// Optional: prevent duplicate applications at DB level
applicationSchema.index({ jobId: 1, email: 1 }, { unique: true });

export default mongoose.model("Application", applicationSchema);
