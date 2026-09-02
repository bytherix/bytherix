import { AppError } from "../../shared/error/appError.js";
import { getPagination, getPaginationMeta } from "../../shared/helper/pagination.js";
import { Blog, type IBlog } from "./blog.model.js";

function slugify(title: string): string {
    return title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
}

//PAYLOAD
class BlogPayload {
    public readonly title: string;
    public readonly excerpt: string;
    public readonly content: string;
    public readonly category: string;
    public readonly tags: string[];
    public readonly coverImage?: string;
    public readonly seoTitle?: string;
    public readonly seoDescription?: string;

    constructor(data: Partial<IBlog>) {
        if (!data || !data.title || !data.excerpt || !data.content || !data.category)
            throw new AppError("Please fill all the required fields", 400);

        this.title = data.title.trim();
        this.excerpt = data.excerpt.trim();
        this.content = data.content;
        this.category = data.category.toLowerCase().trim();
        this.tags = Array.isArray(data.tags) ? data.tags.map(t => t.toLowerCase().trim()) : [];
        this.coverImage = data.coverImage;
        this.seoTitle = data.seoTitle;
        this.seoDescription = data.seoDescription;
    }
}

export class BlogService {

    //CREATE
    static async createBlog(data: IBlog, authorId: string) {
        const input = new BlogPayload(data);

        let slug = slugify(input.title);
        if (await Blog.findOne({ slug })) slug = `${slug}-${Date.now()}`;

        const blog = await Blog.create({ ...input, slug, author: authorId });
        return blog;
    }

    //UPDATE
    static async updateBlog(id: string, data: Partial<IBlog>) {
        const blog = await Blog.findById(id);
        if (!blog) throw new AppError("Blog not found", 404);

        const updateData: any = { ...data };

        if (data.title) {
            let slug = slugify(data.title);
            const dup = await Blog.findOne({ slug, _id: { $ne: id } });
            if (dup) slug = `${slug}-${Date.now()}`;
            updateData.slug = slug;
        }

        const updated = await Blog.findByIdAndUpdate(id, { $set: updateData }, { new: true, runValidators: true });
        return updated;
    }

    //PUBLISH
    static async publishBlog(id: string) {
        const blog = await Blog.findByIdAndUpdate(
            id,
            { $set: { status: "published", publishedAt: new Date() } },
            { new: true },
        );
        if (!blog) throw new AppError("Blog not found", 404);
        return blog;
    }

    //DELETE
    static async deleteBlog(id: string) {
        const blog = await Blog.findByIdAndDelete(id);
        if (!blog) throw new AppError("Blog not found", 404);
        return blog.title;
    }

    //FETCH ALL (admin — all statuses)
    static async getAllBlogs(query: { page?: number | string; limit?: number | string; status?: string; category?: string }) {
        const { page, limit, skip } = getPagination(query);

        const filter: any = {};
        if (query.status) filter.status = query.status;
        if (query.category) filter.category = query.category;

        const [blogs, total] = await Promise.all([
            Blog.find(filter).populate("author", "firstName lastName avatar").sort({ createdAt: -1 }).skip(skip).limit(limit),
            Blog.countDocuments(filter),
        ]);

        return { data: blogs, pagination: getPaginationMeta({ total, page, limit }) };
    }

    //FETCH PUBLISHED (public)
    static async getPublishedBlogs(query: { page?: number | string; limit?: number | string; category?: string; tag?: string; search?: string }) {
        const { page, limit, skip } = getPagination(query);

        const filter: any = { status: "published" };
        if (query.category) filter.category = query.category;
        if (query.tag) filter.tags = query.tag;
        if (query.search) filter.$text = { $search: query.search };

        const [blogs, total] = await Promise.all([
            Blog.find(filter).populate("author", "firstName lastName avatar").sort({ publishedAt: -1 }).skip(skip).limit(limit),
            Blog.countDocuments(filter),
        ]);

        return { data: blogs, pagination: getPaginationMeta({ total, page, limit }) };
    }

    //FETCH BY ID (admin)
    static async getBlogById(id: string) {
        const blog = await Blog.findById(id).populate("author", "firstName lastName avatar");
        if (!blog) throw new AppError("Blog not found", 404);
        return blog;
    }

    //FETCH BY SLUG (public, increments views)
    static async getBlogBySlug(slug: string) {
        const blog = await Blog.findOneAndUpdate(
            { slug, status: "published" },
            { $inc: { views: 1 } },
            { new: true },
        ).populate("author", "firstName lastName avatar");

        if (!blog) throw new AppError("Blog not found", 404);
        return blog;
    }
}