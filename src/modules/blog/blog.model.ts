import mongoose, { Document, Model, Schema, Types } from "mongoose";

export type BlogStatus = "draft" | "published" | "archived";

export interface IBlog extends Document {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    coverImage?: string;
    author: Types.ObjectId;
    category: string;
    tags: string[];
    status: BlogStatus;
    publishedAt?: Date;
    views: number;
    seoTitle?: string;
    seoDescription?: string;
    createdAt: Date;
    updatedAt: Date;
}

const blogSchema: Schema<IBlog> = new Schema({
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    excerpt: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    coverImage: { type: String },

    author: { type: Schema.Types.ObjectId, ref: "User", required: true },

    category: { type: String, required: true, lowercase: true, trim: true },
    tags: [{ type: String, lowercase: true, trim: true }],

    status: { type: String, enum: ["draft", "published", "archived"], default: "draft" },
    publishedAt: { type: Date },

    views: { type: Number, default: 0 },

    seoTitle: { type: String },
    seoDescription: { type: String },
}, { timestamps: true });

blogSchema.index({ status: 1, publishedAt: -1 });
blogSchema.index({ category: 1 });
blogSchema.index({ tags: 1 });
blogSchema.index({ title: "text", content: "text" });

export const Blog: Model<IBlog> = mongoose.models.Blog || mongoose.model<IBlog>("Blog", blogSchema);