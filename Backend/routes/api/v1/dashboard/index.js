import { Router } from "express";
import DashboardController from "../../../../controllers/dashboard/dashboardController.js";
import isUser from "../../../../middlewares/isUser.js";

const router = Router();

// 1. Security check: Only logged-in people can see the dashboard
router.use(isUser);

// 2. GET: Load all dashboard data (KPIs, Charts, Recent Activities)
// This calls the main getDashboard function in the controller
router.get("/", DashboardController.getDashboard);

export default router;
