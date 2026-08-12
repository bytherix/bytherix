import mongoose, { Document, Model, Schema } from "mongoose";

export const INQUIRY_TYPES = [
    "service",
    "course",
    "partnership",
    "instructor",
    "marketplace",
    "general",
] as const;

export const CONTACT_INTERESTS = [
    "web-development",
    "app-development",
    "game-development",
    "cyber-security",
    "iot-robotics",
    "graphic-design",
    "digital-marketing",
    "ui-ux",
    "research",
] as const;

export const PREFERRED_CONTACT_TYPES = ["email", "phone", "whatsapp"] as const;
export const CONTACT_STATUSES = ["new", "contacted", "closed"] as const;

export type InquiryType = (typeof INQUIRY_TYPES)[number];
export type ContactInterest = (typeof CONTACT_INTERESTS)[number];
export type PreferredContactType = (typeof PREFERRED_CONTACT_TYPES)[number];
export type ContactStatus = (typeof CONTACT_STATUSES)[number];

export interface IContact extends Document {
    name: string;
    email: string;
    phone: string;
    company?: string;
    inquiryType: InquiryType;
    interest?: ContactInterest[];
    subject: string;
    message: string;
    preferredContact: PreferredContactType;
    status: ContactStatus;
    isRead: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const ContactSchema = new Schema<IContact>(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
            minlength: [2, "Name must be at least 2 characters"],
            maxlength: [100, "Name cannot exceed 100 characters"],
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
        },
        phone: {
            type: String,
            required: [true, "Phone number is required"],
            trim: true,
        },
        company: {
            type: String,
            trim: true,
            maxlength: [100, "Company name cannot exceed 100 characters"],
        },
        inquiryType: {
            type: String,
            enum: INQUIRY_TYPES,
            default: "general",
        },
        interest: [
            {
                type: String,
                enum: CONTACT_INTERESTS,
            },
        ],
        subject: {
            type: String,
            required: [true, "Subject is required"],
            trim: true,
            minlength: [5, "Subject must be at least 5 characters"],
            maxlength: [150, "Subject cannot exceed 150 characters"],
        },
        message: {
            type: String,
            required: [true, "Message is required"],
            trim: true,
            minlength: [10, "Message must be at least 10 characters"],
            maxlength: [5000, "Message cannot exceed 5000 characters"],
        },
        preferredContact: {
            type: String,
            enum: PREFERRED_CONTACT_TYPES,
            default: "email",
        },
        status: {
            type: String,
            enum: CONTACT_STATUSES,
            default: "new",
        },
        isRead: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

ContactSchema.index({ email: 1 });
ContactSchema.index({ inquiryType: 1 });
ContactSchema.index({ status: 1 });
ContactSchema.index({ createdAt: -1 });

export const Contact: Model<IContact> = mongoose.models.Contact || mongoose.model<IContact>("Contact", ContactSchema);