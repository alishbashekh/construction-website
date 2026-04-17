import { Router } from "express";
import VendorController from "../../../../controllers/vendor/vendorController.js";
import VendorProjectController from "../../../../controllers/vendor/vendorProjectController.js";
import VendorPaymentController from "../../../../controllers/vendor/vendorPaymentController.js";
import isUser from "../../../../middlewares/isUser.js";
import checkRole from "../../../../middlewares/checkRole.js";

const router = Router();

// 1. Security: Only logged-in users can access these routes
router.use(isUser);

//VENDOR PROFILES (Naam, Phone, etc.)

// Add a new vendor
router.post(
  "/",
  checkRole("system_admin", "accounts_officer"),
  VendorController.create,
);

// Get list of all vendors
router.get("/", VendorController.getAll);

// Get details of one specific vendor
router.get("/:id", VendorController.getById);

// Update or Delete a vendor
router.put("/:id", checkRole("system_admin"), VendorController.update);
router.delete("/:id", checkRole("system_admin"), VendorController.delete);

//VENDOR PROJECTS (Types of Work like Painting, Electric)

// Create a new work type project
router.post(
  "/projects",
  checkRole("system_admin"),
  VendorProjectController.create,
);

// Get list of all vendor projects
router.get("/projects", VendorProjectController.getAll);

// Update or Delete a project
router.put(
  "/projects/:id",
  checkRole("system_admin"),
  VendorProjectController.update,
);
router.delete(
  "/projects/:id",
  checkRole("system_admin"),
  VendorProjectController.delete,
);

//VENDOR PAYMENTS (Contracts & Installments)

// Start a new contract with a vendor
router.post(
  "/payments",
  checkRole("system_admin", "accounts_officer"),
  VendorPaymentController.create,
);

// Get all vendor contracts
router.get("/payments", VendorPaymentController.getAll);

// Get details of one contract and its payment history
router.get("/payments/:id", VendorPaymentController.getById);

// Add a new installment to a contract
router.post(
  "/payments/:id/add-payment",
  checkRole("system_admin", "accounts_officer"),
  VendorPaymentController.addPayment,
);

export default router;



