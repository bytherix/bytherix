import mongoose, { Document, Model, Schema, Types } from "mongoose";


export type IExpertise =
    | "Web Development"
    | "App Development"
    | "Game Development"
    | "Cybersecurity"
    | "Software Testing"
    | "IoT"
    | "Robotics"
    | "Graphic Design"
    | "UI/UX Design"
    | "Digital Marketing"
    | "Cloud Computing"
    | "DevOps"
    | "AI"
    | "Machine Learning"
    | "Data Science"
    | "Blockchain"
    | "Web3"
    | "Networking"
    | "Video Editing"
    | "Motion Graphics"
    | "Freelancing"
    | "Personal Branding"
    | "Research"
    | "Programming"
    | "Other";

export interface IInstructor extends Document {

    userId: Types.ObjectId;
    profileImage: {
        imageUrl: string;
        publicId: string;
    };
    headline: string;
    bio: string;
    expertise: IExpertise[];
    languages: string[];
    yearsOfExperience: number;
    education: {
        degree: string;
        institute: string;
        year: number;
    }[];
    website?: string;
    github?: string;
    linkedin?: string;
    isVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
}


const instructorSchema: Schema<IInstructor> = new Schema({

    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    profileImage: {
        imageUrl: String,
        publicId: String,
    },

    headline: {
        type: String,
        trim: true,
        maxlength: 150,
    },

    bio: {
        type: String,
        required: true,
        maxlength: 3000,
    },

    expertise: [{
        type: String,
        enum: [
            "Web Development",
            "App Development",
            "Game Development",
            "Cybersecurity",
            "Software Testing",
            "IoT",
            "Robotics",
            "Graphic Design",
            "UI/UX Design",
            "Digital Marketing",
            "Cloud Computing",
            "DevOps",
            "AI",
            "Machine Learning",
            "Data Science",
            "Blockchain",
            "Web3",
            "Networking",
            "Video Editing",
            "Motion Graphics",
            "Freelancing",
            "Personal Branding",
            "Research",
            "Programming",
            "Other",
        ],
    }],

    languages: [{
        type: String,
    }],

    yearsOfExperience: {
        type: Number,
    },

    education: [{
        degree: String,
        institute: String,
        year: Number,
    }],

    website: String,
    github: String,
    linkedin: String,

    isVerified: {
        type: Boolean,
        default: false,
    }

}, { timestamps: true });


export const Instructor: Model<IInstructor> = mongoose.models.Instructor || mongoose.model<IInstructor>("Instructor", instructorSchema);