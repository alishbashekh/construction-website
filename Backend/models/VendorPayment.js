import mongoose from "mongoose";

const VendorPaymentSchema = new mongoose.Schema(
  {
    // Main receipt number for the whole contract
    receiptNumber: { type: String },

    // Links to the project and the vendor
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "VendorProject",
      required: true,
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
    },

    date: { type: Date, default: Date.now },

    // Total money agreed for the work
    totalAmount: { type: Number, required: true },

    // Total money we have paid so far
    totalPaid: { type: Number, default: 0 },

    // A list to keep record of every installment (partial payment)
    payments: [
      {
        amount: { type: Number, required: true },
        paymentMode: {
          type: String,
          enum: ["cash", "bank", "cheque"],
          required: true,
        },
        reference: { type: String }, // Cheque number or bank ID
        description: { type: String },
        date: { type: Date, default: Date.now },
      },
    ],

    // Tracking who added this record
    createdBy: { type: mongoose.Schema.Types.ObjectId },

    // Tells if the work is paid, pending, or half-paid
    status: {
      type: String,
      enum: ["pending", "paid", "partially_paid"],
      default: "pending",
    },

    // For soft delete
    deletedAt: { type: Date, default: null },
  },
  {
    // Adds createdAt and updatedAt automatically
    timestamps: true,
  }
);

const VendorPayment = mongoose.model("VendorPayment", VendorPaymentSchema);

export default VendorPayment;