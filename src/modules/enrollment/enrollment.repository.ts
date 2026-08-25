import { AppError } from "../../shared/error/appError.js";
import { Enrollment } from "./enrollment.model.js";
import { Course } from "../course/course.model.js";
import { getPagination, getPaginationMeta } from "../../shared/helper/pagination.js";
import mongoose from "mongoose";

export class EnrollmentRepository {
  // CREATE ENROLLMENT
  static async create(userId: string, courseId: string, isFree: boolean = false) {
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

    // Prevent duplicate enrollments (only check for pending_payment or active statuses)
    const existingEnrollment = await Enrollment.findOne({
      user: userId,
      course: courseId,
      status: { $in: ["pending_payment", "active"] }
    });
    if (existingEnrollment) {
      throw new AppError("You are already enrolled in this course", 400);
    }

    const newEnrollment = await Enrollment.create({
      user: userId,
      course: courseId,
      status: isFree ? "active" : "pending_payment",
      progress: 0,
      completedVideoIds: [],
      enrolledAt: new Date(),
      // Payment will be set later for paid courses after successful payment verification
      ...(isFree ? {} : { payment: undefined })
    });

    return newEnrollment;
  }

  // GET ENROLLMENTS BY USER ID
  static async findByUserId(userId: string, query: any = {}) {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new AppError("Invalid or missing user ID", 400);
    }

    const { page, limit, skip } = getPagination(query);

    const [enrollments, total] = await Promise.all([
      Enrollment.find({ user: userId })
        .populate("course", "title desc thumbnail level price discountPrice finalPrice instructor")
        .skip(skip)
        .limit(limit),
      Enrollment.countDocuments({ user: userId })
    ]);

    return {
      success: true,
      message: "Enrollments fetched successfully",
      data: enrollments.map(enrollment => ({
        id: enrollment._id,
        user: enrollment.user,
        course: enrollment.course,
        status: enrollment.status,
        progress: enrollment.progress,
        completedVideoIds: enrollment.completedVideoIds,
        enrolledAt: enrollment.enrolledAt,
        lastAccessedAt: enrollment.lastAccessedAt,
        completedAt: enrollment.completedAt,
        createdAt: enrollment.createdAt,
        updatedAt: enrollment.updatedAt
      })),
      meta: getPaginationMeta({
        total,
        page,
        limit
      })
    };
  }

  // GET ENROLLMENT BY USER ID AND COURSE ID
  static async findByUserIdAndCourseId(userId: string, courseId: string) {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new AppError("Invalid or missing user ID", 400);
    }

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      throw new AppError("Invalid or missing course ID", 400);
    }

    const enrollment = await Enrollment.findOne({
      user: userId,
      course: courseId
    })
      .populate("course", "title desc thumbnail level price discountPrice finalPrice instructor playlists");

    if (!enrollment) {
      throw new AppError("Enrollment not found for this course", 404);
    }

    return enrollment;
  }

  // UPDATE PROGRESS
  static async updateProgress(userId: string, courseId: string, videoId: string) {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new AppError("Invalid or missing user ID", 400);
    }

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      throw new AppError("Invalid or missing course ID", 400);
    }

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
      throw new AppError("Invalid or missing video ID", 400);
    }

    const enrollment = await Enrollment.findOne({ user: userId, course: courseId });
    if (!enrollment) {
      throw new AppError("Enrollment not found", 404);
    }

    const course = await Course.findOne({ _id: courseId, isRemoved: false, status: "published" });
    if (!course) {
      throw new AppError("Course not found or not accessible", 404);
    }

    // Check if the video belongs to the course and count total videos
    let totalVideos = 0;
    let videoExists = false;

    for (const playlist of course.playlists || []) {
      totalVideos += playlist.videos?.length || 0;

      // Check if video exists in this playlist
      const videoInPlaylist = playlist.videos?.find(
        (v: any) => v._id.toString() === videoId
      );

      if (videoInPlaylist) {
        videoExists = true;
        // No need to continue checking once we find the video
        break;
      }
    }

    if (!videoExists) {
      throw new AppError("Video does not belong to this course", 400);
    }

    // Add videoId to completedVideoIds if not already present
    const videoObjId = new mongoose.Types.ObjectId(videoId);
    const alreadyCompleted = enrollment.completedVideoIds.some(
      (id) => id.toString() === videoId
    );

    if (!alreadyCompleted) {
      enrollment.completedVideoIds.push(videoObjId);
    }

    // Calculate progress
    if (totalVideos > 0) {
      enrollment.progress = Math.round((enrollment.completedVideoIds.length / totalVideos) * 100);
    } else {
      enrollment.progress = 0;
    }

    if (enrollment.progress === 100) {
      enrollment.status = "completed";
      enrollment.completedAt = new Date();
    }

    enrollment.lastAccessedAt = new Date();

    await enrollment.save();

    return enrollment;
  }

  // CANCEL ENROLLMENT
  static async cancelEnrollment(userId: string, courseId: string) {
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

    const enrollment = await Enrollment.findOneAndUpdate(
      { user: userId, course: courseId },
      { status: "cancelled" },
      { new: true }
    );

    if (!enrollment) {
      throw new AppError("Enrollment not found", 404);
    }

    return enrollment;
  }
}