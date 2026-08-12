import mongoose, { Document, Model, Schema, Types } from "mongoose";

export interface ISession extends Document {
    userId: Types.ObjectId;
    token: string;
    revoked: boolean;
    expiresAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

const sessionSchema: Schema<ISession> = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        token: {
            type: String,
            required: true,
            unique: true,
        },

        revoked: {
            type: Boolean,
            default: false,
        },

        expiresAt: {
            type: Date,
            required: true,
        },
    }, { timestamps: true });

sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
sessionSchema.index({ userId: 1 });

export const Session: Model<ISession> = mongoose.models.Session || mongoose.model<ISession>("Session", sessionSchema);
