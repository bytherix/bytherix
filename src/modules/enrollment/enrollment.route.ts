import { Router } from "express";
import { EnrollmentController } from "./enrollment.controller.js";
import { auth } from "../../shared/middlewares/auth.js";
import { accessTo } from "../../shared/middlewares/rbac.js";
import { authorizeEnrollmentAccess } from "./enrollment.middleware.js";

const router = Router();

router.use(auth);

// POST
router.post("/", accessTo("enrollment.create"), authorizeEnrollmentAccess, EnrollmentController.createEnrollment);

// GET 
router.get("/me", accessTo("enrollment.read"), authorizeEnrollmentAccess, EnrollmentController.getMyEnrollments);
router.get("/:courseId", accessTo("enrollment.read"), authorizeEnrollmentAccess, EnrollmentController.getEnrollmentByCourse);

// PATCH 
router.patch("/:courseId/progress", accessTo("enrollment.update"), authorizeEnrollmentAccess, EnrollmentController.updateProgress);

// DELETE
router.delete("/:courseId", accessTo("enrollment.delete"), authorizeEnrollmentAccess, EnrollmentController.cancelEnrollment);

export default router;