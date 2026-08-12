import type { Response } from "express";
import { catchAsync } from "../../shared/error/catchAsync.js";
import { UserProfileService } from "./userProfile.service.js";
import { AppError } from "../../shared/error/appError.js";
import type { AuthenticatedRequest } from "../../shared/middlewares/auth.js";

export class UserProfileController {

    // PROFILE ADD OR UPDATE
    static profileInfo = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
        const userId = req.user?.id;
        if (!userId) {
            throw new AppError("Unauthorized access", 401);
        }

        const data = await UserProfileService.createOrUpdateProfile(userId, req.body, req.file);

        return res.status(200).json({ success: true, message: "Profile saved successfully", data });
    });


    // FETCH OWN PROFILE
    static myProfile = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
        const userId = req.user?.id;
        if (!userId) {
            throw new AppError("Unauthorized access", 401);
        }

        const data = await UserProfileService.getMyProfile(userId);

        return res.status(200).json({ success: true, message: "Profile fetched successfully", data });
    });


    // FETCH PROFILE BY ID
    static fetchProfileById = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
        const { id } = req.params;

        if (!id) {
            throw new AppError("Invalid id", 400);
        }

        const data = await UserProfileService.getProfileById(id.toString());

        return res.status(200).json({ success: true, message: "Profile fetched successfully", data });
    });
}
