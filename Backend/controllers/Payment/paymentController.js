import Payment from "../../models/Payment.js";
import Booking from "../../models/Booking.js";
import BaseController from "../BaseController.js";
import { createAuditLog } from "../../utils/auditLog.js";

class PaymentController extends BaseController {
  // 1. Payment Receive Karna (Create)
  create = async (req, res, next) => {
    try {
      const { flat, client, project, amount, type } = req.body;

      if (!flat || !client || !amount)
        return res.status(400).json({ message: "Puri details likhen!" });

      const booking = await Booking.findOne({
        flat,
        client,
        project,
        deletedAt: null,
      }).populate("flat");

      if (!booking)
        return res.status(404).json({ message: "Booking nahi mili!" });

      if (booking.status !== "active") {
        return res.status(400).json({
          message: `Ye booking ${booking.status} hai, payment nahi ho sakti.`,
        });
      }

      // Pehle ki payments dekho
      const oldPayments = await Payment.find({
        booking: booking._id,
        deletedAt: null,
        isRefund: false,
        type: "regular",
      });
      const alreadyPaid = oldPayments.reduce((sum, p) => sum + p.amount, 0);
      const outstanding = booking.bookingPrice - alreadyPaid;

      if (!req.body.isRefund && type === "regular" && amount > outstanding) {
        return res
          .status(400)
          .json({ message: "Paisa outstanding amount se zyada hai!" });
      }

      // Payment banao — createdBy hata diya (schema mein nahi tha)
      const payment = new Payment({
        ...req.body,
        booking: booking._id,
      });
      await payment.save(); // pre-save hook chalega receiptNumber ke liye

      // Agar payment complete ho gayi
      if (
        !payment.isRefund &&
        type === "regular" &&
        alreadyPaid + amount >= booking.bookingPrice
      ) {
        booking.status = "completed";
        await booking.save();

        if (booking.flat) {
          booking.flat.status = "sold";
          await booking.flat.save();
        }
      }

      // Audit log — non-blocking
      createAuditLog({
        action: "payment_create",
        description: `Rs.${amount} ki payment receive hui`,
        req,
      }).catch(() => {}); // silently ignore audit log failures

      return res.status(201).json({ error: false, data: payment });
    } catch (error) {
      // Directly call next — don't use this.handleError to avoid context issues
      next(error);
    }
  };

  // 2. Sab Payments ki list (Get All)
  getAll = async (req, res, next) => {
    try {
      const { page = 1, limit = 10, search } = req.query;
      const query = { deletedAt: null };

      if (search) query.receiptNumber = { $regex: search, $options: "i" };

      const payments = await Payment.find(query)
        .populate("client", "name")
        .populate("flat", "flatNumber")
        .sort({ paymentDate: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      return res.status(200).json({ data: payments });
    } catch (error) {
      next(error);
    }
  };

  // 3. Aik Payment ki detail (Get By ID)
  getById = async (req, res, next) => {
    try {
      const payment = await Payment.findOne({
        _id: req.params.id,
        deletedAt: null,
      }).populate("booking client flat project");

      if (!payment)
        return res.status(404).json({ message: "Payment record nahi mila" });

      return res.status(200).json({ data: payment });
    } catch (error) {
      next(error);
    }
  };

  // 4. Payment update karna
  update = async (req, res, next) => {
    try {
      const payment = await Payment.findOneAndUpdate(
        { _id: req.params.id, deletedAt: null },
        { $set: req.body },
        { new: true },
      );
      return res
        .status(200)
        .json({ message: "Payment update ho gayi", data: payment });
    } catch (error) {
      next(error);
    }
  };

  // 5. Payment delete karna (Soft Delete)
  delete = async (req, res, next) => {
    try {
      await Payment.updateOne(
        { _id: req.params.id },
        { deletedAt: new Date() },
      );
      return res.status(200).json({ message: "Payment delete kar di gayi" });
    } catch (error) {
      next(error);
    }
  };
}

export default new PaymentController();