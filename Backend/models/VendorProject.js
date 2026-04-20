import mongoose from "mongoose";

const VendorProjectSchema = new mongoose.Schema(
  {
    // The name of the project like 'Electric Work' or 'Painting'
    name: { type: String, required: true },

    // Details about the project work
    description: { type: String },

    // Project status: active means running, archived means finished
    status: {
      type: String,
      enum: ["active", "archived"],
      default: "active",
    },

    // To track which user created this project
    createdBy: { type: mongoose.Schema.Types.ObjectId },

    // Soft Delete — null means not deleted, date means deleted
    deletedAt: { type: Date, default: null },
  },
  {
    // Automatically adds 'createdAt' and 'updatedAt' fields
    timestamps: true,
  }
);

const VendorProject = mongoose.model("VendorProject", VendorProjectSchema);

export default VendorProject;