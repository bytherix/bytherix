import type { Response } from "express";
import { catchAsync } from "../../shared/error/catchAsync.js";
import { EnrollmentService } from "./enrollment.service.js";
import { AppError } from "../../shared/error/appError.js";
import type { AuthenticatedRequest } from "../../shared/middlewares/auth.js";

export class EnrollmentController {
    // ENROLL IN A COURSE
    static createEnrollment = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
        const userId = req.user?.id;
        if (!userId) {
            throw new AppError("Unauthorized access", 401);
        }

        const { courseId } = req.body;
        if (!courseId) {
            throw new AppError("Course ID is required", 400);
        }

        const result = await EnrollmentService.createEnrollment(userId, courseId);
        return res.status(201).json(result);
    });

    // GET MY ENROLLMENTS
    static getMyEnrollments = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
        const userId = req.user?.id;
        if (!userId) {
            throw new AppError("Unauthorized access", 401);
        }

        const result = await EnrollmentService.getMyEnrollments(userId);
        return res.status(200).json(result);
    });

    // GET ENROLLMENT BY COURSE ID
    static getEnrollmentByCourse = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
        const userId = req.user?.id;
        if (!userId) {
            throw new AppError("Unauthorized access", 401);
        }

        const { courseId } = req.params;
        if (!courseId) {
            throw new AppError("Course ID is required", 400);
        }

        const result = await EnrollmentService.getEnrollmentByCourse(userId, courseId.toString());
        return res.status(200).json(result);
    });

    // UPDATE COURSE PROGRESS
    static updateProgress = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
        const userId = req.user?.id;
        if (!userId) {
            throw new AppError("Unauthorized access", 401);
        }

        const { courseId } = req.params;
        const { videoId } = req.body;

        if (!courseId) {
            throw new AppError("Course ID is required", 400);
        }
        if (!videoId) {
            throw new AppError("Video ID is required", 400);
        }

        const result = await EnrollmentService.updateProgress(userId, courseId.toString(), videoId.toString());
        return res.status(200).json(result);
    });
}
