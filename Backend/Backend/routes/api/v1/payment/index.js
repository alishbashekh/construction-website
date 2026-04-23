import { Router } from "express";
import PaymentController from "../../../../controllers/payment/paymentController.js";
import isUser from "../../../../middlewares/isUser.js";
import checkRole from "../../../../middlewares/checkRole.js";

const router = Router();

// 1. Security check: Only logged-in people can access payments
router.use(isUser);

// 2. CREATE: Receive a new payment from a client
// Only Admin or Accounts Officer can enter money records
router.post(
  "/",
  checkRole("system_admin", "accounts_officer"),
  PaymentController.create,
);

// 3. GET ALL: Show the list of all payment receipts
router.get("/", PaymentController.getAll);

// 4. GET BY ID: See the full detail of one specific receipt
router.get("/:id", PaymentController.getById);

// 5. UPDATE: Fix a small mistake in a payment record
router.patch(
  "/:id",
  checkRole("system_admin", "accounts_officer"),
  PaymentController.update,
);

// 6. DELETE: Remove a payment (Soft Delete)
// Money records are sensitive, so usually only Admin can delete them
router.delete("/:id", checkRole("system_admin"), PaymentController.delete);

export default router;
