import { Router } from "express";
import { EnrollmentController } from "./enrollment.controller.js";
import { auth } from "../../shared/middlewares/auth.js";

const router = Router();

router.use(auth);

// POST 
router.post("/", EnrollmentController.createEnrollment);

// GET 
router.get("/me", EnrollmentController.getMyEnrollments);

// GET
router.get("/:courseId", EnrollmentController.getEnrollmentByCourse);

// PATCH 
router.patch("/:courseId/progress", EnrollmentController.updateProgress);

export default router;
