import Vendor from "../../models/Vendor.js";
import VendorPayment from "../../models/VendorPayment.js";
import BaseController from "../BaseController.js";
import { createAuditLog } from "../../utils/auditLog.js";

class VendorController extends BaseController {
  // 1. Create new vendor
  create = async (req, res, next) => {
    try {
      const { name, category, phone } = req.body;

      if (!name || !category || !phone)
        return res.status(400).json({ message: "Name, category and phone are required!" });

      const existing = await Vendor.findOne({
        deletedAt: null,
        $or: [{ name }, { phone }],
      });
      if (existing)
        return res.status(400).json({ message: "Vendor with this name or phone already exists!" });

      const vendor = await Vendor.create({
        ...req.body,
        createdBy: req.user.id, // ✅ fixed
      });

      await createAuditLog({
        performedBy:   req.user.id,          // ✅ fixed
        performerRole: req.user.accountType, // ✅ fixed
        action:        "vendor_create",
        category:      "vendor",
        targetModel:   "Vendor",
        targetId:      vendor._id,
        description:   `Vendor ${name} created`,
        req,
      });

      return res.status(201).json({ error: false, message: "Vendor created!", data: vendor });
    } catch (error) {
      return this.handleError(next, error.message, 500);
    }
  };

  // 2. Get all vendors
  getAll = async (req, res, next) => {
    try {
      const { page = 1, limit = 10, search } = req.query;
      let query = { deletedAt: null };

      if (search) {
        query.$or = [
          { name:  { $regex: search, $options: "i" } },
          { phone: { $regex: search, $options: "i" } },
        ];
      }

      const vendors = await Vendor.find(query)
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const total = await Vendor.countDocuments(query);

      return res.status(200).json({ data: vendors, total });
    } catch (error) {
      return this.handleError(next, error.message, 500);
    }
  };

  // 3. Get single vendor with payments
  getById = async (req, res, next) => {
    try {
      const vendor = await Vendor.findOne({ _id: req.params.id, deletedAt: null });
      if (!vendor) return res.status(404).json({ message: "Vendor not found" });

      const payments = await VendorPayment.find({
        vendor: vendor._id,
        deletedAt: null,
      }).populate("project", "name");

      const totalPaid       = payments.reduce((sum, p) => sum + p.amount, 0);
      const totalAdjustment = payments.reduce((sum, p) => sum + (p.adjustment || 0), 0);

      return res.status(200).json({
        data: {
          ...vendor.toJSON(),
          payments,
          summary: {
            totalPaid,
            totalAdjustment,
            netPaid: totalPaid - totalAdjustment,
          },
        },
      });
    } catch (error) {
      return this.handleError(next, error.message, 500);
    }
  };

  // 4. Update vendor
  update = async (req, res, next) => {
    try {
      const vendor = await Vendor.findOne({ _id: req.params.id, deletedAt: null });
      if (!vendor) return res.status(404).json({ message: "Vendor not found" });

      const { name, phone } = req.body;
      if (name || phone) {
        const duplicate = await Vendor.findOne({
          _id:       { $ne: vendor._id },
          deletedAt: null,
          $or: [{ name }, { phone }],
        });
        if (duplicate)
          return res.status(400).json({ message: "Name or phone already in use!" });
      }

      Object.assign(vendor, req.body);
      await vendor.save();

      await createAuditLog({
        performedBy:   req.user.id,          // ✅ fixed
        performerRole: req.user.accountType, // ✅ fixed
        action:        "vendor_update",
        category:      "vendor",
        targetModel:   "Vendor",
        targetId:      vendor._id,
        description:   `Vendor ${vendor.name} updated`,
        req,
      });

      return res.status(200).json({ message: "Vendor updated!", data: vendor });
    } catch (error) {
      return this.handleError(next, error.message, 500);
    }
  };

  // 5. Soft delete vendor
  delete = async (req, res, next) => {
    try {
      await Vendor.updateOne({ _id: req.params.id }, { deletedAt: new Date() });
      return res.status(200).json({ message: "Vendor deleted" });
    } catch (error) {
      return this.handleError(next, error.message, 500);
    }
  };

  // 6. Restore deleted vendor
  restore = async (req, res, next) => {
    try {
      await Vendor.updateOne({ _id: req.params.id }, { deletedAt: null });
      return res.status(200).json({ message: "Vendor restored!" });
    } catch (error) {
      return this.handleError(next, error.message, 500);
    }
  };
}

export default new VendorController();