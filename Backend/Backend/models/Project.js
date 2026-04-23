import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema(
  {
    // Basic details of the construction project
    name: { type: String, required: true },
    location: { type: String, required: true },

    // Total units and floors in this building
    totalFlats: { type: Number, required: true },
    totalFloors: { type: Number, required: true },

    description: { type: String },

    // Status: can be active or archived (hidden)
    status: {
      type: String,
      enum: ["active", "archived"],
      default: "active",
    },

    // Who created this project record
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // For soft delete feature
    deletedAt: { type: Date, default: null },
  },
  {
    // This automatically adds 'createdAt' and 'updatedAt'
    timestamps: true,
  },
);

const Project = mongoose.model("Project", ProjectSchema);
export default Project;
