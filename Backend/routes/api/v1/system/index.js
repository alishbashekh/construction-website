import { Router } from "express";
import SystemBackupController from "../../../../controllers/System/systemBackupController.js";
import isUser from "../../../../middlewares/isUser.js";
import checkRole from "../../../../middlewares/checkRole.js";

const router = Router();

// 1. Security: Check if user is logged in
router.use(isUser);

// 2. Only 'system_admin' can download the database backup
// This is very important for security
router.get(
  "/backup",
  checkRole("system_admin"),
  SystemBackupController.createBackup,
);

export default router;
