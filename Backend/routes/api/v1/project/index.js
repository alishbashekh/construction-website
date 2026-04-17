import { Router } from "express";
import ProjectController from "../../../../controllers/Project/projectController.js";
import isUser from "../../../../middlewares/isUser.js";
import checkRole from "../../../../middlewares/checkRole.js";

const router = Router();

// 1. Security: First, check if the person is logged in
router.use(isUser);

// 2. CREATE: Start a new construction project
// Only 'system_admin' can start a new project
router.post("/", checkRole("system_admin"), ProjectController.create);

// 3. GET ALL: See a list of all projects and their stats (Available vs Sold flats)
router.get("/", ProjectController.getAll);

// 4. GET BY ID: View complete details and all flats of one specific project
router.get("/:id", ProjectController.getById);

// 5. UPDATE: Edit project information like Name or Location
router.put("/:id", checkRole("system_admin"), ProjectController.update);

// 6. DELETE: Remove a project (Soft Delete)
router.delete("/:id", checkRole("system_admin"), ProjectController.delete);

// 7. ARCHIVE: Change project status to active or archived
router.patch(
  "/:id/archive",
  checkRole("system_admin"),
  ProjectController.archive,
);

export default router;
