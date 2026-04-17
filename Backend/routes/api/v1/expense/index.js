import { Router } from "express";
import ExpenseController from "../../../../controllers/expense/expenseController.js";
import isUser from "../../../../middlewares/isUser.js";
import checkRole from "../../../../middlewares/checkRole.js";

const router = Router();

// 1. Security check: User must be logged in
router.use(isUser);

// 2. CREATE: Add a new expense record
// Only Admin or Accounts Officer can add expenses
router.post(
  "/",
  checkRole("system_admin", "accounts_officer"),
  ExpenseController.create,
);

// 3. GET ALL: List all expenses (with search and filters)
router.get("/", ExpenseController.getAll);

// 4. GET BY ID: See details of a specific expense
router.get("/:id", ExpenseController.getById);

// 5. UPDATE: Edit an expense record
router.patch(
  "/:id",
  checkRole("system_admin", "accounts_officer"),
  ExpenseController.update,
);

// 6. DELETE: Remove an expense (Soft Delete)
router.delete(
  "/:id",
  checkRole("system_admin", "accounts_officer"),
  ExpenseController.delete,
);

export default router;
