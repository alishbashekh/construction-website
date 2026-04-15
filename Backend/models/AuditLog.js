import mongoose from 'mongoose';

const AuditLogSchema = new mongoose.Schema(
  {
    performedBy: {
      type: mongoose.Schema.Types.ObjectId, // stores a reference ID, not the full user object
      ref: 'User',                          // tells Mongoose this ID belongs to the User model
      required: true                        // every log MUST know who did it
    },

    performerRole: {
      type: String,
      enum: ['system_admin', 'accounts_officer', 'booking_officer'], // only these 3 values allowed
      required: true
    },

    action: {
      type: String,
      required: true,
      enum: [
        'auth_login', 'auth_password_change',             // login / password stuff
        'user_create', 'user_update', 'user_delete',      // user management
        'user_restore', 'user_status_change',
        'project_create', 'project_update',               // project stuff
        'project_delete', 'project_restore', 'project_archive',
        'flat_create', 'flat_update', 'flat_delete',      // flat stuff
        'flat_restore', 'flat_status_change',
        'client_create', 'client_update',                 // client stuff
        'client_delete', 'client_restore',
        'booking_create', 'booking_cancel',               // booking stuff
        'booking_transfer',
        'payment_create', 'payment_update',               // payment stuff
        'payment_delete',
        'refund_create',                                  // refund
        'vendor_project_create', 'vendor_project_update', // vendor project
        'vendor_project_delete', 'vendor_project_restore',
        'vendor_create', 'vendor_update',                 // vendor
        'vendor_delete', 'vendor_restore',
        'vendor_payment_create', 'vendor_payment_update', // vendor payment
        'vendor_payment_delete', 'vendor_payment_restore',
        'expense_create', 'expense_update',               // expense
        'expense_delete',
        'system_backup',                                  // system stuff
        'other',                                          // anything else
      ],
    },

    category: {
      type: String,
      enum: [
        'auth', 'user_management', 'project', 'flat',
        'client', 'booking', 'payment', 'refund',
        'vendor_project', 'vendor', 'vendor_payment',
        'expense', 'system', 'other',
      ],
      required: true
    },

    targetModel: { type: String },
    targetId: { type: mongoose.Schema.Types.ObjectId },
 

    description: { type: String, required: true },

    previousState: { type: Object },

    newState: { type: Object },

    reason: { type: String },

    ip: { type: String },

    userAgent: { type: String },

    severity: {
      type: String,
      enum: ['info', 'warning', 'critical'],
      default: 'info' // most actions are just info by default
    },

    deletedAt: { type: Date, default: null },
  },

  // Automatically adds createdAt and updatedAt fields to every document
  { timestamps: true }
);

AuditLogSchema.index({ category: 1, createdAt: -1 });

// Quickly fetch all recent logs, sorted newest first
AuditLogSchema.index({ createdAt: -1 });

// Quickly filter logs by severity (e.g. find all "critical" logs)
AuditLogSchema.index({ severity: 1 });


// Create the model from the schema and export it
const AuditLog = mongoose.model('AuditLog', AuditLogSchema);
export default AuditLog;