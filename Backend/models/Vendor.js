import mongoose from "mongoose";
import { getVendorDB } from "../db/index.js"; // getting the vendor database connection

const VendorSchema = new mongoose.Schema(
  {
    // Name of the company or person
    name: { type: String, required: true },

    // What kind of work they do
    category: {
      type: String,
      enum: ["contractor", "supplier", "consultant"],
      required: true,
    },

    // Contact details
    phone: { type: String, required: true },
    email: { type: String },
    address: { type: String },

    // ID of the user who added this vendor
    createdBy: { type: mongoose.Schema.Types.ObjectId },

    // For soft delete (marking as deleted without removing from DB)
    deletedAt: { type: Date, default: null },
  },
  {
    // Automatically adds 'createdAt' and 'updatedAt'
    timestamps: true,
  },
);

// This function connects the schema to the database
const getVendorModel = () => {
  const db = getVendorDB(); // Get the active database connection

  // If the model already exists, use it. Otherwise, create it.
  return db.models.Vendor || db.model("Vendor", VendorSchema);
};

export default getVendorModel;
