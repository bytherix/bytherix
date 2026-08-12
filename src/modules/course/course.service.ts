import { AppError } from "../../shared/error/appError.js";
import { deleteImage, uploadImage } from "../../shared/helper/fileHandler.js";
import { getPagination, getPaginationMeta, type PaginationQuery } from "../../shared/helper/pagination.js";
import { CategoryService } from "../category/category.service.js";
import { Course, type ICourse, type IPlaylist, type IVideo } from "./course.model.js";
import { generateUniqueSlug } from "./course.slug.js";
import { PlaylistService } from "./playlist.service.js";
import mongoose from "mongoose";


export class CourseService {

    //CREATE
    static async createCourse(data: Partial<ICourse>, file: any) {

        const { title, desc, price, discountPrice, instructor, level, totalDuration, category, status } = data;

        let parsedPlaylists: IPlaylist[] = [];
        if ((data as any).playlists) {
            if (typeof (data as any).playlists === "string") {
                try {
                    parsedPlaylists = JSON.parse((data as any).playlists);
                } catch {
                    parsedPlaylists = [];
                }
            } else if (Array.isArray((data as any).playlists)) {
                parsedPlaylists = (data as any).playlists;
            }
        }

        const calculatedDuration = parsedPlaylists.reduce((acc: number, p: any) => {
            const videoSum = (p.videos || []).reduce((vAcc: number, v: any) => vAcc + (Number(v.duration) || 0), 0);
            return acc + videoSum;
        }, 0);

        const initialDuration = (totalDuration !== undefined && totalDuration !== null) ? Number(totalDuration) : calculatedDuration;

        if (!title || !desc || price === undefined || discountPrice === undefined || !instructor || !level || !category || !file) {
            throw new AppError("Please fill all the required fields", 400);
        }

        const numPrice = Number(price);
        const numDiscountPrice = Number(discountPrice);

        if (numDiscountPrice > numPrice) {
            throw new AppError("Discount price cannot be greater than price.", 400);
        }

        const validateCat = await CategoryService.getCatId(category.toString());

        let imageData: any = { imageUrl: "", publicId: "" };

        if (file) {
            const upload = await uploadImage(file.path);
            imageData = { imageUrl: upload.secure_url, publicId: upload.public_id };
        }

        const slug = await generateUniqueSlug(title);
        const finalPrice = numDiscountPrice > 0 ? numDiscountPrice : numPrice;

        const newCourse = await Course.create({
            title,
            desc,
            price: numPrice,
            discountPrice: numDiscountPrice,
            finalPrice,
            instructor,
            level,
            totalDuration: initialDuration,
            category: validateCat._id,
            thumbnail: imageData,
            playlists: parsedPlaylists,
            slug,
            status: status || "draft",
        });

        return {
            success: true,
            message: "Course added successfully",
            data: {
                id: newCourse._id,
                title: newCourse.title,
                slug: newCourse.slug,
                desc: newCourse.desc,
                price: newCourse.price,
                discountPrice: newCourse.discountPrice,
                finalPrice: newCourse.finalPrice,
                category: newCourse.category,
                instructor: newCourse.instructor,
                level: newCourse.level,
                totalDuration: newCourse.totalDuration,
                playlists: newCourse.playlists,
                thumbnail: newCourse.thumbnail?.imageUrl,
                status: newCourse.status,
                isRemoved: newCourse.isRemoved,
                createdAt: newCourse.createdAt,
                updatedAt: newCourse.updatedAt,
            }
        };
    };


    //UPDATE
    static async updateCourse(id: string, data: Partial<ICourse>, file: any) {

        const course = await Course.findById(id);

        if (!course) {
            throw new AppError("Course not found", 404);
        }

        const {
            title,
            desc,
            price,
            discountPrice,
            instructor,
            level,
            totalDuration,
            category,
            status,
        } = data;

        const updateData: Partial<ICourse> = {};

        if (title?.trim()) {
            updateData.title = title.trim();

            if (title.trim() !== course.title) {
                updateData.slug = await generateUniqueSlug(title.trim());
            }
        }

        if (desc?.trim()) {
            updateData.desc = desc.trim();
        }

        if (price !== undefined) {
            updateData.price = price;
        }

        if (discountPrice !== undefined) {
            updateData.discountPrice = discountPrice;
        }

        if (instructor?.trim()) {
            updateData.instructor = instructor.trim();
        }

        if (level) {
            updateData.level = level;
        }

        if (totalDuration !== undefined) {
            updateData.totalDuration = totalDuration;
        }

        if (category) {
            const validateCategory = await CategoryService.getCatId(category.toString());
            updateData.category = validateCategory._id;
        }

        if (status) {
            updateData.status = status;
        }

        if ((data as any).playlists !== undefined) {
            let parsedPlaylists: IPlaylist[] = [];
            if (typeof (data as any).playlists === "string") {
                try {
                    parsedPlaylists = JSON.parse((data as any).playlists);
                } catch {
                    parsedPlaylists = course.playlists;
                }
            } else if (Array.isArray((data as any).playlists)) {
                parsedPlaylists = (data as any).playlists;
            }
            updateData.playlists = parsedPlaylists;
        }

        const currentPrice = updateData.price !== undefined ? Number(updateData.price) : Number(course.price);
        const currentDiscountPrice = updateData.discountPrice !== undefined ? Number(updateData.discountPrice) : Number(course.discountPrice);

        if (
            currentPrice !== undefined &&
            currentDiscountPrice !== undefined &&
            currentDiscountPrice > currentPrice
        ) {
            throw new AppError(
                "Discount price cannot be greater than price.",
                400
            );
        }

        if (currentPrice !== undefined) {
            updateData.finalPrice = (currentDiscountPrice !== undefined && currentDiscountPrice > 0) ? currentDiscountPrice : currentPrice;
        }

        // Upload new image
        let oldPublicId: string | undefined;

        if (file) {
            const upload = await uploadImage(file.path);

            updateData.thumbnail = {
                imageUrl: upload.secure_url,
                publicId: upload.public_id,
            };

            oldPublicId = course.thumbnail?.publicId;
        }

        const updatedCourse = await Course.findByIdAndUpdate(
            id,
            { $set: updateData },
            {
                new: true,
                runValidators: true,
            }
        );

        if ((data as any).playlists !== undefined) {
            await PlaylistService.recalculateDuration(id);
        }

        // Delete old image only after successful DB update
        if (oldPublicId) {
            await deleteImage(oldPublicId);
        }

        return {
            success: true,
            message: `${updatedCourse!.title} updated successfully`,
            data: {
                id: updatedCourse!._id,
                title: updatedCourse!.title,
                slug: updatedCourse!.slug,
                desc: updatedCourse!.desc,
                price: updatedCourse!.price,
                discountPrice: updatedCourse!.discountPrice,
                finalPrice: updatedCourse!.finalPrice,
                category: updatedCourse!.category,
                instructor: updatedCourse!.instructor,
                level: updatedCourse!.level,
                totalDuration: updatedCourse!.totalDuration,
                playlists: updatedCourse!.playlists,
                thumbnail: updatedCourse!.thumbnail?.imageUrl,
                status: updatedCourse!.status,
                isRemoved: updatedCourse!.isRemoved,
                createdAt: updatedCourse!.createdAt,
                updatedAt: updatedCourse!.updatedAt,
            },
        };
    }


    // TOGGLE COURSE REMOVE (SOFT DELETE)
    static async softDelete(id: string) {
        const course = await Course.findById(id);

        if (!course) {
            throw new AppError("Course not found", 404);
        }

        const updatedCourse = await Course.findByIdAndUpdate(
            id,
            { isRemoved: !course.isRemoved },
            { new: true }
        );

        return {
            success: true,
            message: updatedCourse!.isRemoved ? "Course removed successfully." : "Course restored successfully.",
            data: updatedCourse,
        };
    }


    //HARD DELETE
    static async deleteCourse(id: string) {
        const course = await Course.findByIdAndDelete(id);

        if (!course) {
            throw new AppError("Course not found", 404);
        }

        if (course.thumbnail?.publicId) {
            await deleteImage(course.thumbnail?.publicId);
        }

        return {
            success: true,
            message: `${course.title} deleted successfully`,
            data: course
        };
    };


    //FETCH BY SLUG (PUBLIC)
    static async fetchCourseFromPublicBySlug(slug: string) {
        const course = await Course.findOne({ slug: slug.toLowerCase(), isRemoved: false, status: "published" }).populate("category", "name");

        if (!course) {
            throw new AppError("Course not found", 404);
        }

        return {
            success: true,
            message: `${course.title} fetched successfully`,
            data: {
                id: course._id,
                desc: course.desc,
                title: course.title,
                slug: course.slug,
                price: course.price,
                discountPrice: course.discountPrice,
                finalPrice: course.finalPrice,
                category: (course.category as any)?.name,
                instructor: course.instructor,
                totalDuration: course.totalDuration,
                playlists: course.playlists,
                thumbnail: course.thumbnail?.imageUrl,
                level: course.level,
                status: course.status,
                createdAt: course.createdAt,
            }
        };
    }


    //FETCH BY ID OR SLUG (PUBLIC)
    static async fetchCourseFromPublicById(identifier: string) {
        let filter: any = { isRemoved: false, status: "published" };

        if (mongoose.Types.ObjectId.isValid(identifier)) {
            filter._id = identifier;
        } else {
            filter.slug = identifier.toLowerCase();
        }

        let course = await Course.findOne(filter).populate("category", "name");

        if (!course && filter._id) {
            course = await Course.findOne({ slug: identifier.toLowerCase(), isRemoved: false, status: "published" }).populate("category", "name");
        }

        if (!course) {
            throw new AppError("Course not found", 404);
        }

        return {
            success: true,
            message: `${course.title} fetched successfully`,
            data: {
                id: course._id,
                desc: course.desc,
                title: course.title,
                slug: course.slug,
                price: course.price,
                discountPrice: course.discountPrice,
                finalPrice: course.finalPrice,
                category: (course.category as any)?.name,
                instructor: course.instructor,
                totalDuration: course.totalDuration,
                playlists: course.playlists,
                thumbnail: course.thumbnail?.imageUrl,
                level: course.level,
                status: course.status,
                createdAt: course.createdAt,
            }
        };
    }


    //FETCH ALL (PUBLIC)
    static async fetchAllFromPublic(query: PaginationQuery) {
        const { page, limit, skip } = getPagination(query);

        const filter = {
            isRemoved: false,
            status: "published",
        } as const;

        const [courses, total] = await Promise.all([
            Course.find(filter)
                .populate("category", "name")
                .skip(skip)
                .limit(limit),
            Course.countDocuments(filter),
        ]);

        if (courses.length === 0) {
            throw new AppError("Courses not available", 404);
        }

        return {
            success: true,
            message: "Courses fetched successfully",
            data: courses.map((course) => ({
                id: course._id,
                desc: course.desc,
                title: course.title,
                slug: course.slug,
                price: course.price,
                discountPrice: course.discountPrice,
                finalPrice: course.finalPrice,
                category: (course.category as any)?.name,
                instructor: course.instructor,
                totalDuration: course.totalDuration,
                thumbnail: course.thumbnail?.imageUrl,
                level: course.level,
                status: course.status,
            })),
            meta: getPaginationMeta({
                total,
                page,
                limit,
            }),
        };
    };


    //FETCH BY ID OR SLUG (MOD & ADMINS)
    static async fetchUnfilteredId(identifier: string) {
        let course;
        if (mongoose.Types.ObjectId.isValid(identifier)) {
            course = await Course.findById(identifier).populate("category", "name");
        }

        if (!course) {
            course = await Course.findOne({ slug: identifier.toLowerCase() }).populate("category", "name");
        }

        if (!course) {
            throw new AppError("Course not found", 404);
        }

        return {
            success: true,
            message: "Course fetched successfully",
            data: {
                id: course._id,
                desc: course.desc,
                title: course.title,
                slug: course.slug,
                price: course.price,
                discountPrice: course.discountPrice,
                finalPrice: course.finalPrice,
                category: (course.category as any)?.name,
                instructor: course.instructor,
                totalDuration: course.totalDuration,
                playlists: course.playlists,
                thumbnail: course.thumbnail?.imageUrl,
                level: course.level,
                isRemoved: course.isRemoved,
                status: course.status,
                createdAt: course.createdAt,
                updatedAt: course.updatedAt,
            }
        };
    }


    //FETCH ALL UNFILTERED
    static async fetchAllUnfiltered(query: PaginationQuery) {
        const { page, limit, skip } = getPagination(query);

        const [courses, total] = await Promise.all([
            Course.find()
                .populate("category", "name")
                .skip(skip)
                .limit(limit),
            Course.countDocuments(),
        ]);

        if (courses.length === 0) {
            throw new AppError("Courses not available", 404);
        }

        return {
            success: true,
            message: "Courses fetched successfully",
            data: courses.map((course) => ({
                id: course._id,
                desc: course.desc,
                title: course.title,
                slug: course.slug,
                price: course.price,
                discountPrice: course.discountPrice,
                finalPrice: course.finalPrice,
                category: (course.category as any)?.name,
                instructor: course.instructor,
                totalDuration: course.totalDuration,
                thumbnail: course.thumbnail?.imageUrl,
                level: course.level,
                isRemoved: course.isRemoved,
                status: course.status,
                createdAt: course.createdAt,
                updatedAt: course.updatedAt,
            })),
            meta: getPaginationMeta({
                total,
                page,
                limit,
            }),
        };
    }

}