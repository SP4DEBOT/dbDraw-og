import { Router } from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import { createProject, deleteProject, getProjects, updateProject } from "../controllers/projectController.js";

const router = Router();
router.use(authenticate);
router.post("/", createProject);
router.get("/", getProjects);
router.put("/:id", updateProject);
router.delete("/:id", deleteProject);
export default router;
