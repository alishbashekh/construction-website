import { Router } from "express";
import CommonController from "../../../../controllers/common/controller.js";
import isUser from "../../../../middlewares/isUser.js";

const router = Router();

// 1. Security: Check if the user is logged in
router.use(isUser);

// 2. GET DATA: This route is used to get lists for dropdowns (selectors)
// Example: /common?project=true&client=true
router.get("/", CommonController.get);

export default router;
