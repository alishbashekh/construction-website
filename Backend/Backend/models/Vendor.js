import mongoose from "mongoose";

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
  }
);

const Vendor = mongoose.model("Vendor", VendorSchema);

export default Vendor;