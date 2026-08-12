import { Router } from "express";
import { InstructorController } from "./instructor.controller.js";
import { auth } from "../../shared/middlewares/auth.js";
import { accessTo } from "../../shared/middlewares/rbac.js";
import { upload } from "../../shared/middlewares/upload.js";

const router = Router();

//PUBLIC ROUTE
router.get("/", InstructorController.fetchProfiles);
router.get("/:id", InstructorController.fetchById);

router.use(auth);

router.get("/me", InstructorController.fetchMyProfile);
router.post("/", upload.single("profileImage"), InstructorController.createProfile);
router.patch("/me", upload.single("profileImage"), InstructorController.updateProfile);

//ADMIN/MODS ROUTE
router.use(accessTo("admin", "moderators"));
router.patch("/:id/verify", InstructorController.toggleVerification);

export default router;