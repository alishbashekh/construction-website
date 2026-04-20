import VendorProject from "../../models/VendorProject.js";
import BaseController from "../BaseController.js";
import { createAuditLog } from "../../utils/auditLog.js";

class VendorProjectController extends BaseController {
  // 1. Create new vendor project
  create = async (req, res, next) => {
    try {
      const { name } = req.body;

      if (!name)
        return res.status(400).json({ message: "Project name is required!" });

      const existing = await VendorProject.findOne({ name, deletedAt: null });
      if (existing)
        return res.status(400).json({ message: "Project with this name already exists!" });

      const project = await VendorProject.create({
        ...req.body,
        createdBy: req.user.id, // ✅ fixed
      });

      await createAuditLog({
        performedBy:   req.user.id,          // ✅ fixed
        performerRole: req.user.accountType, // ✅ fixed
        action:        "vendor_project_create",
        category:      "vendor",
        targetModel:   "VendorProject",
        targetId:      project._id,
        description:   `Vendor project "${name}" created`,
        req,
      });

      return res.status(201).json({ error: false, message: "Vendor project created!", data: project });
    } catch (error) {
      return this.handleError(next, error.message, 500);
    }
  };

  // 2. Get all projects
  getAll = async (req, res, next) => {
    try {
      const { page = 1, limit = 10, search, status } = req.query;

      let query = { deletedAt: null };
      if (status) query.status = status;
      if (search) query.name   = { $regex: search, $options: "i" };

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

  // 3. Get single project
  getById = async (req, res, next) => {
    try {
      const project = await VendorProject.findOne({
        _id:       req.params.id,
        deletedAt: null,
      });

      if (!project)
        return res.status(404).json({ message: "Project not found" });

      return res.status(200).json({ data: project });
    } catch (error) {
      return this.handleError(next, error.message, 500);
    }
  };

  // 4. Update project
  update = async (req, res, next) => {
    try {
      const project = await VendorProject.findOne({
        _id:       req.params.id,
        deletedAt: null,
      });
      if (!project)
        return res.status(404).json({ message: "Project not found" });

      const { name } = req.body;
      if (name && name !== project.name) {
        const existing = await VendorProject.findOne({
          name,
          deletedAt: null,
          _id: { $ne: project._id },
        });
        if (existing)
          return res.status(400).json({ message: "Project name already in use!" });
      }

      Object.assign(project, req.body);
      await project.save();

      await createAuditLog({
        performedBy:   req.user.id,          // ✅ fixed
        performerRole: req.user.accountType, // ✅ fixed
        action:        "vendor_project_update",
        category:      "vendor",
        targetModel:   "VendorProject",
        targetId:      project._id,
        description:   `Project "${project.name}" updated`,
        req,
      });

      return res.status(200).json({ message: "Project updated!", data: project });
    } catch (error) {
      return this.handleError(next, error.message, 500);
    }
  };

  // 5. Soft delete project
  delete = async (req, res, next) => {
    try {
      await VendorProject.updateOne({ _id: req.params.id }, { deletedAt: new Date() });
      return res.status(200).json({ message: "Project deleted" });
    } catch (error) {
      return this.handleError(next, error.message, 500);
    }
  };

  // 6. Restore deleted project
  restore = async (req, res, next) => {
    try {
      await VendorProject.updateOne({ _id: req.params.id }, { deletedAt: null });
      return res.status(200).json({ message: "Project restored!" });
    } catch (error) {
      return this.handleError(next, error.message, 500);
    }
  };
}

export default new VendorProjectController();