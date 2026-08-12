import { Router } from "express";
import { auth } from "../../shared/middlewares/auth.js";
import { accessTo } from "../../shared/middlewares/rbac.js";
import { UserController } from "./user.controller.js";


const router = Router();

router.use(auth);

router.get("/all", accessTo("users.read"), UserController.getAllUsers);
router.get("/filtered", accessTo("users.read"), UserController.getUsersAdminAndMod);
router.get("/:id", accessTo("users.read"), UserController.getUserById);

router.patch("/:id/role", accessTo("users.update"), UserController.updateRoleByAdmin);


export default router;
