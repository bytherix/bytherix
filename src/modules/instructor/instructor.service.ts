import { AppError } from "../../shared/error/appError.js";
import { deleteImage, uploadImage } from "../../shared/helper/fileHandler.js";
import { getPagination, getPaginationMeta, type PaginationQuery } from "../../shared/helper/pagination.js";
import { Instructor, type IInstructor } from "./instructor.model.js";


export class InstructorService {

    //ADD DETAILS
    static async addDetails(userId: string, data: Partial<IInstructor>, file?: any) {
        const existingInstructor = await Instructor.findOne({ userId });

        if (existingInstructor) {
            throw new AppError("Instructor profile already exists.", 400);
        }

        const {
            headline,
            bio,
            expertise,
            languages,
            yearsOfExperience,
            education,
            website,
            github,
            linkedin,
        } = data;

        if (!headline || !bio || !Array.isArray(expertise) || expertise.length === 0) {
            throw new AppError("Please fill all required fields.", 400);
        }

        let imageData = {
            imageUrl: "",
            publicId: "",
        };


        if (file) {
            const upload = await uploadImage(file.path);

            imageData = {
                imageUrl: upload.secure_url,
                publicId: upload.public_id,
            };
        }

        const instructor = await Instructor.create({
            userId,
            profileImage: imageData,
            headline,
            bio,
            expertise,
            languages,
            yearsOfExperience,
            education,
            website,
            github,
            linkedin,
            isVerified: false,
        });

        return {
            id: instructor._id,
            userId: instructor.userId,
            profileImage: instructor.profileImage,
            headline: instructor.headline,
            bio: instructor.bio,
            expertise: instructor.expertise,
            languages: instructor.languages,
            yearsOfExperience: instructor.yearsOfExperience,
            education: instructor.education,
            website: instructor.website,
            github: instructor.github,
            linkedin: instructor.linkedin,
            isVerified: instructor.isVerified,
            createdAt: instructor.createdAt,
            updatedAt: instructor.updatedAt,
        };
    }


    //UPDATE DETAILS
    static async updateSelfDetails(userId: string, data: Partial<IInstructor>, file?: any) {
        const findProfile = await Instructor.findOne({ userId });

        if (!findProfile) {
            throw new AppError("Profile not found", 404);
        }

        const {
            headline,
            bio,
            expertise,
            languages,
            yearsOfExperience,
            education,
            website,
            github,
            linkedin,
        } = data;

        const updateData: Partial<IInstructor> = {};

        if (headline !== undefined) updateData.headline = headline;
        if (bio !== undefined) updateData.bio = bio;
        if (expertise !== undefined) updateData.expertise = expertise;
        if (languages !== undefined) updateData.languages = languages;
        if (yearsOfExperience !== undefined)
            updateData.yearsOfExperience = yearsOfExperience;
        if (education !== undefined) updateData.education = education;
        if (website !== undefined) updateData.website = website;
        if (github !== undefined) updateData.github = github;
        if (linkedin !== undefined) updateData.linkedin = linkedin;

        if (file) {
            // Delete old image only when a new one is uploaded
            if (findProfile.profileImage?.publicId) {
                await deleteImage(findProfile.profileImage.publicId);
            }

            const upload = await uploadImage(file.path);

            updateData.profileImage = {
                imageUrl: upload.secure_url,
                publicId: upload.public_id,
            };
        }

        const updatedProfile = await Instructor.findOneAndUpdate({ userId }, { $set: updateData }, {
            new: true, runValidators: true
        }
        );

        return {
            id: updatedProfile!._id,
            userId: updatedProfile!.userId,
            profileImage: updatedProfile!.profileImage,
            headline: updatedProfile!.headline,
            bio: updatedProfile!.bio,
            expertise: updatedProfile!.expertise,
            languages: updatedProfile!.languages,
            yearsOfExperience: updatedProfile!.yearsOfExperience,
            education: updatedProfile!.education,
            website: updatedProfile!.website,
            github: updatedProfile!.github,
            linkedin: updatedProfile!.linkedin,
            isVerified: updatedProfile!.isVerified,
            createdAt: updatedProfile!.createdAt,
            updatedAt: updatedProfile!.updatedAt,
        };
    }


    //FETCH SELF PROFILE
    static async fetchSelfProfile(userId: string) {

        const profile = await Instructor.findOne({ userId });

        if (!profile) {
            throw new AppError("Profile not found", 404);
        }

        return {
            id: profile._id,
            userId: profile.userId,
            profileImage: profile.profileImage,
            headline: profile.headline,
            bio: profile.bio,
            expertise: profile.expertise,
            languages: profile.languages,
            yearsOfExperience: profile.yearsOfExperience,
            education: profile.education,
            website: profile.website,
            github: profile.github,
            linkedin: profile.linkedin,
            isVerified: profile.isVerified,
            createdAt: profile.createdAt,
            updatedAt: profile.updatedAt,
        };

    }


    //TOGGLE VERIFICATION (ADMIN AND MODS)
    static async toggleVerification(id: string) {
        const instructor = await Instructor.findById(id);

        if (!instructor) {
            throw new AppError("Instructor not found", 404);
        }

        const updated = await Instructor.findByIdAndUpdate(id, { isVerified: !instructor.isVerified }, {
            new: true, runValidators: true
        }
        );

        if (!updated) {
            throw new AppError("Instructor not found", 404);
        }

        return {
            id: updated._id,
            userId: updated.userId,
            profileImage: updated.profileImage,
            headline: updated.headline,
            bio: updated.bio,
            expertise: updated.expertise,
            languages: updated.languages,
            yearsOfExperience: updated.yearsOfExperience,
            education: updated.education,
            website: updated.website,
            github: updated.github,
            linkedin: updated.linkedin,
            isVerified: updated.isVerified,
            createdAt: updated.createdAt,
            updatedAt: updated.updatedAt,
        };
    }


    // FETCH ALL PROFILES
    static async fetchProfiles(userId: string, query: PaginationQuery) {
        const { page, limit, skip } = getPagination(query);

        const [profiles, total] = await Promise.all([
            Instructor.find()
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Instructor.countDocuments(),
        ]);

        if (profiles.length === 0) {
            throw new AppError("No instructor profiles found.", 404);
        }

        return {
            data: profiles.map((profile) => ({
                id: profile._id,
                userId: profile.userId,
                profileImage: profile.profileImage,
                headline: profile.headline,
                bio: profile.bio,
                expertise: profile.expertise,
                languages: profile.languages,
                yearsOfExperience: profile.yearsOfExperience,
                education: profile.education,
                website: profile.website,
                github: profile.github,
                linkedin: profile.linkedin,
                isVerified: profile.isVerified,
            })),
            meta: getPaginationMeta({
                total, page, limit
            })
        };
    };


    //FETCH BY ID
    static async fetchById(id: string) {

        const profile = await Instructor.findById(id);

        if (!profile) {
            throw new AppError("Profile not found", 404);
        }

        return {
            id: profile._id,
            userId: profile.userId,
            profileImage: profile.profileImage,
            headline: profile.headline,
            bio: profile.bio,
            expertise: profile.expertise,
            languages: profile.languages,
            yearsOfExperience: profile.yearsOfExperience,
            education: profile.education,
            website: profile.website,
            github: profile.github,
            linkedin: profile.linkedin,
            isVerified: profile.isVerified,
        }
    };


    //SEARCH INSTRUCTOR ID
    static async searchByInstructorId(id: string) {
        const instructor = await Instructor.findById(id).populate("userId");

        if (!instructor) {
            throw new AppError("Instructor not found", 404);
        }

        return instructor;
    }
}
