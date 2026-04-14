import mongoose from "mongoose";
import { getVendorDB } from "../db/index.js"; // getting connection for vendor database

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

    // IMPORTANT: This field is for Soft Delete.
    // It is 'null' by default, but stores a date when deleted.
    deletedAt: { type: Date, default: null },
  },
  {
    // Automatically adds 'createdAt' and 'updatedAt' fields
    timestamps: true,
  },
);

// Function to handle database connection
const getVendorProjectModel = () => {
  const db = getVendorDB(); // Get the specific connection

  // Use existing model or create a new one
  return (
    db.models.VendorProject || db.model("VendorProject", VendorProjectSchema)
  );
};

export default getVendorProjectModel;
