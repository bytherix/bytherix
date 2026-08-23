import { EnrollmentRepository } from "./enrollment.repository.js";

export class EnrollmentService {
  // CREATE ENROLLMENT
  static async createEnrollment(userId: string, courseId: string) {
    return await EnrollmentRepository.create(userId, courseId);
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