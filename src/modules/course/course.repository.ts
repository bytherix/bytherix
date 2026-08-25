import { AppError } from "../../shared/error/appError.js";
import { deleteImage, uploadImage } from "../../shared/helper/fileHandler.js";
import { getPagination, getPaginationMeta, type PaginationQuery } from "../../shared/helper/pagination.js";
import { getCatById } from "../category/index.js";
import { Course, type ICourse, type IPlaylist } from "./course.model.js";
import { generateUniqueSlug } from "./course.slug.js";
import { PlaylistService } from "./playlist.service.js";
import mongoose from "mongoose";
import type { CreateCourseInput, UpdateCourseInput, CourseLevel, CourseStatus } from "./dto.js";

export class CourseRepository {
  // CREATE
  static async create(data: CreateCourseInput, file: any) {
    const { title, desc, price, discountPrice, instructor, level, totalDuration, category, status, playlists, isFree } = data;

    // Validate enum values
    if (level && !['beginner', 'intermediate', 'expert'].includes(level)) {
      throw new AppError("Invalid level", 400);
    }
    const validatedStatus = status && !['draft', 'pending', 'published', 'rejected'].includes(status)
      ? (() => { throw new AppError("Invalid status", 400); })()
      : (status || "draft");

    let parsedPlaylists: IPlaylist[] = playlists || [];
    if (typeof parsedPlaylists === "string") {
      try {
        parsedPlaylists = JSON.parse(parsedPlaylists);
      } catch {
        parsedPlaylists = [];
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

    const validateCat = await getCatById(category.toString());

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
      level: level as CourseLevel,
      totalDuration: initialDuration,
      category: new mongoose.Types.ObjectId(validateCat.id),
      thumbnail: imageData,
      playlists: parsedPlaylists,
      slug,
      status: validatedStatus as CourseStatus,
      isFree: isFree ?? false
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
  }

  // UPDATE
  static async update(id: string, data: UpdateCourseInput, file: any) {
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
      playlists,
      isFree
    } = data;

    // Validate enum values if provided
    if (level && !['beginner', 'intermediate', 'expert'].includes(level)) {
      throw new AppError("Invalid level", 400);
    }
    const validatedStatus = status && !['draft', 'pending', 'published', 'rejected'].includes(status)
      ? (() => { throw new AppError("Invalid status", 400); })()
      : (status || course.status);

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
      const validateCat = await getCatById(category.toString());
      updateData.category = new mongoose.Types.ObjectId(validateCat.id);
    }

    if (status) {
      updateData.status = status;
    }
    if (isFree !== undefined) {
      updateData.isFree = isFree;
    }

    if (playlists !== undefined) {
      let parsedPlaylists: IPlaylist[] = [];
      if (typeof playlists === "string") {
        try {
          parsedPlaylists = JSON.parse(playlists);
        } catch {
          parsedPlaylists = course.playlists;
        }
      } else if (Array.isArray(playlists)) {
        parsedPlaylists = playlists;
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

    if (playlists !== undefined) {
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

  // DELETE (SOFT)
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

  // DELETE (HARD)
  static async delete(id: string) {
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
  }

  // FETCH BY SLUG (PUBLIC)
  static async fetchBySlugPublic(slug: string) {
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
        isFree: course.isFree,
      }
    };
  }

  // FETCH BY ID OR SLUG (PUBLIC)
  static async fetchByIdOrSlugPublic(identifier: string) {
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
        isFree: course.isFree,
      }
    };
  }

  // FETCH ALL (PUBLIC)
  static async fetchAllPublic(query: PaginationQuery) {
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
        isFree: course.isFree,
      })),
      meta: getPaginationMeta({
        total,
        page,
        limit,
      }),
    };
  }

  // FETCH BY ID OR SLUG (MOD & ADMINS)
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
        isFree: course.isFree,
        createdAt: course.createdAt,
        updatedAt: course.updatedAt,
      }
    };
  }

  // FETCH ALL UNFILTERED
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
        isFree: course.isFree,
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