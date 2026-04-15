import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema(
  {
    // unique id for every receipt
    receiptNumber: { type: String, unique: true },

    // links to other tables
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    flat: { type: mongoose.Schema.Types.ObjectId, ref: "Flat", required: true },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    // payment info
    amount: { type: Number, required: true },
    type: { type: String, default: "regular" },
    paymentMode: { type: String, required: true }, // cash, bank, etc.

    // extra info
    paymentDate: { type: Date, default: Date.now },
    description: { type: String },

    // for soft delete
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }, // adds createdAt and updatedAt automatically
);

// This runs before saving a new payment to make a receipt number
PaymentSchema.pre("save", async function (next) {
  if (!this.receiptNumber) {
    const count = await mongoose.model("Payment").countDocuments();
    this.receiptNumber = `PAY-${count + 1}`; // Simple format: PAY-1, PAY-2
  }
  next();
});

const Payment = mongoose.model("Payment", PaymentSchema);
export default Payment;
