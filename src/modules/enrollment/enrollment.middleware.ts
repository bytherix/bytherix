import type { Response, NextFunction } from "express";
import { catchAsync } from "../../shared/error/catchAsync.js";
import { AppError } from "../../shared/error/appError.js";
import { Enrollment } from "./enrollment.model.js";
import { Role } from "../role/role.model.js";
import type { AuthenticatedRequest } from "../../shared/middlewares/auth.js";

export const authorizeEnrollmentAccess = catchAsync(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user) {
        throw new AppError("Unauthorized access", 401);
    }

    const { courseId } = req.params;

    if (!courseId && req.path === '/me') {
        return next();
    }

    // Find enrollment for this user and course
    const enrollment = await Enrollment.findOne({ user: user.id, course: courseId })
        .populate("course");

    if (!enrollment) {
        throw new AppError("Enrollment not found", 404);
    }

    // Get user role details
    const userRole = await Role.findById(user.role);

    // Admins and Super-Admins have full access
    const roleName = userRole?.name?.toLowerCase() || "";
    if (roleName === "admin" || roleName === "super-admin" || roleName === "superadmin") {
        return next();
    }

    // Instructors can access enrollments for courses they teach
    if (roleName === "instructor") {
        // Access instructor property directly from populated course
        const courseInstructor = (enrollment.course as any).instructor;
        if (courseInstructor && courseInstructor.toString() === user.id.toString()) {
            return next();
        }
    }

    // Users can only access their own enrollments
    if (enrollment.user.toString() === user.id.toString()) {
        return next();
    }

    throw new AppError("Forbidden: You do not have permission to access this enrollment", 403);
});