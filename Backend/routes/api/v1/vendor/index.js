import { Router } from "express";
import VendorController from "../../../../controllers/Vendor/vendorController.js";
import VendorProjectController from "../../../../controllers/Vendor/vendorProjectController.js";
import VendorPaymentController from "../../../../controllers/Vendor/vendorPaymentController.js";
import isUser from "../../../../middlewares/isUser.js";
import checkRole from "../../../../middlewares/checkRole.js";

const router = Router();

// 1. Security: Only logged-in users can access these routes
router.use(isUser);

// ─── VENDOR PROJECTS ─────────────────────────────────────
// ⚠️ Must come BEFORE /:id routes to avoid conflict

// Create a new work type project
router.post("/projects", checkRole("system_admin"), VendorProjectController.create);

// Get list of all vendor projects
router.get("/projects", VendorProjectController.getAll);

// Get single vendor project
router.get("/projects/:id", VendorProjectController.getById);

// Update or Delete a project
router.put("/projects/:id", checkRole("system_admin"), VendorProjectController.update);
router.delete("/projects/:id", checkRole("system_admin"), VendorProjectController.delete);

// Restore deleted project
router.post("/projects/:id/restore", checkRole("system_admin"), VendorProjectController.restore);

// ─── VENDOR PAYMENTS ─────────────────────────────────────
// ⚠️ Must come BEFORE /:id routes to avoid conflict

// Start a new contract with a vendor
router.post("/payments", checkRole("system_admin", "accounts_officer"), VendorPaymentController.create);

// Get all vendor contracts
router.get("/payments", VendorPaymentController.getAll);

// Get details of one contract and its payment history
router.get("/payments/:id", VendorPaymentController.getById);

// Add a new installment to a contract
router.post("/payments/:id/add-payment", checkRole("system_admin", "accounts_officer"), VendorPaymentController.addPayment);

// Delete a contract
router.delete("/payments/:id", checkRole("system_admin"), VendorPaymentController.delete);

// ─── VENDOR PROFILES ─────────────────────────────────────
// ⚠️ Dynamic /:id routes must come LAST

// Add a new vendor
router.post("/", checkRole("system_admin", "accounts_officer"), VendorController.create);

// Get list of all vendors
router.get("/", VendorController.getAll);

// Get details of one specific vendor
router.get("/:id", VendorController.getById);

// Update, Delete or Restore a vendor
router.put("/:id", checkRole("system_admin"), VendorController.update);
router.delete("/:id", checkRole("system_admin"), VendorController.delete);
router.post("/:id/restore", checkRole("system_admin"), VendorController.restore);

export default router;