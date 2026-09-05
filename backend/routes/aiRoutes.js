import { Router } from "express";
import { generateSchema, reviewSchema } from "../controllers/aiController.js";

const router = Router();

router.post("/generate-schema", generateSchema);
router.post("/review-schema", reviewSchema);

export default router;
