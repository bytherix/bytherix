import type { Request, Response } from "express";
import { catchAsync } from "../../shared/error/catchAsync.js";
import { InstructorService } from "./instructor.service.js";
import { AppError } from "../../shared/error/appError.js";

export class InstructorController {

    // CREATE PROFILE
    static createProfile = catchAsync(async (req: Request, res: Response) => {
        const userId = req.user.id;

        const data = await InstructorService.addDetails(
            userId,
            req.body,
            req.file
        );

        return res.status(201).json({
            success: true,
            message: "Profile created successfully.",
            data,
        });
    });


    // UPDATE OWN PROFILE
    static updateProfile = catchAsync(async (req: Request, res: Response) => {
        const userId = req.user.id;

        const data = await InstructorService.updateSelfDetails(
            userId,
            req.body,
            req.file
        );

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully.",
            data,
        });
    });


    // TOGGLE VERIFICATION (ADMIN / MOD)
    static toggleVerification = catchAsync(async (req: Request, res: Response) => {
        const { id } = req.params;

        if (!id) {
            throw new AppError("Invalid id", 400);
        }

        const data = await InstructorService.toggleVerification(id?.toString());

        return res.status(200).json({
            success: true,
            message: "Instructor verification status updated successfully.",
            data,
        });
    });


    // FETCH ALL PROFILES
    static fetchProfiles = catchAsync(async (req: Request, res: Response) => {
        const userId = req.user.id;

        const data = await InstructorService.fetchProfiles(
            userId,
            req.query
        );

        return res.status(200).json({
            success: true,
            message: "Instructor profiles fetched successfully.",
            ...data,
        });
    });


    // FETCH PROFILE BY ID
    static fetchById = catchAsync(async (req: Request, res: Response) => {
        const { id } = req.params;

        if (!id) {
            throw new AppError("Invalid id", 400);
        }

        const data = await InstructorService.fetchById(id.toString());

        return res.status(200).json({
            success: true,
            message: "Instructor profile fetched successfully.",
            data,
        });
    });


    //FETCH SELF PROFILE
    static fetchMyProfile = catchAsync(async (req: Request, res: Response) => {

        const userId = req.user.id;

        const data = await InstructorService.fetchSelfProfile(userId);

        return res.status(200).json({ success: true, message: "Profile fetched successfully", data });
    });
}