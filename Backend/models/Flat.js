import mongoose from 'mongoose';

const FlatSchema = new mongoose.Schema(
  {
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    flatNumber: { type: String, required: true },
    floor: { type: Number, required: true },
    size: { type: Number, required: true },
    type: {
      type: String,
      enum: ['residential', 'commercial'],
      required: true,
    },
    status: {
      type: String,
      enum: ['available', 'booked', 'blocked', 'sold'],
      default: 'available',
    },
    description: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

FlatSchema.index({ project: 1, flatNumber: 1, deletedAt: 1 }, { unique: true });
FlatSchema.index({ project: 1, status: 1 });

const Flat = mongoose.model('Flat', FlatSchema);
export default Flat;
