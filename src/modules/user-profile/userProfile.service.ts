import { AppError } from "../../shared/error/appError.js";
import { deleteImage, uploadImage } from "../../shared/helper/fileHandler.js";
import type { IProfileDTO } from "./userProfile.dto.js";
import { UserProfile } from "./userProfile.model.js";
import mongoose from "mongoose";

export class UserProfileService {

    // ADD OR UPDATE INFORMATION
    static async createOrUpdateProfile(
        userId: string,
        data: IProfileDTO,
        file?: Express.Multer.File
    ) {
        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            throw new AppError("Invalid or missing user ID", 400);
        }

        let existingProfile = null;
        let avatar;

        if (file) {
            existingProfile = await UserProfile.findOne({ userId });
            const upload = await uploadImage(file.path);
            avatar = {
                imageUrl: upload.secure_url,
                publicId: upload.public_id,
            };
        }

        const profileData: any = {};
        if (data.bio !== undefined) profileData.bio = data.bio;
        if (data.website !== undefined) profileData.website = data.website;
        if (data.linkedin !== undefined) profileData.linkedin = data.linkedin;
        if (data.github !== undefined) profileData.github = data.github;

        if (data.location) {
            profileData.location = {};
            if (data.location.country !== undefined) profileData.location.country = data.location.country;
            if (data.location.city !== undefined) profileData.location.city = data.location.city;
        }
        if (avatar) {
            profileData.avatar = avatar;
        }

        let updatedProfile;
        try {
            updatedProfile = await UserProfile.findOneAndUpdate(
                { userId },
                { $set: profileData },
                {
                    new: true,
                    upsert: true,
                    runValidators: true,
                }
            );
        } catch (error) {
            if (avatar?.publicId) {
                await deleteImage(avatar.publicId).catch(() => { });
            }
            throw error;
        }

        if (file && existingProfile?.avatar?.publicId && existingProfile.avatar.publicId !== updatedProfile.avatar?.publicId) {
            try {
                await deleteImage(existingProfile.avatar.publicId);
            } catch (err) {
                console.warn(`Failed to delete old avatar ${existingProfile.avatar.publicId} from Cloudinary:`, err);
            }
        }

        return updatedProfile;
    }

    // FETCH PROFILE (ME)
    static async getMyProfile(userId: string) {
        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            throw new AppError("Invalid or missing user ID", 400);
        }

        const profile = await UserProfile.findOne({ userId }).populate("userId", "fullName");

        if (!profile) {
            throw new AppError("Profile not found", 404);
        }

        return profile;
    }

    // FETCH PROFILE PUBLIC
    static async getProfileById(userId: string) {
        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            throw new AppError("Invalid User ID", 400);
        }

        const profile = await UserProfile.findOne({ userId }).populate("userId", "fullName");

        if (!profile) {
            throw new AppError("User profile not found", 404);
        }

        return profile;
    }
}
