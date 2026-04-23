import VendorPayment from "../../models/VendorPayment.js";
import Vendor from "../../models/Vendor.js";
import VendorProject from "../../models/VendorProject.js";
import BaseController from "../BaseController.js";
import { createAuditLog } from "../../utils/auditLog.js";

class VendorPaymentController extends BaseController {
  // 1. Create new contract
  create = async (req, res, next) => {
    try {
      const { project, vendor, totalAmount, initialAmount, initialPaymentMode } = req.body;

      if (!project || !vendor || !totalAmount)
        return res.status(400).json({ message: "Project, vendor and totalAmount are required!" });

      const count = await VendorPayment.countDocuments();
      const receiptNumber = `VREC-${String(count + 1).padStart(5, "0")}`;

      let payments  = [];
      let totalPaid = 0;

      if (initialAmount > 0) {
        if (!initialPaymentMode)
          return res.status(400).json({ message: "Payment mode is required!" });

        payments.push({
          amount:      initialAmount,
          paymentMode: initialPaymentMode,
          date:        req.body.date || new Date(),
        });
        totalPaid = initialAmount;
      }

      let status = "pending";
      if (totalPaid === totalAmount)  status = "paid";
      else if (totalPaid > 0)         status = "partially_paid";

      const payment = await VendorPayment.create({
        ...req.body,
        receiptNumber,
        totalPaid,
        payments,
        status,
        createdBy: req.user.id, // ✅ fixed
      });

      await createAuditLog({
        performedBy:   req.user.id,          // ✅ fixed
        performerRole: req.user.accountType, // ✅ fixed
        action:        "vendor_payment_create",
        category:      "vendor",
        targetModel:   "VendorPayment",
        targetId:      payment._id,
        description:   `Vendor contract created: ${receiptNumber}`,
        req,
      });

      return res.status(201).json({ error: false, data: payment });
    } catch (error) {
      return this.handleError(next, error.message, 500);
    }
  };

  // 2. Add installment to existing contract
  addPayment = async (req, res, next) => {
    try {
      const { amount, paymentMode } = req.body;

      const contract = await VendorPayment.findOne({
        _id:       req.params.id,
        deletedAt: null,
      });
      if (!contract)
        return res.status(404).json({ message: "Contract not found!" });

      const remaining = contract.totalAmount - contract.totalPaid;
      if (amount > remaining)
        return res.status(400).json({ message: "Amount exceeds remaining balance!" });

      contract.payments.push({ amount, paymentMode, date: new Date() });
      contract.totalPaid += amount;

      if (contract.totalPaid === contract.totalAmount) contract.status = "paid";
      else contract.status = "partially_paid";

      await contract.save();

      await createAuditLog({
        performedBy:   req.user.id,          // ✅ fixed
        performerRole: req.user.accountType, // ✅ fixed
        action:        "vendor_payment_add",
        category:      "vendor",
        targetModel:   "VendorPayment",
        targetId:      contract._id,
        description:   `Installment added: ${amount}`,
        req,
      });

      return res.status(201).json({ message: "Payment added!", data: contract });
    } catch (error) {
      return this.handleError(next, error.message, 500);
    }
  };

  // 3. Get all contracts
  getAll = async (req, res, next) => {
    try {
      const { page = 1, limit = 10, search } = req.query;

      const query = { deletedAt: null };
      if (search) query.receiptNumber = { $regex: search, $options: "i" };

      const data = await VendorPayment.find(query)
        .populate("vendor",  "name category")
        .populate("project", "name")
        .limit(limit * 1)
        .skip((page - 1) * limit);

      return res.status(200).json({ data });
    } catch (error) {
      return this.handleError(next, error.message, 500);
    }
  };

  // 4. Get single contract with outstanding balance
  getById = async (req, res, next) => {
    try {
      const payment = await VendorPayment.findOne({
        _id:       req.params.id,
        deletedAt: null,
      }).populate("vendor project");

      if (!payment) return res.status(404).json({ message: "Contract not found" });

      const outstanding = payment.totalAmount - payment.totalPaid;
      return res.status(200).json({ data: { ...payment.toJSON(), outstanding } });
    } catch (error) {
      return this.handleError(next, error.message, 500);
    }
  };

  // 5. Soft delete contract
  delete = async (req, res, next) => {
    try {
      await VendorPayment.updateOne({ _id: req.params.id }, { deletedAt: new Date() });
      return res.status(200).json({ message: "Contract deleted" });
    } catch (error) {
      return this.handleError(next, error.message, 500);
    }
  };
}

export default new VendorPaymentController();