import Client from '../../models/Client.js';
import Booking from '../../models/Booking.js';
import Payment from '../../models/Payment.js';
import BaseController from '../BaseController.js';
import { createAuditLog } from '../../utils/auditLog.js';

class clientController extends BaseController {

  constructor() {
    super();
    // bind so 'this' does not get lost in routes
    this.create     = this.create.bind(this);
    this.getAll     = this.getAll.bind(this);
    this.getById    = this.getById.bind(this);
    this.update     = this.update.bind(this);
    this.delete     = this.delete.bind(this);
    this.restore    = this.restore.bind(this);
    this.getLedger  = this.getLedger.bind(this);
  }
  async create(req, res, next) {
    try {

      // STEP 1: Check required fields
      const validation = this.validateRequiredFields(req.body, [
        'name', 'cnic', 'phone', 'guardian'
      ]);
      if (validation) return res.status(400).json(validation);

      // STEP 2: Get cnic and phone from request
      const cnic  = req.body.cnic;
      const phone = req.body.phone;

  
      const existingClient = await Client.findOne({
        deletedAt: null,
        $or: [{ cnic }, { phone }] 
      });

      if (existingClient && existingClient.cnic === cnic) {
        return this.handleError(next, 'Client with this CNIC already exists', 400);
      }

      if (existingClient && existingClient.phone === phone) {
        return this.handleError(next, 'Client with this phone already exists', 400);
      }

      const client = await Client.create({
        ...req.body,
        createdBy: req.user._id
      });

      await createAuditLog({
        performedBy:   req.user._id,
        performerRole: req.user.role,
        action:        'client_create',
        category:      'client',
        targetModel:   'Client',
        targetId:      client._id,
        description:   `Created client "${client.name}" (CNIC: ${client.cnic})`,
        newState:      client.toJSON(),
        req,
      });

      return res.status(201).json({
        error: false,
        message: 'Client created successfully',
        data: client
      });

    } catch (error) {
      return this.handleError(next, error.message, 500);
    }
  }

  async getAll(req, res, next) {
    try {

      const page   = req.query.page  || 1;
      const limit  = req.query.limit || 10;
      const search = req.query.search || null;

      const query = { deletedAt: null };
      if (search) {
        query.$or = [
          { name:  { $regex: search, $options: 'i' } }, 
          { cnic:  { $regex: search, $options: 'i' } }, 
          { phone: { $regex: search, $options: 'i' } }, 
        ];
      }

      const clients = await Client.find(query)
        .populate('createdBy', 'fullName email') 
        .sort({ createdAt: -1 })                
        .skip((page - 1) * limit)                
        .limit(parseInt(limit));                 

      // STEP 5: Get total count for pagination
      const total = await Client.countDocuments(query);

      // STEP 6: Send response
      return res.status(200).json({
        error: false,
        data: clients,
        pagination: {
          total,
          page:  parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / limit)
        }
      });

    } catch (error) {
      return this.handleError(next, error.message, 500);
    }
  }


  async getById(req, res, next) {
    try {

      // STEP 1: Check if ID is valid
      if (!this.isValidId(req.params.id)) {
        return this.handleError(next, 'Invalid client ID', 400);
      }

      // STEP 2: Find the client
      const client = await Client.findOne({ _id: req.params.id, deletedAt: null })
        .populate('createdBy', 'fullName email');

      if (!client) return this.handleError(next, 'Client not found', 404);

      // STEP 3: Get all bookings of this client
      const bookings = await Booking.find({ client: client._id, deletedAt: null })
        .populate('flat',    'flatNumber floor size type')
        .populate('project', 'name location')
        .sort({ bookingDate: -1 });

      // STEP 4: Get all payments of this client
      const payments = await Payment.find({ client: client._id, deletedAt: null })
        .populate('booking', 'bookingNumber')
        .sort({ paymentDate: -1 });

      // STEP 5: Calculate financial summary
      // Total amount paid (not refunds)
      const totalPaid = payments
        .filter(p => !p.isRefund)
        .reduce((sum, p) => sum + p.amount, 0);

      // Total amount refunded
      const totalRefunded = payments
        .filter(p => p.isRefund)
        .reduce((sum, p) => sum + p.amount, 0);

      // Total booking price of active bookings only
      const totalBookingPrice = bookings
        .filter(b => b.status === 'active')
        .reduce((sum, b) => sum + b.bookingPrice, 0);

      // STEP 6: Send response with everything
      return res.status(200).json({
        error: false,
        data: {
          ...client.toJSON(),
          bookings,
          payments,
          financialSummary: {
            totalBookingPrice,
            totalPaid,
            totalRefunded,
            outstandingDues: totalBookingPrice - totalPaid + totalRefunded
          }
        }
      });

    } catch (error) {
      return this.handleError(next, error.message, 500);
    }
  }

  async update(req, res, next) {
    try {

      // STEP 1: Check if ID is valid
      if (!this.isValidId(req.params.id)) {
        return this.handleError(next, 'Invalid client ID', 400);
      }

      // STEP 2: Find the client
      const client = await Client.findOne({ _id: req.params.id, deletedAt: null });
      if (!client) return this.handleError(next, 'Client not found', 404);

      // STEP 3: Save old data before updating (for audit log)
      const previousState = client.toJSON();

      // STEP 4: Only update these allowed fields
      const allowedFields = [
        'name', 'cnic', 'guardian', 'phone', 'email',
        'address', 'nomineeName', 'nomineeCnic', 'nomineePhone',
        'nomineeRelation', 'officePhone', 'residencePhone',
        'mailingAddress', 'nomineeGuardian'
      ];

      // Go through each allowed field - if given in request, update it
      allowedFields.forEach(field => {
        if (req.body[field] !== undefined) {
          client[field] = req.body[field];
        }
      });

      // STEP 5: Check if new CNIC or phone already exists on another client
      const cnic  = req.body.cnic;
      const phone = req.body.phone;

      const duplicate = await Client.findOne({
        _id:       { $ne: client._id }, // not this same client
        deletedAt: null,
        $or: [{ cnic }, { phone }]
      });

      if (duplicate && duplicate.cnic === cnic) {
        return this.handleError(next, 'Client with this CNIC already exists', 400);
      }

      if (duplicate && duplicate.phone === phone) {
        return this.handleError(next, 'Client with this phone already exists', 400);
      }

      // STEP 6: Save updated client
      await client.save();

      // STEP 7: Save audit log
      await createAuditLog({
        performedBy:   req.user._id,
        performerRole: req.user.role,
        action:        'client_update',
        category:      'client',
        targetModel:   'Client',
        targetId:      client._id,
        description:   `Updated client "${client.name}"`,
        previousState,
        newState:      client.toJSON(),
        req,
      });

      // STEP 8: Send response
      return res.status(200).json({
        error: false,
        message: 'Client updated successfully',
        data: client
      });

    } catch (error) {
      return this.handleError(next, error.message, 500);
    }
  }

  async delete(req, res, next) {
    try {

      // STEP 1: Check if ID is valid
      if (!this.isValidId(req.params.id)) {
        return this.handleError(next, 'Invalid client ID', 400);
      }

      // STEP 2: Find the client
      const client = await Client.findOne({ _id: req.params.id, deletedAt: null });
      if (!client) return this.handleError(next, 'Client not found', 404);

      // STEP 3: Cannot delete if client has active bookings
      const activeBookings = await Booking.countDocuments({
        client:    client._id,
        status:    'active',
        deletedAt: null
      });

      if (activeBookings > 0) {
        return this.handleError(next, 'Cannot delete client with active bookings', 400);
      }

      // STEP 4: Soft delete - just add a timestamp, dont actually remove
      client.deletedAt = new Date();
      await client.save();

      // STEP 5: Save audit log
      await createAuditLog({
        performedBy:   req.user._id,
        performerRole: req.user.role,
        action:        'client_delete',
        category:      'client',
        targetModel:   'Client',
        targetId:      client._id,
        description:   `Deleted client "${client.name}"`,
        req,
        severity:      'warning',
      });

      // STEP 6: Send response
      return res.status(200).json({
        error: false,
        message: 'Client deleted successfully'
      });

    } catch (error) {
      return this.handleError(next, error.message, 500);
    }
  }

  async restore(req, res, next) {
    try {

      // STEP 1: Check if ID is valid
      if (!this.isValidId(req.params.id)) {
        return this.handleError(next, 'Invalid client ID', 400);
      }

      // STEP 2: Find the deleted client
      // deletedAt: { $ne: null } means - find only deleted ones
      const client = await Client.findOne({
        _id:       req.params.id,
        deletedAt: { $ne: null }  // $ne = not equal - so deletedAt is not null
      });

      if (!client) return this.handleError(next, 'Deleted client not found', 404);

      // STEP 3: Restore - remove the deleted timestamp
      client.deletedAt = null;
      await client.save();

      // STEP 4: Save audit log
      await createAuditLog({
        performedBy:   req.user._id,
        performerRole: req.user.role,
        action:        'client_restore',
        category:      'client',
        targetModel:   'Client',
        targetId:      client._id,
        description:   `Restored client "${client.name}"`,
        req,
      });

      // STEP 5: Send response
      return res.status(200).json({
        error: false,
        message: 'Client restored successfully',
        data: client
      });

    } catch (error) {
      return this.handleError(next, error.message, 500);
    }
  }

  async getLedger(req, res, next) {
    try {

      // STEP 1: Check if ID is valid
      if (!this.isValidId(req.params.id)) {
        return this.handleError(next, 'Invalid client ID', 400);
      }

      // STEP 2: Find the client
      const client = await Client.findOne({ _id: req.params.id, deletedAt: null });
      if (!client) return this.handleError(next, 'Client not found', 404);

      // STEP 3: Get all bookings - oldest first (sort: 1 = ascending)
      const bookings = await Booking.find({ client: client._id, deletedAt: null })
        .populate('flat',    'flatNumber floor size')
        .populate('project', 'name')
        .sort({ bookingDate: 1 }); // oldest first for ledger

      // STEP 4: Get all payments - oldest first
      const payments = await Payment.find({ client: client._id, deletedAt: null })
        .populate('booking', 'bookingNumber bookingPrice')
        .populate('flat',    'flatNumber')
        .populate('project', 'name')
        .sort({ paymentDate: 1 }); // oldest first for ledger

      // STEP 5: Calculate financial summary
      // Only active or completed bookings count
      const totalBookingPrice = bookings
        .filter(b => b.status === 'active' || b.status === 'completed')
        .reduce((sum, b) => sum + b.bookingPrice, 0);

      const totalPaid = payments
        .filter(p => !p.isRefund)
        .reduce((sum, p) => sum + p.amount, 0);

      const totalRefunded = payments
        .filter(p => p.isRefund)
        .reduce((sum, p) => sum + p.amount, 0);

      // STEP 6: Send response
      return res.status(200).json({
        error: false,
        data: {
          client,
          bookings,
          payments,
          summary: {
            totalBookingPrice,
            totalPaid,
            totalRefunded,
            outstandingDues: totalBookingPrice - totalPaid + totalRefunded
          }
        }
      });

    } catch (error) {
      return this.handleError(next, error.message, 500);
    }
  }

}

export default new clientController();