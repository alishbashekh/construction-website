import Project from "../../models/Project.js";
import Flat from "../../models/Flat.js";
import BaseController from "../BaseController.js";
import { createAuditLog } from "../../utils/auditLog.js";

class ProjectController extends BaseController {
  // 1. Naya Project register karna (Create)
  create = async (req, res, next) => {
    try {
      const { name, location, totalFlats, totalFloors } = req.body;

      // Check karo ke zaroori cheezein likhi hain?
      if (!name || !location)
        return res
          .status(400)
          .json({ message: "Naam aur Location lazmi hai!" });

      // Check karo ke is naam aur jagah ka project pehle se toh nahi bana hua?
      const checkProject = await Project.findOne({
        name,
        location,
        deletedAt: null,
      });
      if (checkProject)
        return res
          .status(400)
          .json({ message: "Ye project pehle se majood hai!" });

      // Database mein naya project save karo
      const project = await Project.create({
        ...req.body,
        createdBy: req.user._id,
      });

      // Audit Log: Diary mein entry
      await createAuditLog({
        action: "project_create",
        description: `Naya Project "${name}" shuru kiya gaya`,
        req,
      });

      return res.status(201).json({ error: false, data: project });
    } catch (error) {
      return this.handleError(next, error.message, 500);
    }
  };

  // 2. Saare Projects ki list aur unki progress (Get All)
  getAll = async (req, res, next) => {
    try {
      const { page = 1, limit = 10, search } = req.query;
      let query = { deletedAt: null };

      if (search) query.name = { $regex: search, $options: "i" };

      const projects = await Project.find(query)
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      // Ye part thora "Pro" hai: Ye har project ke flats ginta hai (Available kitne hain, Sold kitne hain)
      const projectsWithStats = await Promise.all(
        projects.map(async (p) => {
          const stats = await Flat.aggregate([
            { $match: { project: p._id, deletedAt: null } },
            { $group: { _id: "$status", count: { $sum: 1 } } },
          ]);
          return { ...p.toJSON(), stats };
        }),
      );

      return res.status(200).json({ data: projectsWithStats });
    } catch (error) {
      return this.handleError(next, error.message, 500);
    }
  };

  // 3. Aik Project ki poori detail aur uske saare flats (Get By ID)
  getById = async (req, res, next) => {
    try {
      const project = await Project.findOne({
        _id: req.params.id,
        deletedAt: null,
      });
      if (!project)
        return res.status(404).json({ message: "Project nahi mila" });

      // Is project ke saare flats bhi dhoondo
      const flats = await Flat.find({ project: project._id, deletedAt: null });

      return res.status(200).json({ data: { ...project.toJSON(), flats } });
    } catch (error) {
      return this.handleError(next, error.message, 500);
    }
  };

  // 4. Project ki details update karna
  update = async (req, res, next) => {
    try {
      const project = await Project.findOneAndUpdate(
        { _id: req.params.id, deletedAt: null },
        { $set: req.body },
        { new: true },
      );

      await createAuditLog({
        action: "project_update",
        description: `Project "${project.name}" update kiya gaya`,
        req,
      });

      return res
        .status(200)
        .json({ message: "Project details update ho gayin!", data: project });
    } catch (error) {
      return this.handleError(next, error.message, 500);
    }
  };

  // 5. Project delete karna (Soft Delete)
  delete = async (req, res, next) => {
    try {
      await Project.updateOne(
        { _id: req.params.id },
        { deletedAt: new Date() },
      );
      return res.status(200).json({ message: "Project delete ho gaya" });
    } catch (error) {
      return this.handleError(next, error.message, 500);
    }
  };

  // 6. Project ko "Archive" karna (Yaani filhaal kaam rok dena ya khatam ho jana)
  archive = async (req, res, next) => {
    try {
      const project = await Project.findById(req.params.id);
      // Agar active hai toh archive kar do, agar archived hai toh wapas active kar do
      project.status = project.status === "archived" ? "active" : "archived";
      await project.save();

      return res
        .status(200)
        .json({ message: `Project status: ${project.status}`, data: project });
    } catch (error) {
      return this.handleError(next, error.message, 500);
    }
  };
}

export default new ProjectController();
