import mongoose, { Document, Model, Schema, Types } from "mongoose";

export interface IProfile extends Document {
    userId: Types.ObjectId;
    avatar?: {
        imageUrl?: string;
        publicId?: string;
    };
    bio?: string;
    website?: string;
    linkedin?: string;
    github?: string;
    location?: {
        country?: string;
        city?: string;
    };
    createdAt: Date;
    updatedAt: Date;
}


const userProfileSchema: Schema<IProfile> = new Schema({

    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true,
        index: true,
    },

    avatar: {
        imageUrl: String,
        publicId: String,
    },

    bio: {
        type: String,
        maxlength: 2000,
        trim: true,
    },

    website: String,

    linkedin: String,

    github: String,

    location: {
        country: String,
        city: String,
    },

}, { timestamps: true });


export const UserProfile: Model<IProfile> = mongoose.models.UserProfile || mongoose.model<IProfile>("UserProfile", userProfileSchema);