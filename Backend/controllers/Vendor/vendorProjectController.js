import getVendorProjectModel from "../../models/VendorProject.js";
import BaseController from "../BaseController.js";
import { createAuditLog } from "../../utils/auditLog.js";

class VendorProjectController extends BaseController {
  // 1. Naya Vendor Project banana (Create)
  create = async (req, res, next) => {
    try {
      const VendorProject = getVendorProjectModel();

      // Check karo: Kya project ka naam likha hai?
      const { name } = req.body;
      if (!name)
        return res.status(400).json({ message: "Project ka naam lazmi hai!" });

      // Check karo: Kahin is naam ka project pehle se toh nahi bana hua?
      const existing = await VendorProject.findOne({ name, deletedAt: null });
      if (existing)
        return res
          .status(400)
          .json({ message: "Is naam ka project pehle se majood hai!" });

      // Database mein save karo
      const project = await VendorProject.create({
        ...req.body,
        createdBy: req.user._id,
      });

      // Audit Log: Diary mein entry ke naya project ban gaya
      await createAuditLog({
        action: "vendor_project_create",
        description: `Naya vendor project "${name}" banaya`,
        req,
      });

      return res
        .status(201)
        .json({
          error: false,
          message: "Vendor project ban gaya!",
          data: project,
        });
    } catch (error) {
      return this.handleError(next, error.message, 500);
    }
  };

  // 2. Sab Projects ki list dekhna (Get All)
  getAll = async (req, res, next) => {
    try {
      const VendorProject = getVendorProjectModel();
      const { page = 1, limit = 10, search, status } = req.query;

      let query = { deletedAt: null }; // Sirf wo dikhao jo delete nahi hue

      if (status) query.status = status;
      if (search) query.name = { $regex: search, $options: "i" }; // Search feature

      const projects = await VendorProject.find(query)
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const total = await VendorProject.countDocuments(query);

      return res.status(200).json({ data: projects, total });
    } catch (error) {
      return this.handleError(next, error.message, 500);
    }
  };

  // 3. Ek Project ki detail dekhna (Get By ID)
  getById = async (req, res, next) => {
    try {
      const VendorProject = getVendorProjectModel();
      const project = await VendorProject.findOne({
        _id: req.params.id,
        deletedAt: null,
      });

      if (!project)
        return res.status(404).json({ message: "Project nahi mila" });

      return res.status(200).json({ data: project });
    } catch (error) {
      return this.handleError(next, error.message, 500);
    }
  };

  // 4. Project ki info update karna (Update)
  update = async (req, res, next) => {
    try {
      const VendorProject = getVendorProjectModel();
      const project = await VendorProject.findOne({
        _id: req.params.id,
        deletedAt: null,
      });
      if (!project)
        return res.status(404).json({ message: "Project nahi mila" });

      const { name } = req.body;

      // Agar naam badal rahe hain toh check karo naya naam duplicate toh nahi?
      if (name && name !== project.name) {
        const existing = await VendorProject.findOne({
          name,
          deletedAt: null,
          _id: { $ne: project._id },
        });
        if (existing)
          return res
            .status(400)
            .json({ message: "Ye naam pehle se use mein hai!" });
      }

      // Naya data save karo
      Object.assign(project, req.body);
      await project.save();

      await createAuditLog({
        action: "vendor_project_update",
        description: `Project "${project.name}" update kiya gaya`,
        req,
      });

      return res
        .status(200)
        .json({ message: "Project update ho gaya!", data: project });
    } catch (error) {
      return this.handleError(next, error.message, 500);
    }
  };

  // 5. Project delete karna (Soft Delete)
  delete = async (req, res, next) => {
    try {
      const VendorProject = getVendorProjectModel();
      // Asal mein udao mat, bas deletedAt mein time daal do
      await VendorProject.updateOne(
        { _id: req.params.id },
        { deletedAt: new Date() },
      );

      return res.status(200).json({ message: "Project delete ho gaya" });
    } catch (error) {
      return this.handleError(next, error.message, 500);
    }
  };

  // 6. Restore karna
  restore = async (req, res, next) => {
    try {
      const VendorProject = getVendorProjectModel();
      await VendorProject.updateOne(
        { _id: req.params.id },
        { deletedAt: null },
      );
      return res.status(200).json({ message: "Project wapas aa gaya!" });
    } catch (error) {
      return this.handleError(next, error.message, 500);
    }
  };
}

export default new VendorProjectController();
