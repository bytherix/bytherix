import { Router } from "express";
import { auth } from "../../shared/middlewares/auth.js";
import { accessTo } from "../../shared/middlewares/rbac.js";
import { CategoryController } from "./category.controller.js";

const router = Router();


//GET
router.get("/", CategoryController.fetchAll);
router.get("/:id", CategoryController.fetchById);


//AUTH
router.use(auth);

//POST
router.post("/", accessTo("category.create"), CategoryController.addCat);

//UPDATE
router.patch("/:id", accessTo("category.update"), CategoryController.updateCat);

//DELETE
router.delete("/:id", accessTo("category.delete"), CategoryController.deleteCat);


export default router;