import { Router } from "express";
import { ContactController } from "./contact.controller.js";
import { auth } from "../../shared/middlewares/auth.js";
import { accessTo } from "../../shared/middlewares/rbac.js";

const router = Router();

// PUBLIC
router.post("/", ContactController.sentRequest);

// PROTECTED
router.use(auth);

router.get("/", accessTo("contact.read"), ContactController.getAllRequests);
router.get("/:id", accessTo("contact.read"), ContactController.getById);
router.patch("/:id/status", accessTo("contact.update"), ContactController.updateStatus);
router.delete("/:id", accessTo("contact.delete"), ContactController.deleteContact);

export default router;
