import type { Request, Response } from "express";
import { catchAsync } from "../../shared/error/catchAsync.js";
import { EnrollmentService } from "./enrollment.service.js";
import { AppError } from "../../shared/error/appError.js";
import type { AuthenticatedRequest } from "../../shared/middlewares/auth.js";
import type { CreateEnrollmentDTO, UpdateProgressDTO } from "./dto.js";
import mongoose from "mongoose";

export class EnrollmentController {
  // ENROLL IN A COURSE
  static createEnrollment = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const { courseId }: CreateEnrollmentDTO = req.body;
    if (!courseId) {
      throw new AppError("Course ID is required", 400);
    }

    // Validate courseId format
    if (!mongoose.Types.ObjectId.isValid(courseId.toString())) {
      throw new AppError("Invalid course ID format", 400);
    }

    const result = await EnrollmentService.createEnrollment(req.user!.id, courseId.toString());
    return res.status(201).json(result);
  });

  // GET MY ENROLLMENTS
  static getMyEnrollments = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const result = await EnrollmentService.getMyEnrollments(req.user!.id, req.query);
    return res.status(200).json(result);
  });

  // GET ENROLLMENT BY COURSE ID
  static getEnrollmentByCourse = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const { courseId } = req.params;
    if (!courseId) {
      throw new AppError("Course ID is required", 400);
    }

    // Validate courseId format
    if (!mongoose.Types.ObjectId.isValid(courseId.toString())) {
      throw new AppError("Invalid course ID format", 400);
    }

    const result = await EnrollmentService.getEnrollmentByCourse(req.user!.id, courseId.toString());
    return res.status(200).json(result);
  });

  // UPDATE COURSE PROGRESS
  static updateProgress = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const { courseId } = req.params;
    const { videoId }: UpdateProgressDTO = req.body;

    if (!courseId) {
      throw new AppError("Course ID is required", 400);
    }
    if (!videoId) {
      throw new AppError("Video ID is required", 400);
    }

    // Validate ID formats
    if (!mongoose.Types.ObjectId.isValid(courseId.toString())) {
      throw new AppError("Invalid course ID format", 400);
    }
    if (!mongoose.Types.ObjectId.isValid(videoId.toString())) {
      throw new AppError("Invalid video ID format", 400);
    }

    const result = await EnrollmentService.updateProgress(req.user!.id, courseId.toString(), videoId.toString());
    return res.status(200).json(result);
  });

  // CANCEL ENROLLMENT
  static cancelEnrollment = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const { courseId } = req.params;
    if (!courseId) {
      throw new AppError("Course ID is required", 400);
    }

    // Validate courseId format
    if (!mongoose.Types.ObjectId.isValid(courseId.toString())) {
      throw new AppError("Invalid course ID format", 400);
    }

    const result = await EnrollmentService.cancelEnrollment(req.user!.id, courseId.toString());
    return res.status(200).json(result);
  });
}