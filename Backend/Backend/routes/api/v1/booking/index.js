import { Router } from "express";
import BookingController from "../../../../controllers/booking/bookingController.js";
import isUser from "../../../../middlewares/isUser.js";
import checkRole from "../../../../middlewares/checkRole.js";

const router = Router();

router.use(isUser);

//Register a new booking
// Only Admin or Booking Officer can create a booking
router.post(
  "/",
  checkRole("system_admin", "booking_officer"),
  BookingController.create,
);

//list of all bookings in the system
router.get("/", BookingController.getAll);

// View complete details of a single booking
router.get("/:id", BookingController.getById);

//Cancel an active booking and start refund process
router.post(
  "/:id/cancel",
  checkRole("system_admin", "booking_officer"),
  BookingController.cancel,
);

// Transfer booking from old client to new client
router.post(
  "/:id/transfer",
  checkRole("system_admin", "booking_officer"),
  BookingController.transfer,
);

export default router;
