import { Router } from "express";
import { RoleController } from "./role.controller.js";
import { auth } from "../../shared/middlewares/auth.js";
import { accessTo } from "../../shared/middlewares/rbac.js";

const router = Router();


router.use(auth);

//GET
router.get("/", accessTo("role.read"), RoleController.fetchAllRoles);
router.get("/:id", accessTo("role.read"), RoleController.fetchRoleById);

//POST
router.post("/", accessTo("role.create"), RoleController.addRole);

//UPDATE
router.patch("/:id", accessTo("role.update"), RoleController.updateRole);

//DELETE
router.delete("/:id", accessTo("role.delete"), RoleController.deleteRole);


export default router;