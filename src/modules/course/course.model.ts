import mongoose, { Document, Model, Schema, Types } from "mongoose";

export interface IVideo extends Document {
    title: string;
    desc?: string;
    videoUrl: string;
    publicId: string;
    duration: number;
    order: number;
}

export interface IPlaylist extends Document {
    title: string;
    desc?: string;
    thumbnail: {
        imageUrl: string;
        publicId: string;
    };
    videos: IVideo[];
    order: number;
}

export interface ICourse extends Document {
    title: string;
    slug: string;
    desc: string;
    thumbnail: {
        imageUrl: string;
        publicId: string;
    };
    price: number;
    discountPrice: number;
    finalPrice: number;
    category: Types.ObjectId;
    instructor: string;
    level: "beginner" | "intermediate" | "expert";
    totalDuration: number;
    playlists: IPlaylist[];
    status: "draft" | "pending" | "published" | "rejected";
    isRemoved: boolean;
    isFree: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const videoSchema = new Schema<IVideo>({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    desc: {
        type: String,
        trim: true,
    },
    videoUrl: {
        type: String,
        required: true,
    },
    publicId: {
        type: String,
        required: true,
    },
    duration: {
        type: Number,
        required: true,
        min: 0,
    },
    order: {
        type: Number,
        required: true,
        min: 0,
    },
});

const playlistSchema = new Schema<IPlaylist>({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    desc: {
        type: String,
        trim: true,
    },
    thumbnail: {
        imageUrl: { type: String, required: true },
        publicId: { type: String, required: true },
    },
    videos: [videoSchema],
    order: {
        type: Number,
        required: true,
        min: 0,
    },
});

const courseSchema: Schema<ICourse> = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    slug: {
        type: String,
        unique: true,
        sparse: true,
        index: true,
        trim: true,
        lowercase: true,
    },
    desc: {
        type: String,
        required: true,
        trim: true,
    },
    thumbnail: {
        imageUrl: {
            type: String,
            required: true
        },
        publicId: {
            type: String,
            required: true
        },
    },
    price: {
        type: Number,
        min: 0,
    },
    discountPrice: {
        type: Number,
        min: 0,
    },
    finalPrice: {
      type: Number,
      min: 0,
    },
    isFree: {
      type: Boolean,
      default: false
    },
    category: {
        type: Types.ObjectId,
        ref: "Category",
        required: true,
    },
    instructor: {
        type: String,
        index: true,
        required: true,
    },
    level: {
        type: String,
        enum: ["beginner", "intermediate", "expert"],
        required: true,
    },
    totalDuration: {
        type: Number,
        min: 0,
        default: 0,
    },
    playlists: [playlistSchema],
    status: {
        type: String,
        enum: ["draft", "pending", "published", "rejected"],
        default: "draft",
    },
    isRemoved: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

// Pre-save hook to automatically set isFree based on finalPrice
courseSchema.pre('save', function(next: any) {
  // If finalPrice is 0, set isFree to true
  // If finalPrice is greater than 0, set isFree to false
  this.isFree = this.finalPrice === 0;
  next();
});

export const Course: Model<ICourse> = mongoose.models.Course || mongoose.model<ICourse>("Course", courseSchema);