import { AppError } from "../../shared/error/appError.js";
import { Enrollment } from "./enrollment.model.js";
import { Course } from "../course/course.model.js";
import mongoose from "mongoose";

export class EnrollmentService {
    // CREATE ENROLLMENT
    static async createEnrollment(userId: string, courseId: string) {
        if (!courseId || !mongoose.Types.ObjectId.isValid(courseId)) {
            throw new AppError("Invalid or missing course ID", 400);
        }

        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            throw new AppError("Invalid or missing user ID", 400);
        }

        const courseExists = await Course.findOne({ _id: courseId, isRemoved: false });
        if (!courseExists) {
            throw new AppError("Course not found", 404);
        }

        // Prevent duplicate enrollments
        const existingEnrollment = await Enrollment.findOne({ user: userId, course: courseId });
        if (existingEnrollment) {
            throw new AppError("You are already enrolled in this course", 400);
        }

        const newEnrollment = await Enrollment.create({
            user: userId,
            course: courseId,
            status: "active",
            progress: 0,
            completedVideoIds: [],
            enrolledAt: new Date(),
        });

        return {
            success: true,
            message: "Successfully enrolled in the course",
            data: newEnrollment
        };
    }

    // GET MY ENROLLMENTS
    static async getMyEnrollments(userId: string) {
        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            throw new AppError("Invalid or missing user ID", 400);
        }

        const enrollments = await Enrollment.find({ user: userId })
            .populate("course", "title desc thumbnail level price discountPrice finalPrice instructor");

        return {
            success: true,
            message: "Enrollments fetched successfully",
            data: enrollments
        };
    }

    // GET ENROLLMENT BY COURSE ID
    static async getEnrollmentByCourse(userId: string, courseId: string) {
        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            throw new AppError("Invalid or missing user ID", 400);
        }

        if (!courseId || !mongoose.Types.ObjectId.isValid(courseId)) {
            throw new AppError("Invalid or missing course ID", 400);
        }

        const enrollment = await Enrollment.findOne({ user: userId, course: courseId })
            .populate("course", "title desc thumbnail level price discountPrice finalPrice instructor playlists");

        if (!enrollment) {
            throw new AppError("Enrollment not found for this course", 404);
        }

        return {
            success: true,
            message: "Enrollment details fetched successfully",
            data: enrollment
        };
    }

    // UPDATE PROGRESS
    static async updateProgress(userId: string, courseId: string, videoId: string) {
        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            throw new AppError("Invalid or missing user ID", 400);
        }

        if (!courseId || !mongoose.Types.ObjectId.isValid(courseId)) {
            throw new AppError("Invalid or missing course ID", 400);
        }

        if (!videoId || !mongoose.Types.ObjectId.isValid(videoId)) {
            throw new AppError("Invalid or missing video ID", 400);
        }

        const enrollment = await Enrollment.findOne({ user: userId, course: courseId });
        if (!enrollment) {
            throw new AppError("Enrollment not found", 404);
        }

        const course = await Course.findOne({ _id: courseId, isRemoved: false });
        if (!course) {
            throw new AppError("Course not found", 404);
        }

        // Check if the video belongs to the course
        let videoExists = false;
        let totalVideos = 0;

        for (const playlist of course.playlists || []) {
            for (const video of playlist.videos || []) {
                totalVideos++;
                if (video._id.toString() === videoId) {
                    videoExists = true;
                }
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

        return {
            success: true,
            message: "Progress updated successfully",
            data: enrollment
        };
    }
}
