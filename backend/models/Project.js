import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    description: { type: String, default: "", trim: true, maxlength: 2000 },
    dialect: { type: String, default: "PostgreSQL", trim: true, maxlength: 40 },
    isPublicTemplate: { type: Boolean, default: false },
    canvasData: {
      nodes: { type: mongoose.Schema.Types.Mixed, default: [] },
      edges: { type: mongoose.Schema.Types.Mixed, default: [] },
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  },
  { timestamps: true }
);

projectSchema.index({ createdBy: 1, updatedAt: -1 });

export default mongoose.model("Project", projectSchema);
