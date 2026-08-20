import { Router } from "express";
import { CourseController } from "./course.controller.js";
import { PlaylistController } from "./playlist.controller.js";
import { authorizeCourseAccess } from "./course.middleware.js";
import { auth } from "../../shared/middlewares/auth.js";
import { accessTo } from "../../shared/middlewares/rbac.js";
import { upload } from "../../shared/middlewares/upload.js";

const router = Router();

// PUBLIC ROUTES
router.get("/", CourseController.getCoursesByPublicAll);
router.get("/slug/:slug", CourseController.getCourseBySlugPublic);
router.get("/public/:id", CourseController.getCourseByIdPublic);

// PRIVATE ROUTES
router.use(auth);

// FETCH UNFILTERED (ADMIN/STAFF)
router.get("/unfiltered", accessTo("course.read"), CourseController.fetchAllUnfiltered);
router.get("/unfiltered/:id", accessTo("course.read"), CourseController.fetchCourseById);

// CREATE
router.post("/", accessTo("course.create"), upload.single("thumbnail"), CourseController.addCourse);

// UPDATE
router.patch("/:id", accessTo("course.update"), authorizeCourseAccess, upload.single("thumbnail"), CourseController.updateCourse);

// TOGGLE REMOVAL (SOFT DELETE)
router.patch("/:id/toggle", accessTo("course.delete"), authorizeCourseAccess, CourseController.toggleCourse);

// HARD DELETE
router.delete("/:id", accessTo("course.delete"), authorizeCourseAccess, CourseController.deleteCourse);

// PLAYLISTS
router.post("/:courseId/playlists", accessTo("course.update"), authorizeCourseAccess, upload.single("thumbnail"), PlaylistController.addPlaylist);
router.patch("/:courseId/playlists/:playlistId", accessTo("course.update"), authorizeCourseAccess, upload.single("thumbnail"), PlaylistController.updatePlaylist);
router.delete("/:courseId/playlists/:playlistId", accessTo("course.update"), authorizeCourseAccess, PlaylistController.deletePlaylist);

// VIDEOS
router.post("/:courseId/playlists/:playlistId/videos", accessTo("course.update"), authorizeCourseAccess, PlaylistController.addVideoToPlaylist);
router.patch("/:courseId/playlists/:playlistId/videos/:videoId", accessTo("course.update"), authorizeCourseAccess, PlaylistController.updateVideoInPlaylist);
router.delete("/:courseId/playlists/:playlistId/videos/:videoId", accessTo("course.update"), authorizeCourseAccess, PlaylistController.deleteVideoFromPlaylist);

export default router;
