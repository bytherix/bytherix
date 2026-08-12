import { Router } from "express";
import { auth } from "../../shared/middlewares/auth.js";
import { UserProfileController } from "./userProfile.controller.js";
import { upload } from "../../shared/middlewares/upload.js";

const router = Router();

router.use(auth);

router.put("/", upload.single("avatar"), UserProfileController.profileInfo);

// Get authenticated user's profile
router.get("/me", UserProfileController.myProfile);

router.get("/:id", UserProfileController.fetchProfileById);

export default router;