import type { Response, NextFunction } from "express";
import { catchAsync } from "../../shared/error/catchAsync.js";
import { AppError } from "../../shared/error/appError.js";
import { Role } from "../role/role.model.js";
import { Course } from "./course.model.js";
import type { AuthenticatedRequest } from "../../shared/middlewares/auth.js";

export const authorizeCourseAccess = catchAsync(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user) {
        throw new AppError("Unauthorized access", 401);
    }

    const role = await Role.findById(user.role);
    if (!role) {
        throw new AppError("Role not found", 403);
    }

    const roleName = role.name.toLowerCase();

    // Admins and Super-Admins have full access to all courses & playlists
    if (roleName === "admin" || roleName === "super-admin" || roleName === "superadmin") {
        return next();
    }

    // Instructors can only access and manage playlists for courses they own
    if (roleName === "instructor") {
        const courseId = req.params.courseId || req.params.id;

        if (courseId) {
            const course = await Course.findById(courseId);
            if (!course) {
                throw new AppError("Course not found", 404);
            }

            if (course.instructor.toString() !== user.id.toString()) {
                throw new AppError("Forbidden: Instructors can only access and manage their own courses and playlists", 403);
            }
        }
        return next();
    }

    throw new AppError("Forbidden: You do not have permission to perform this action", 403);
});
