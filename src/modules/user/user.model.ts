import mongoose, { Document, Model, Schema, Types } from "mongoose";

export interface IUser extends Document {
    fullName: string;
    email: string;
    password: string;
    phone: string;
    roleId: Types.ObjectId;
    allowedPermissions: Types.ObjectId[];
    deniedPermissions: Types.ObjectId[];
    isVerified: boolean;
    verificationSentAt?: Date;
    provider: "local" | "google";
    createdAt: Date;
    updatedAt: Date;
}

export const userSchema: Schema<IUser> = new Schema({
    fullName: {
        type: String,
        required: true,
        trim: true,
    },

    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        trim: true
    },

    password: {
        type: String,
        required: function (this: any) {
            return this.provider === "local";
        },
        minlength: 6,
        select: false
    },

    phone: {
        type: String,
        required: function (this: any) {
            return this.provider === "local";
        },
        trim: true
    },

    roleId: {
        type: Schema.Types.ObjectId,
        ref: "Role",
        required: true,
    },

    isVerified: {
        type: Boolean,
        default: false,
    },

    allowedPermissions: [{
        type: Types.ObjectId,
        ref: "Permission",
    }],

    deniedPermissions: [{
        type: Types.ObjectId,
        ref: "Permission",
    }],

    verificationSentAt: {
        type: Date,
    },

    provider: {
        type: String,
        enum: ["local", "google"],
        default: "local",
    },
}, { timestamps: true });

export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", userSchema);