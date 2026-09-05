import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, unique: true, index: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: ["Regular User", "Moderator", "Administrator"],
      default: "Regular User",
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
