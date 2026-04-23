import Booking from '../../models/Booking.js';
import Flat from '../../models/Flat.js';
import Payment from '../../models/Payment.js';
import Project from '../../models/Project.js';
import Client from '../../models/Client.js';
import getVendorModel from '../../models/Vendor.js';
import getVendorPaymentModel from '../../models/VendorPayment.js';
import getVendorProjectModel from '../../models/VendorProject.js';
import BaseController from '../BaseController.js';

class ReportController extends BaseController {

  // 1. SALES SUMMARY: Kitne flat bike aur kitna paisa aaya?
  projectSalesSummary = async (req, res, next) => {
    try {
      const { projectId, startDate, endDate } = req.query;
      let query = { deletedAt: null, status: { $in: ['active', 'completed'] } };

      // Agar specific project ya date search karni ho
      if (projectId) query.project = projectId;

      const bookings = await Booking.find(query).populate('flat client project');

      // Har booking ka hisab kitab (Maths) shuru
      const summary = await Promise.all(bookings.map(async (b) => {
        const allPayments = await Payment.find({ booking: b._id, deletedAt: null });
        
        const paid = allPayments.filter(p => !p.isRefund).reduce((s, p) => s + p.amount, 0);
        const refunded = allPayments.filter(p => p.isRefund).reduce((s, p) => s + p.amount, 0);

        return {
          customer: b.client?.name,
          unit: b.flat?.flatNumber,
          price: b.bookingPrice,
          received: paid,
          wapas: refunded,
          balance: b.bookingPrice - paid + refunded // Kitne paise rehte hain
        };
      }));

      return res.status(200).json({ data: summary });
    } catch (error) {
      return this.handleError(next, error.message, 500);
    }
  };

  // 2. AVAILABILITY: Kitne khali hain aur kitne bik gaye?
  flatAvailability = async (req, res, next) => {
    try {
      const { projectId } = req.query;
      let filter = { deletedAt: null };
      if (projectId) filter.project = projectId;

      // Grouping karna: Status wise count (Available, Booked, Sold)
      const stats = await Flat.aggregate([
        { $match: filter },
        { $group: { _id: '$status', total: { $sum: 1 } } }
      ]);

      const allFlats = await Flat.find(filter).populate('project', 'name');

      return res.status(200).json({ data: { stats, allFlats } });
    } catch (error) {
      return this.handleError(next, error.message, 500);
    }
  };

  // 3. CLIENT DUES: Kis kis bande ne udhaar dena hai?
  clientDues = async (req, res, next) => {
    try {
      // Sirf active bookings uthao jin ke paise baqi hon
      const bookings = await Booking.find({ status: 'active', deletedAt: null }).populate('client flat');

      const duesList = await Promise.all(bookings.map(async (b) => {
        const payments = await Payment.find({ booking: b._id, deletedAt: null });
        const paid = payments.filter(p => !p.isRefund).reduce((s, p) => s + p.amount, 0);
        
        return {
          client: b.client?.name,
          phone: b.client?.phone,
          flat: b.flat?.flatNumber,
          dueAmount: b.bookingPrice - paid
        };
      }));

      return res.status(200).json({ data: duesList });
    } catch (error) {
      return this.handleError(next, error.message, 500);
    }
  };

  // 4. VENDOR LEDGER: Contractor ko kitne paise diye?
  vendorLedger = async (req, res, next) => {
    try {
      const Vendor = getVendorModel();
      const VendorPayment = getVendorPaymentModel();

      const vendors = await Vendor.find({ deletedAt: null });

      const report = await Promise.all(vendors.map(async (v) => {
        const payments = await VendorPayment.find({ vendor: v._id, deletedAt: null });
        
        const totalContract = payments.reduce((s, p) => s + (p.totalAmount || 0), 0);
        const totalPaid = payments.reduce((s, p) => s + (p.totalPaid || 0), 0);

        return {
          vendorName: v.name,
          category: v.category, // e.g., Electrician, Painter
          totalDeal: totalContract,
          paidToVendor: totalPaid,
          remaining: totalContract - totalPaid
        };
      }));

      return res.status(200).json({ data: report });
    } catch (error) {
      return this.handleError(next, error.message, 500);
    }
  };
  // 5. PAYMENT COLLECTION REPORT
  paymentCollection = async (req, res, next) => {
  try {
    const { project, mode, fromDate, toDate } = req.query;

    let filter = { deletedAt: null };

    // Filter by payment mode
    if (mode) filter.mode = mode;

    // Date filtering
    if (fromDate || toDate) {
      filter.createdAt = {};
      if (fromDate) filter.createdAt.$gte = new Date(fromDate);
      if (toDate) filter.createdAt.$lte = new Date(toDate);
    }

    // Get payments + populate booking -> client + flat + project
    const payments = await Payment.find(filter)
      .populate({
        path: "booking",
        populate: [
          { path: "client", select: "name cnic" },
          { path: "flat", select: "flatNumber" },
          { path: "project", select: "name" },
        ],
      });

    // Optional project filter (after populate)
    let filtered = payments;
    if (project) {
      filtered = payments.filter(
        (p) => p.booking?.project?.name === project
      );
    }

    // Format response SAME as frontend expects
    const data = filtered.map((p) => ({
      receipt: p.receiptNo || p._id,
      client: p.booking?.client?.name,
      cnic: p.booking?.client?.cnic,
      project: p.booking?.project?.name,
      unit: p.booking?.flat?.flatNumber,
      date: new Date(p.createdAt).toLocaleDateString("en-GB"),
      mode: p.mode,
      amount: p.amount,
    }));

    return res.status(200).json({ data });

  } catch (error) {
    return this.handleError(next, error.message, 500);
  }
  };
}

export default new ReportController();