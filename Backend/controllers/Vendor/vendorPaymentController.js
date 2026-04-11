import getVendorPaymentModel from "../../models/VendorPayment.js";
import getVendorModel from "../../models/Vendor.js";
import getVendorProjectModel from "../../models/VendorProject.js";
import BaseController from "../BaseController.js";
import { createAuditLog } from "../../utils/auditLog.js";

class VendorPaymentController extends BaseController {
  // 1. Naya Contract banana (Create)
  create = async (req, res, next) => {
    try {
      const VendorPayment = getVendorPaymentModel();
      const {
        project,
        vendor,
        totalAmount,
        initialAmount,
        initialPaymentMode,
      } = req.body;

      // Basic Check: Kya paise aur vendor ka bataya hai?
      if (!project || !vendor || !totalAmount)
        return res.status(400).json({ message: "Fields miss hain!" });

      // Receipt Number banao (e.g., VREC-00001)
      const count = await VendorPayment.countDocuments();
      const receiptNumber = `VREC-${String(count + 1).padStart(5, "0")}`;

      let payments = [];
      let totalPaid = 0;

      // Agar shuru mein kuch paise (Advance) diye hain toh list mein dalo
      if (initialAmount > 0) {
        if (!initialPaymentMode)
          return res.status(400).json({ message: "Payment mode batayein!" });

        payments.push({
          amount: initialAmount,
          paymentMode: initialPaymentMode,
          date: req.body.date || new Date(),
        });
        totalPaid = initialAmount;
      }

      // Status set karo: Paid, Partially Paid ya Pending?
      let status = "pending";
      if (totalPaid === totalAmount) status = "paid";
      else if (totalPaid > 0) status = "partially_paid";

      // Database mein save karo
      const payment = await VendorPayment.create({
        ...req.body,
        receiptNumber,
        totalPaid,
        payments,
        status,
        createdBy: req.user._id,
      });

      await createAuditLog({
        action: "vendor_payment_create",
        description: `Vendor contract banaya gaya: ${receiptNumber}`,
        req,
      });

      return res.status(201).json({ error: false, data: payment });
    } catch (error) {
      return this.handleError(next, error.message, 500);
    }
  };

  // 2. Kisi Purane Contract mein mazeed paise (Installment) add karna
  addPayment = async (req, res, next) => {
    try {
      const VendorPayment = getVendorPaymentModel();
      const { amount, paymentMode } = req.body;

      // Contract dhoondo
      const contract = await VendorPayment.findOne({
        _id: req.params.id,
        deletedAt: null,
      });
      if (!contract)
        return res.status(404).json({ message: "Contract nahi mila!" });

      // Check: Kahin total amount se zyada paise toh nahi de rahe?
      const remaining = contract.totalAmount - contract.totalPaid;
      if (amount > remaining)
        return res
          .status(400)
          .json({ message: "Paise baqi amount se zyada hain!" });

      // Nayi payment list mein dalo
      contract.payments.push({ amount, paymentMode, date: new Date() });
      contract.totalPaid += amount;

      // Status update karo
      if (contract.totalPaid === contract.totalAmount) contract.status = "paid";
      else contract.status = "partially_paid";

      await contract.save();

      await createAuditLog({
        action: "vendor_payment_add",
        description: `Installment add ki gayi: ${amount}`,
        req,
      });

      return res
        .status(201)
        .json({ message: "Payment add ho gayi!", data: contract });
    } catch (error) {
      return this.handleError(next, error.message, 500);
    }
  };

  // 3. Sab Contracts ki list dekhna
  getAll = async (req, res, next) => {
    try {
      const VendorPayment = getVendorPaymentModel();
      const { page = 1, limit = 10, search } = req.query;

      const query = { deletedAt: null };
      if (search) query.receiptNumber = { $regex: search, $options: "i" };

      const data = await VendorPayment.find(query)
        .populate("vendor", "name category")
        .populate("project", "name")
        .limit(limit * 1)
        .skip((page - 1) * limit);

      return res.status(200).json({ data });
    } catch (error) {
      return this.handleError(next, error.message, 500);
    }
  };

  // 4. Contract ki detail aur baqi paise (Outstanding) dekhna
  getById = async (req, res, next) => {
    try {
      const VendorPayment = getVendorPaymentModel();
      const payment = await VendorPayment.findOne({
        _id: req.params.id,
        deletedAt: null,
      }).populate("vendor project");

      if (!payment) return res.status(404).json({ message: "Nahi mila" });

      const outstanding = payment.totalAmount - payment.totalPaid;
      return res
        .status(200)
        .json({ data: { ...payment.toJSON(), outstanding } });
    } catch (error) {
      return this.handleError(next, error.message, 500);
    }
  };

  // 5. Delete (Soft Delete)
  delete = async (req, res, next) => {
    try {
      const VendorPayment = getVendorPaymentModel();
      await VendorPayment.updateOne(
        { _id: req.params.id },
        { deletedAt: new Date() },
      );
      return res.status(200).json({ message: "Delete ho gaya" });
    } catch (error) {
      return this.handleError(next, error.message, 500);
    }
  };
}

export default new VendorPaymentController();
