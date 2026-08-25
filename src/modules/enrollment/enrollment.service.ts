import { EnrollmentRepository } from "./enrollment.repository.js";
import { Course } from "../course/course.model.js";
import { PaymentService } from "../payment/payment.service.js";
import type { InitiatePaymentDTO } from "../payment/payment.dto.js";
import { AppError } from "../../shared/error/appError.js";
import mongoose from "mongoose";

export class EnrollmentService {
  // CREATE ENROLLMENT
  static async createEnrollment(userId: string, courseId: string) {
    // Validate IDs
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new AppError("Invalid or missing user ID", 400);
    }

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      throw new AppError("Invalid or missing course ID", 400);
    }

    // Check if course exists, is not removed, and is published
    const courseExists = await Course.findOne({ _id: courseId, isRemoved: false, status: "published" });
    if (!courseExists) {
      throw new AppError("Course not found or not accessible", 404);
    }

    // Check if course is free (finalPrice === 0)
    const isFree = courseExists.finalPrice === 0;

    if (isFree) {
      // For free courses, create enrollment directly with active status
      return await EnrollmentRepository.create(userId, courseId, true);
    } else {
      // For paid courses, initiate payment and return payment details
      // The enrollment will be created after successful payment verification
      const paymentDto: InitiatePaymentDTO = {
        courseId: courseId.toString()
      };

      const payment = await PaymentService.initiatePayment(userId, courseId.toString(), paymentDto);

      // Return payment initiation details for frontend to redirect to eSewa
      return {
        success: true,
        message: "Payment initiated successfully",
        payment: {
          id: payment._id,
          amount: payment.amount,
          currency: payment.currency,
          provider: payment.provider,
          providerPaymentId: payment.providerPaymentId,
          // In a real implementation, we would return eSewa-specific data here
          // For now, returning the payment object
        }
      };
    }
  }

  // GET MY ENROLLMENTS
  static async getMyEnrollments(userId: string, query: any) {
    return await EnrollmentRepository.findByUserId(userId, query);
  }

  // GET ENROLLMENT BY COURSE ID
  static async getEnrollmentByCourse(userId: string, courseId: string) {
    return await EnrollmentRepository.findByUserIdAndCourseId(userId, courseId);
  }

  // UPDATE PROGRESS
  static async updateProgress(userId: string, courseId: string, videoId: string) {
    return await EnrollmentRepository.updateProgress(userId, courseId, videoId);
  }

  // CANCEL ENROLLMENT
  static async cancelEnrollment(userId: string, courseId: string) {
    return await EnrollmentRepository.cancelEnrollment(userId, courseId);
  }
}