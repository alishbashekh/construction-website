import Flat from "../../models/Flat.js";
import Project from "../../models/Project.js";
import Booking from "../../models/Booking.js";
import Payment from "../../models/Payment.js";
import BaseController from "../BaseController.js";
import { createAuditLog } from "../../utils/auditLog.js";

class FlatController extends BaseController {
  // 1. Naya Flat banana (Create)
  create = async (req, res, next) => {
    try {
      // Pehle check karo user ne saari zaroori cheezein (Flat No, Floor etc) likhi hain?
      const { project, flatNumber, floor, size, type } = req.body;
      if (!project || !flatNumber || !floor)
        return res.status(400).json({ message: "Fields miss hain!" });

      // Check karo ke ye Project database mein majood hai bhi ya nahi?
      const projectExists = await Project.findOne({
        _id: project,
        deletedAt: null,
      });
      if (!projectExists)
        return res.status(404).json({ message: "Project nahi mila!" });

      // Ab database mein naya flat save kar lo
      const flat = await Flat.create({ ...req.body, createdBy: req.user._id });

      // Register mein entry kar do ke naya flat ban gaya hai
      await createAuditLog({
        action: "flat_create",
        description: `Naya Flat ${flatNumber} banaya gaya`,
        req,
      });

      return res.status(201).json({ error: false, data: flat });
    } catch (error) {
      return this.handleError(next, error.message, 500);
    }
  };

  // 2. Saare Flats ki list dekhna (Get All)
  getAll = async (req, res, next) => {
    try {
      const { page = 1, limit = 10, search } = req.query;
      let filter = { deletedAt: null }; // Sirf wo dikhao jo delete nahi hue

      // Agar user ne koi specific Flat No search kiya hai
      if (search) filter.flatNumber = { $regex: search, $options: "i" };

      const flats = await Flat.find(filter)
        .populate("project", "name") // Project ka naam bhi saath le aao
        .limit(limit * 1)
        .skip((page - 1) * limit);

      return res.status(200).json({ data: flats });
    } catch (error) {
      return this.handleError(next, error.message, 500);
    }
  };

  // 3. Ek Flat ki poori detail aur paison ka hisab (Get By ID - Most Important)
  getById = async (req, res, next) => {
    try {
      // 1. Flat dhoondo
      const flat = await Flat.findOne({
        _id: req.params.id,
        deletedAt: null,
      }).populate("project", "name");
      if (!flat) return res.status(404).json({ message: "Flat nahi mila" });

      // 2. Is flat ki jitni Bookings aur Payments hui hain, wo uthao
      const bookings = await Booking.find({ flat: flat._id, deletedAt: null });
      const payments = await Payment.find({ flat: flat._id, deletedAt: null });

      // 3. Paison ka hisab kitab (Maths)
      let totalPaid = 0;
      let totalRefunded = 0;

      payments.forEach((p) => {
        if (p.isRefund)
          totalRefunded += p.amount; // Kitne wapas kiye
        else totalPaid += p.amount; // Kitne mile
      });

      // Final summary taiyar karo
      const summary = {
        totalPaid,
        totalRefunded,
        balance: totalPaid - totalRefunded,
      };

      return res
        .status(200)
        .json({ data: { ...flat.toJSON(), bookings, summary } });
    } catch (error) {
      return this.handleError(next, error.message, 500);
    }
  };

  // 4. Flat ki info update karna
  update = async (req, res, next) => {
    try {
      const flat = await Flat.findOneAndUpdate(
        { _id: req.params.id, deletedAt: null },
        { $set: req.body },
        { new: true }, // Taake update hone ke baad naya wala data dikhaye
      );
      return res.status(200).json({ message: "Update ho gaya!", data: flat });
    } catch (error) {
      return this.handleError(next, error.message, 500);
    }
  };

  // 5. Flat delete karna (Soft Delete)
  delete = async (req, res, next) => {
    try {
      const flat = await Flat.findOne({ _id: req.params.id, deletedAt: null });

      // Check: Agar flat booked hai toh delete nahi karne dena
      if (flat.status === "booked")
        return res
          .status(400)
          .json({ message: "Booked flat delete nahi ho sakta!" });

      flat.deletedAt = new Date(); // Bas delete ki stamp laga di
      await flat.save();

      return res.status(200).json({ message: "Flat delete ho gaya" });
    } catch (error) {
      return this.handleError(next, error.message, 500);
    }
  };

  // 6. Flat ka Status badalna (Available, Booked, Sold)
  changeStatus = async (req, res, next) => {
    try {
      const flat = await Flat.findById(req.params.id);
      flat.status = req.body.status; // Naya status set karo
      await flat.save();

      return res
        .status(200)
        .json({ message: "Status tabdeel ho gaya", data: flat });
    } catch (error) {
      return this.handleError(next, error.message, 500);
    }
  };
}

export default new FlatController();
