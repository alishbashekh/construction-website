import mongoose from 'mongoose';

const ClientSchema = new mongoose.Schema(
  {
    clientId: { type: String, unique: true },
    name: { type: String, required: true },
    guardian: { type: String, required: true },
    cnic: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    address: { type: String },
    mailingAddress: { type: String },
    nomineeName: { type: String },
    nomineeGuardian: { type: String },
    nomineeCnic: { type: String },
    nomineePhone: { type: String },
    nomineeRelation: { type: String },
    officePhone: { type: String },
    residencePhone: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

ClientSchema.index({ cnic: 1, deletedAt: 1 }, { unique: true });

ClientSchema.pre('save', async function (next) {
  try {
    if (this.clientId) return next();

    const Client = mongoose.model('Client');
    let isUnique = false;

    while (!isUnique) {
      const count = await Client.countDocuments();
      const candidate = `CLT-${String(count + 1).padStart(5, '0')}`;
      const existing = await Client.findOne({ clientId: candidate }).select('_id');
      if (!existing) {
        this.clientId = candidate;
        isUnique = true;
      }
    }

    next();
  } catch (error) {
    next(error);
  }
});

const Client = mongoose.model('Client', ClientSchema);
export default Client;
