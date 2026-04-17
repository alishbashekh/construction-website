import { Router } from "express";
import AuthController from "../../../../controllers/auth/authController.js";
import isUser from "../../../../middlewares/isUser.js";
import checkRole from "../../../../middlewares/checkRole.js";

const router = Router();

// --- 1. Public Routes (No login required) ---

// Login to the system
router.post("/login", AuthController.login);

// Request a password reset link
router.post("/forgot-password", AuthController.forgotPassword);

// --- 2. Protected Routes (Must be logged in) ---

// Check if the person is a valid user
router.use(isUser);

// --- 3. Admin Only Routes ---
// Only 'system_admin' can manage other staff members

// Create a new staff account (accounts_officer or booking_officer)
router.post("/create", checkRole("system_admin"), AuthController.createUser);

// See the list of all staff members
router.get("/list", checkRole("system_admin"), AuthController.getAllUsers);

// Delete a staff account (Soft Delete)
router.delete("/:id", checkRole("system_admin"), AuthController.deleteUser);

export default router;
