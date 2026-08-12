import type { Request, Response } from "express";
import { catchAsync } from "../../shared/error/catchAsync.js";
import { CourseService } from "./course.service.js";
import { AppError } from "../../shared/error/appError.js";


export class CourseController {

    //ADD
    static addCourse = catchAsync(async (req: Request, res: Response) => {
        const data = await CourseService.createCourse(req.body, req.file);

        return res.status(201).json(data);
    });


    //UPDATE
    static updateCourse = catchAsync(async (req: Request, res: Response) => {
        const { id } = req.params;

        if (!id) {
            throw new AppError("Invalid id", 400);
        }

        const data = await CourseService.updateCourse(id.toString(), req.body, req.file);

        return res.status(200).json(data);
    });


    //TOGGLE COURSE (SOFT DELETE)
    static toggleCourse = catchAsync(async (req: Request, res: Response) => {
        const { id } = req.params;

        if (!id) {
            throw new AppError("Invalid id", 400);
        }

        const data = await CourseService.softDelete(id.toString());

        return res.status(200).json(data);
    });


    //HARD DELETE
    static deleteCourse = catchAsync(async (req: Request, res: Response) => {
        const { id } = req.params;

        if (!id) {
            throw new AppError("Invalid id", 400);
        }

        const data = await CourseService.deleteCourse(id.toString());

        return res.status(200).json(data);
    });


    //PUBLIC FETCH COURSE BY SLUG
    static getCourseBySlugPublic = catchAsync(async (req: Request, res: Response) => {
        const { slug } = req.params;

        if (!slug) {
            throw new AppError("Invalid slug", 400);
        }

        const data = await CourseService.fetchCourseFromPublicBySlug(slug.toString());

        return res.status(200).json(data);
    });


    //PUBLIC FETCH COURSE BY ID OR SLUG
    static getCourseByIdPublic = catchAsync(async (req: Request, res: Response) => {
        const id = req.params.id || req.params.slug || req.params.identifier;

        if (!id) {
            throw new AppError("Invalid identifier", 400);
        }

        const data = await CourseService.fetchCourseFromPublicById(id.toString());

        return res.status(200).json(data);
    });


    //PUBLIC FETCH ALL COURSES
    static getCoursesByPublicAll = catchAsync(async (req: Request, res: Response) => {
        const { page, limit } = req.query;

        const data = await CourseService.fetchAllFromPublic({
            page: page as string,
            limit: limit as string,
        });

        return res.status(200).json(data);
    });


    //FETCH UNFILTERED BY ID OR SLUG
    static fetchCourseById = catchAsync(async (req: Request, res: Response) => {
        const id = req.params.id || req.params.slug || req.params.identifier;

        if (!id) {
            throw new AppError("Invalid identifier", 400);
        }

        const data = await CourseService.fetchUnfilteredId(id.toString());

        return res.status(200).json(data);
    });


    //FETCH ALL UNFILTERED
    static fetchAllUnfiltered = catchAsync(async (req: Request, res: Response) => {
        const { page, limit } = req.query;

        const data = await CourseService.fetchAllUnfiltered({
            page: page as string,
            limit: limit as string,
        });

        return res.status(200).json(data);
    });

}