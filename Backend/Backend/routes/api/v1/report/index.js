import { Router } from "express";
import ReportController from "../../../../controllers/report/reportController.js";
import isUser from "../../../../middlewares/isUser.js";
import checkRole from "../../../../middlewares/checkRole.js";

const router = Router();

// 1. Security Guard: User must be logged in to see any report
router.use(isUser);

// 2. SALES SUMMARY: How many flats sold and total money earned?
// Only Admin and Accounts staff can see this
router.get(
  "/sales-summary",
  checkRole("system_admin", "accounts_officer"),
  ReportController.projectSalesSummary,
);

// 3. AVAILABILITY: How many units are available, booked, or sold?
router.get("/flat-availability", ReportController.flatAvailability);

// 4. CLIENT DUES: List of clients who still need to pay their balance
router.get(
  "/client-dues",
  checkRole("system_admin", "accounts_officer"),
  ReportController.clientDues,
);

// 5. VENDOR LEDGER: Report of payments made to contractors/vendors
router.get(
  "/vendor-ledger",
  checkRole("system_admin", "accounts_officer"),
  ReportController.vendorLedger,
);

export default router;
