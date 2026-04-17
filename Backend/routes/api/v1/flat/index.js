import { Router } from "express";
import FlatController from "../../../../controllers/project/flatController.js";
import isUser from "../../../../middlewares/isUser.js";
import checkRole from "../../../../middlewares/checkRole.js";

const router = Router();

// 1. Security: Check if user is logged in
router.use(isUser);

// 2. CREATE: Add a new flat to a project
// Only Admin or Managers should be allowed to create flats
router.post("/", checkRole("system_admin"), FlatController.create);

// 3. GET ALL: Show a list of all flats (Available, Booked, etc.)
router.get("/", FlatController.getAll);

// 4. GET BY ID: View complete details, payment summary, and bookings of one flat
router.get("/:id", FlatController.getById);

// 5. UPDATE: Edit flat details like size or floor
router.put("/:id", checkRole("system_admin"), FlatController.update);

// 6. DELETE: Soft delete a flat
router.delete("/:id", checkRole("system_admin"), FlatController.delete);

// 7. STATUS: Change status like moving from 'available' to 'blocked'
router.patch(
  "/:id/status",
  checkRole("system_admin"),
  FlatController.changeStatus,
);

export default router;
