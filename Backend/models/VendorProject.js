import mongoose from "mongoose";

const VendorProjectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, 

    description: { type: String },

    vendor: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", required: true },

    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },

    contractAmount: { type: Number, default: 0 },

    paidAmount: { type: Number, default: 0 },

    status: {
      type: String,
      enum: ["active", "archived"],
      default: "active",
    },

    createdBy: { type: mongoose.Schema.Types.ObjectId },

    deletedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
  }
);

const VendorProject = mongoose.model("VendorProject", VendorProjectSchema);

export default VendorProject;