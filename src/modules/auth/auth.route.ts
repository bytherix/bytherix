import { Router } from "express";
import { AuthController } from "./auth.controller.js";


const router = Router();

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.post("/logout", AuthController.logout);
router.get("/verify/:accessToken", AuthController.verifyEmail);
router.post("/forgot-password", AuthController.forgotPassword);
router.post("/reset-password/:token", AuthController.resetPassword);
router.post("/google", AuthController.googleLogin);
router.post("/refresh-token", AuthController.refreshToken);

export default router;