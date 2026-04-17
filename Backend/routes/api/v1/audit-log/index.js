import { Router } from "express";
import AuditLogController from "../../../../controllers/system/auditLogController.js";
import isUser from "../../../../middlewares/isUser.js";
import checkRole from "../../../../middlewares/checkRole.js";

const router = Router();

// 1. Security Guard: Only logged-in users can enter
router.use(isUser);

// 2. Only 'system_admin' can see the logs (Security measure)
router.use(checkRole("system_admin"));

// 3. GET ALL: See a list of all system activities (with filters)
router.get("/", AuditLogController.getAll);

// 4. GET BY ID: See full details of a single activity
router.get("/:id", AuditLogController.getById);

export default router;
