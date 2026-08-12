import mongoose, { Document, Model, Schema, Types } from "mongoose";

export interface IEnrollment extends Document {
    user: Types.ObjectId;
    course: Types.ObjectId;
    status: "active" | "completed" | "cancelled";
    progress: number;
    completedVideoIds: Types.ObjectId[];
    enrolledAt: Date;
    lastAccessedAt?: Date;
    completedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const enrollmentSchema = new Schema<IEnrollment>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        course: {
            type: Schema.Types.ObjectId,
            ref: "Course",
            required: true,
            index: true,
        },

        status: {
            type: String,
            enum: ["active", "completed", "cancelled"],
            default: "active",
        },

        progress: {
            type: Number,
            default: 0,
            min: 0,
            max: 100,
        },

        completedVideoIds: [
            {
                type: Schema.Types.ObjectId,
            },
        ],

        enrolledAt: {
            type: Date,
            default: Date.now,
        },

        lastAccessedAt: {
            type: Date,
        },

        completedAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

enrollmentSchema.index({ user: 1, course: 1 }, { unique: true });

export const Enrollment: Model<IEnrollment> = mongoose.models.Enrollment || mongoose.model<IEnrollment>("Enrollment", enrollmentSchema);