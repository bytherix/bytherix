import type { Request, Response } from "express";
import { catchAsync } from "../../shared/error/catchAsync.js";
import { BlogService } from "./blog.service.js";
import { AppError } from "../../shared/error/appError.js";

export class BlogController {

    //ADD-BLOG
    static addBlog = catchAsync(async (req: Request, res: Response) => {
        const authorId = (req as any).user._id;
        const blog = await BlogService.createBlog(req.body, authorId);
        return res.status(201).json({ success: true, message: "Blog created successfully", data: blog });
    });

    //UPDATE-BLOG
    static updateBlog = catchAsync(async (req: Request, res: Response) => {
        const { id } = req.params;
        if (!id) throw new AppError("Invalid id", 400);

        const blog = await BlogService.updateBlog(id.toString(), req.body);
        return res.status(200).json({ success: true, message: "Blog updated successfully", data: blog });
    });

    //PUBLISH-BLOG
    static publishBlog = catchAsync(async (req: Request, res: Response) => {
        const { id } = req.params;
        if (!id) throw new AppError("Invalid id", 400);

        const blog = await BlogService.publishBlog(id.toString());
        return res.status(200).json({ success: true, message: "Blog published successfully", data: blog });
    });

    //DELETE-BLOG
    static deleteBlog = catchAsync(async (req: Request, res: Response) => {
        const { id } = req.params;
        if (!id) throw new AppError("Invalid id", 400);

        const title = await BlogService.deleteBlog(id.toString());
        return res.status(200).json({ success: true, message: `${title} deleted successfully` });
    });

    //FETCH-ALL (admin)
    static fetchAllBlogs = catchAsync(async (req: Request, res: Response) => {
        const result = await BlogService.getAllBlogs(req.query as any);
        return res.status(200).json({ success: true, message: "Blogs fetched successfully", data: result.data, pagination: result.pagination });
    });

    //FETCH-PUBLISHED (public)
    static fetchPublishedBlogs = catchAsync(async (req: Request, res: Response) => {
        const result = await BlogService.getPublishedBlogs(req.query as any);
        return res.status(200).json({ success: true, message: "Blogs fetched successfully", data: result.data, pagination: result.pagination });
    });

    //FETCH-BY-ID (admin)
    static fetchBlogById = catchAsync(async (req: Request, res: Response) => {
        const { id } = req.params;
        if (!id) throw new AppError("Invalid id", 400);

        const blog = await BlogService.getBlogById(id.toString());
        return res.status(200).json({ success: true, message: "Blog fetched successfully", data: blog });
    });

    //FETCH-BY-SLUG (public)
    static fetchBlogBySlug = catchAsync(async (req: Request, res: Response) => {
        const { slug } = req.params;
        if (!slug) throw new AppError("Invalid slug", 400);

        const blog = await BlogService.getBlogBySlug(slug.toString());
        return res.status(200).json({ success: true, message: "Blog fetched successfully", data: blog });
    });
}