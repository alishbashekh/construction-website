import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema(
  {
    bookingNumber: { type: String, unique: true },
    flat: { type: mongoose.Schema.Types.ObjectId, ref: 'Flat', required: true },
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    bookingDate: { type: Date, required: true, default: Date.now },
    bookingPrice: { type: Number, required: true, min: 0 },
    paymentPlan: { type: String },
    status: {
      type: String,
      enum: ['active', 'cancelled', 'transferred', 'completed'],
      default: 'active',
    },

    cancelledAt: { type: Date },
    cancelledBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    cancellationReason: { type: String },

    transferredTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
    transferredFrom: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

BookingSchema.index({ flat: 1, status: 1 });
BookingSchema.index({ status: 1 });
BookingSchema.index({ bookingDate: -1 });

// ✅ Fixed: removed next parameter
BookingSchema.pre('save', async function () {
  if (!this.bookingNumber) {
    const count = await mongoose.model('Booking').countDocuments();
    this.bookingNumber = `BKG-${String(count + 1).padStart(5, '0')}`;
  }
});

const Booking = mongoose.model('Booking', BookingSchema);
export default Booking;