import mongoose from 'mongoose';

const ExpenseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 0 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

ExpenseSchema.index({ deletedAt: 1 });
ExpenseSchema.index({ createdAt: -1 });

const Expense = mongoose.model('Expense', ExpenseSchema);
export default Expense;
