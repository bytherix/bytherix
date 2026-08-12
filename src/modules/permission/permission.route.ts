import { Router } from "express";
import { PermissionController } from "./permission.controller.js";
import { auth } from "../../shared/middlewares/auth.js";
import { accessTo } from "../../shared/middlewares/rbac.js";

const router = Router();

router.use(auth);

//GET
router.get("/", accessTo("permission.read"), PermissionController.fetchAll);
router.get("/:id", accessTo("permission.read"), PermissionController.fetchById);

//CREATE
router.post("/", accessTo("permission.create"), PermissionController.addPerm);

//UPDATE
router.patch("/:id", accessTo("permission.update"), PermissionController.updatePerm);

//DELETE
router.delete("/:id", accessTo("permission.delete"), PermissionController.deletePerm);


export default router;  