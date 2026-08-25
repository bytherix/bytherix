import mongoose, { Schema, Document } from "mongoose";

export const PAYMENT_STATUS = {
    INITIATED: "initiated",
    PENDING: "pending",
    SUCCESS: "success",
    FAILED: "failed",
    CANCELLED: "cancelled",
    EXPIRED: "expired",
} as const;

export type PaymentStatus = typeof PAYMENT_STATUS[keyof typeof PAYMENT_STATUS];

export interface IPayment extends Document {
    user: mongoose.Types.ObjectId;
    course: mongoose.Types.ObjectId;
    amount: number;
    currency: string;
    provider: string;
    providerPaymentId: string;
    status: PaymentStatus;
    purpose: string;
    initiatedAt: Date;
    updatedAt: Date;
    verifiedAt?: Date;
    expiresAt?: Date;
    metadata?: Record<string, any>;
}

const PaymentSchema = new Schema<IPayment>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        course: {
            type: Schema.Types.ObjectId,
            ref: "Course",
            required: true,
        },
        amount: {
            type: Number,
            required: true,
            min: 0,
        },
        currency: {
            type: String,
            default: "USD",
        },
        provider: {
            type: String,
            required: true,
            default: "esewa",
        },
        providerPaymentId: {
            type: String,
            required: true,
            unique: true,
        },
        status: {
            type: String,
            enum: Object.values(PAYMENT_STATUS),
            default: PAYMENT_STATUS.INITIATED,
        },
        purpose: {
            type: String,
            required: true,
        },
        initiatedAt: {
            type: Date,
            default: Date.now,
        },
        updatedAt: {
            type: Date,
            default: Date.now,
        },
        verifiedAt: {
            type: Date,
        },
        expiresAt: {
            type: Date,
        },
        metadata: {
            type: Schema.Types.Mixed,
        },
    },
    {
        timestamps: true,
    }
);

// Indexes for faster querying
PaymentSchema.index({ user: 1, status: 1 });
PaymentSchema.index({ course: 1, status: 1 });
PaymentSchema.index({ providerPaymentId: 1 });
PaymentSchema.index({ status: 1 });
PaymentSchema.index({ expiresAt: 1 });

export const Payment = mongoose.model<IPayment>("Payment", PaymentSchema);