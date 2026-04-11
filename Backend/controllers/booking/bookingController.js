import Booking from '../../models/Booking.js';
import Flat from '../../models/Flat.js';
import Client from '../../models/Client.js';
import Project from '../../models/Project.js';
import Payment from '../../models/Payment.js';
import BaseController from '../BaseController.js';
import { createAuditLog } from '../../utils/auditLog.js';

class bookingController extends BaseController {

  constructor() {
    super();
    this.create   = this.create.bind(this);
    this.getAll   = this.getAll.bind(this);
    this.getById  = this.getById.bind(this);
    this.cancel   = this.cancel.bind(this);
    this.transfer = this.transfer.bind(this);
  }
  async create(req, res, next) {
    try {
      const validation = this.validateRequiredFields(req.body, [
        'flat', 'client', 'project', 'bookingPrice'
      ]);
      if (validation) return res.status(400).json(validation);
      const flatId    = req.body.flat;
      const clientId  = req.body.client;
      const projectId = req.body.project;
      if (!this.isValidId(flatId) || !this.isValidId(clientId) || !this.isValidId(projectId)) {
        return this.handleError(next, 'ID galat hai', 400);
      }

      const flat    = await Flat.findOne({ _id: flatId, deletedAt: null });
      const client  = await Client.findOne({ _id: clientId, deletedAt: null });
      const project = await Project.findOne({ _id: projectId, deletedAt: null });

      if (!flat)    return this.handleError(next, 'Flat not found', 404);
      if (!client)  return this.handleError(next, 'Client not found', 404);
      if (!project) return this.handleError(next, 'Project not found', 404);

      if (flat.status !== 'available') {
        return this.handleError(next, `Flat is ${flat.status}, book cant be book`, 400);
      }

      const booking = await Booking.create({
        ...req.body,
        createdBy: req.user._id
      });

      flat.status = 'booked';
      await flat.save();

      await createAuditLog({
        performedBy:   req.user._id,
        performerRole: req.user.role,
        action:        'booking_create',
        category:      'booking',
        targetModel:   'Booking',
        targetId:      booking._id,
        description:   `Flat ${flat.flatNumber} has been booked for client "${client.name}" in this project "${project.name}"`,
        newState:      booking.toJSON(),
        req,
      });

      return res.status(201).json({
        error: false,
        message: 'booked successfully!',
        data: booking
      });

    } catch (error) {
      return this.handleError(next, error.message, 500);
    }
  }

  async getAll(req, res, next) {
    try {
      const page   = req.query.page   || 1;
      const limit  = req.query.limit  || 10;
      const project = req.query.project || null;
      const client  = req.query.client  || null;
      const status  = req.query.status  || null;
      const search  = req.query.search  || null;

      const query = { deletedAt: null };

      if (project) query.project = project;
      if (client)  query.client  = client;
      if (status)  query.status  = status;
      if (search) {
        query.bookingNumber = { $regex: search, $options: 'i' };
      }

      const bookings = await Booking.find(query)
        .populate('flat',      'flatNumber floor size type')
        .populate('client',    'name cnic phone')
        .populate('project',   'name location')
        .populate('createdBy', 'fullName email')
        .sort({ bookingDate: -1 })        
        .skip((page - 1) * limit)         
        .limit(parseInt(limit));          

      const total = await Booking.countDocuments(query);
      return res.status(200).json({
        error: false,
        data: bookings,
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
      if (!this.isValidId(req.params.id)) {
        return this.handleError(next, 'Booking ID is wrong', 400);
      }
      const booking = await Booking.findOne({ _id: req.params.id, deletedAt: null })
        .populate('flat',      'flatNumber floor size type status')
        .populate('client',    'name cnic phone email address guardian officePhone residencePhone nomineeName nomineeGuardian nomineeCnic nomineeRelation')
        .populate('project',   'name location')
        .populate('createdBy', 'fullName email')
        .populate('cancelledBy', 'fullName email')
        .populate({ path: 'transferredTo',   populate: { path: 'client', select: 'name cnic phone nomineeName address' } })
        .populate({ path: 'transferredFrom', populate: { path: 'client', select: 'name cnic phone nomineeName address' } });

      if (!booking) return this.handleError(next, 'Booking not found', 404);
      const allBookingIds  = [booking._id];
      const transferHistory = [];
      let current = booking;

      while (current.transferredFrom) {
        const prev = current.transferredFrom._id
          ? current.transferredFrom
          : await Booking.findById(current.transferredFrom).populate('client', 'name cnic phone');

        if (!prev) break;

        allBookingIds.push(prev._id);
        transferHistory.push({
          bookingId:    prev._id,
          bookingNumber: prev.bookingNumber,
          client:       prev.client,
          bookingDate:  prev.bookingDate,
          bookingPrice: prev.bookingPrice,
        });

        current = await Booking.findById(prev._id);
        if (!current || !current.transferredFrom) break;
      }
      const payments = await Payment.find({
        booking: { $in: allBookingIds },
        deletedAt: null
      }).sort({ paymentDate: -1 });
      const currentPayments = payments.filter(p =>
        p.booking.toString() === booking._id.toString()
      );
      const transferredPayments = payments.filter(p =>
        p.booking.toString() !== booking._id.toString()
      );

      const totalPaid = payments
        .filter(p => !p.isRefund)       
        .reduce((sum, p) => sum + p.amount, 0); 

      const totalRefunded = payments
        .filter(p => p.isRefund) 
        .reduce((sum, p) => sum + p.amount, 0);

      return res.status(200).json({
        error: false,
        data: {
          ...booking.toJSON(),
          payments: currentPayments,
          transferredPayments,
          transferHistory,
          financialSummary: {
            bookingPrice:   booking.bookingPrice,
            totalPaid,
            totalRefunded,
            outstandingDues: booking.bookingPrice - totalPaid + totalRefunded
          }
        }
      });

    } catch (error) {
      return this.handleError(next, error.message, 500);
    }
  }
  async cancel(req, res, next) {
    try {
      if (!this.isValidId(req.params.id)) {
        return this.handleError(next, 'Booking ID is wrong', 400);
      }
      const booking = await Booking.findOne({ _id: req.params.id, deletedAt: null })
        .populate('flat')
        .populate('client', 'name');

      if (!booking) return this.handleError(next, 'Booking not found', 404);

      if (booking.status !== 'active') {
        return this.handleError(next, `${booking.status} booking cant be cancel`, 400);
      }

      const payments  = await Payment.find({
        booking:  booking._id,
        isRefund: false,
        deletedAt: null
      });
      const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
      booking.status             = 'cancelled';
      booking.cancelledAt        = new Date();
      booking.cancelledBy        = req.user._id;
      booking.cancellationReason = req.body.reason || '';
      await booking.save();

      const flat    = await Flat.findById(booking.flat._id);
      flat.status   = 'available';
      await flat.save();
      if (totalPaid > 0) {
        await Payment.create({
          booking:     booking._id,
          flat:        booking.flat._id,
          client:      booking.client._id,
          project:     booking.project,
          amount:      totalPaid,
          paymentMode: 'cash',
          paymentDate: new Date(),
          description: `Refund for cancelled booking ${booking.bookingNumber}`,
          isRefund:    true,
          createdBy:   req.user._id,
        });
      }

      await createAuditLog({
        performedBy:   req.user._id,
        performerRole: req.user.role,
        action:        'booking_cancel',
        category:      'booking',
        targetModel:   'Booking',
        targetId:      booking._id,
        description:   `Booking ${booking.bookingNumber} cancel client's refund "${booking.client.name}" . Refund: ${totalPaid}`,
        reason:        req.body.reason,
        req,
        severity:      'warning',
      });

      return res.status(200).json({
        error: false,
        message: 'Booking cancelation done!',
        data: { booking, refundAmount: totalPaid }
      });

    } catch (error) {
      return this.handleError(next, error.message, 500);
    }
  }
  async transfer(req, res, next) {
    try {

      if (!this.isValidId(req.params.id)) {
        return this.handleError(next, 'Booking ID is wrong', 400);
      }

      const validation = this.validateRequiredFields(req.body, ['newClient']);
      if (validation) return res.status(400).json(validation);

      if (!this.isValidId(req.body.newClient)) {
        return this.handleError(next, 'New client ID is wrong', 400);
      }

      const oldBooking = await Booking.findOne({ _id: req.params.id, deletedAt: null })
        .populate('flat')
        .populate('client', 'name');

      if (!oldBooking) return this.handleError(next, 'Booking not found', 404);

      if (oldBooking.status !== 'active') {
        return this.handleError(next, `${oldBooking.status} booking cant transfer`, 400);
      }

      const newClient = await Client.findOne({ _id: req.body.newClient, deletedAt: null });
      if (!newClient) return this.handleError(next, 'no new client found', 404);

      const newBooking = await Booking.create({
        flat:            oldBooking.flat._id,
        client:          newClient._id,
        project:         oldBooking.project,
        bookingDate:     new Date(),
        bookingPrice:    req.body.bookingPrice || oldBooking.bookingPrice,
        paymentPlan:     req.body.paymentPlan  || oldBooking.paymentPlan,
        transferredFrom: oldBooking._id, 
        createdBy:       req.user._id,
      });

      oldBooking.status       = 'transferred';
      oldBooking.transferredTo = newBooking._id; 
      await oldBooking.save();

      // STEP 9: Audit log
      await createAuditLog({
        performedBy:   req.user._id,
        performerRole: req.user.role,
        action:        'booking_transfer',
        category:      'booking',
        targetModel:   'Booking',
        targetId:      oldBooking._id,
        description:   `Booking ${oldBooking.bookingNumber} "${oldBooking.client.name}" to "${newClient.name}" transferrd. New booking: ${newBooking.bookingNumber}`,
        previousState: { client: oldBooking.client._id, bookingNumber: oldBooking.bookingNumber },
        newState:      { client: newClient._id,          bookingNumber: newBooking.bookingNumber },
        req,
        severity:      'warning',
      });

   
      return res.status(200).json({
        error: false,
        message: 'Booking transfer successfully',
        data: { oldBooking, newBooking }
      });

    } catch (error) {
      return this.handleError(next, error.message, 500);
    }
  }

}

export default new bookingController();