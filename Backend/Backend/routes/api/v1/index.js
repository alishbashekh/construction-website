import { Router } from "express";

// 1. Importing all the small router files
import commonRouter from "./common/index.js";
import userRouter from "./user/index.js";
import projectRouter from "./project/index.js";
import flatRouter from "./flat/index.js";
import clientRouter from "./client/index.js";
import bookingRouter from "./booking/index.js";
import paymentRouter from "./payment/index.js";
import expenseRouter from "./expense/index.js";
import reportRouter from "./report/index.js";
import vendorRouter from "./vendor/index.js";
import auditLogRouter from "./audit-log/index.js";
import dashboardRouter from "./dashboard/index.js";
import systemRouter from "./system/index.js";

// 2. Importing the logger middleware to see requests in terminal
import ApiLogsMiddleware from "../../../middlewares/apiLogs.js";

const router = Router();

// 3. Mapping the routes
// We are adding ApiLogsMiddleware to every route to track all activity
router.use("/common", ApiLogsMiddleware, commonRouter);
router.use("/user", ApiLogsMiddleware, userRouter);
router.use("/project", ApiLogsMiddleware, projectRouter);
router.use("/flat", ApiLogsMiddleware, flatRouter);
router.use("/client", ApiLogsMiddleware, clientRouter);
router.use("/booking", ApiLogsMiddleware, bookingRouter);
router.use("/payment", ApiLogsMiddleware, paymentRouter);
router.use("/expense", ApiLogsMiddleware, expenseRouter);
router.use("/report", ApiLogsMiddleware, reportRouter);
router.use("/vendor", ApiLogsMiddleware, vendorRouter);
router.use("/audit-log", ApiLogsMiddleware, auditLogRouter);
router.use("/dashboard", ApiLogsMiddleware, dashboardRouter);
router.use("/system", ApiLogsMiddleware, systemRouter);

export default router;
