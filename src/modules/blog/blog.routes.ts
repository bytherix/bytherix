import { Router } from "express";
import { BlogController } from "./blog.controller.js";
import { auth } from "../../shared/middlewares/auth.js";
import { accessTo } from "../../shared/middlewares/rbac.js";

const router = Router();

//PUBLIC
router.get("/public", BlogController.fetchPublishedBlogs);
router.get("/public/:slug", BlogController.fetchBlogBySlug);

//ADMIN (auth required below this line)
router.use(auth);

router.get("/", accessTo("blog.read"), BlogController.fetchAllBlogs);
router.get("/:id", accessTo("blog.read"), BlogController.fetchBlogById);

router.post("/", accessTo("blog.create"), BlogController.addBlog);

router.patch("/:id", accessTo("blog.update"), BlogController.updateBlog);
router.patch("/:id/publish", accessTo("blog.publish"), BlogController.publishBlog);

router.delete("/:id", accessTo("blog.delete"), BlogController.deleteBlog);

export default router;