import { AppError } from "../../shared/error/appError.js";
import { Payment, PAYMENT_STATUS } from "./payment.model.js";
import { esewaConfig } from "../../infrastructure/esewaConfig.js";
import { Course } from "../course/course.model.js";
import { Enrollment } from "../enrollment/enrollment.model.js";
import crypto from "crypto";
import mongoose from "mongoose";
import type { InitiatePaymentDTO, VerifyPaymentDTO } from "./payment.dto.js";
import { getPagination, getPaginationMeta } from "../../shared/helper/pagination.js";

export class PaymentRepository {
  // CREATE PAYMENT
  static async createPayment(userId: string, courseId: string, dto: InitiatePaymentDTO) {
    // Validate IDs
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new AppError("Invalid or missing user ID", 400);
    }

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      throw new AppError("Invalid or missing course ID", 400);
    }

    // Check if course exists, is not removed, and is published
    const courseExists = await Course.findOne({
      _id: courseId,
      isRemoved: false,
      status: "published"
    });

    if (!courseExists) {
      throw new AppError("Course not found or not accessible", 404);
    }

    // Calculate amount server-side ONLY
    const finalPrice = courseExists.discountPrice > 0
      ? courseExists.discountPrice
      : courseExists.price;

    // Generate unique transaction UUID
    const transactionUuid = `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Prepare eSewa payment data
    const paymentData = {
      amount: String(finalPrice),
      failure_url: dto.failureUrl || esewaConfig.failureUrl,
      product_delivery_charge: "0",
      product_service_charge: "0",
      product_code: esewaConfig.merchantId,
      signed_field_names: "total_amount,transaction_uuid,product_code",
      success_url: dto.successUrl || esewaConfig.successUrl,
      tax_amount: "0",
      total_amount: String(finalPrice),
      transaction_uuid: transactionUuid,
      signature: "" // Will be set after signature generation
    };

    // Generate signature
    const signatureData = `total_amount=${paymentData.total_amount},transaction_uuid=${paymentData.transaction_uuid},product_code=${paymentData.product_code}`;
    const signature = crypto
      .createHmac("sha256", esewaConfig.secret)
      .update(signatureData)
      .digest("base64");

    paymentData.signature = signature;

    // Set expiration time (2 hours from now)
    const expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000);

    // Create payment record
    const payment = await Payment.create({
      user: userId,
      course: courseId,
      amount: finalPrice,
      currency: "USD",
      provider: "esewa",
      providerPaymentId: transactionUuid,
      status: PAYMENT_STATUS.INITIATED,
      purpose: "course_enrollment",
      initiatedAt: new Date(),
      expiresAt: expiresAt,
      metadata: {
        esewaData: paymentData
      }
    });

    // Return the raw payment object
    return payment;
  }

  // VERIFY PAYMENT
  static async verifyPayment(providerPaymentId: string, dto: VerifyPaymentDTO) {
    // Validate input
    if (!providerPaymentId) {
      throw new AppError("Provider payment ID is required", 400);
    }

    // Find payment by provider payment ID
    const payment = await Payment.findOne({ providerPaymentId });
    if (!payment) {
      throw new AppError("Payment not found", 404);
    }

    // Check if payment is already processed
    if (payment.status === PAYMENT_STATUS.SUCCESS) {
      return payment; // Already successful, return as-is (idempotency)
    }

    if ([PAYMENT_STATUS.FAILED, PAYMENT_STATUS.CANCELLED, PAYMENT_STATUS.EXPIRED].includes(payment.status as any)) {
      throw new AppError(`Payment is already ${payment.status}`, 400);
    }

    // Verify signature
    const { amount, transaction_uuid, product_code, signature, signed_field_names, ...rest } = dto;

    // Recreate signature data from signed fields
    const fieldValues = signed_field_names.split(',').map(field => {
      const value = (dto as any)[field];
      if (value === undefined) {
        throw new AppError(`Missing required field: ${field}`, 400);
      }

      return `${field}=${value}`;
    }).join(',');

    const expectedSignature = crypto
      .createHmac("sha256", esewaConfig.secret)
      .update(fieldValues)
      .digest("base64");

    if (signature !== expectedSignature) {
      // Mark payment as failed due to invalid signature
      await Payment.findByIdAndUpdate(payment._id, {
        status: PAYMENT_STATUS.FAILED,
        updatedAt: new Date(),
        $push: {
          metadata: {
            verificationFailedAt: new Date(),
            verificationError: "Invalid signature"
          }
        }
      });

      throw new AppError("Invalid payment signature", 400);
    }

    // Verify amount matches
    if (Number(amount) !== payment.amount) {
      await Payment.findByIdAndUpdate(payment._id, {
        status: PAYMENT_STATUS.FAILED,
        updatedAt: new Date(),
        $push: {
          metadata: {
            verificationFailedAt: new Date(),
            verificationError: "Amount mismatch"
          }
        }
      });

      throw new AppError("Invalid payment amount", 400);
    }

    // Start a transaction for atomic payment verification and enrollment creation
    const session = await mongoose.startSession();
    let updatedPayment;

    try {
      await session.withTransaction(async () => {
        // Update payment as verified and successful
        updatedPayment = await Payment.findByIdAndUpdate(
          payment._id,
          {
            status: PAYMENT_STATUS.SUCCESS,
            verifiedAt: new Date(),
            updatedAt: new Date(),
            $set: {
              "metadata.verificationData": dto
            }
          },
          { new: true, session }
        );

        if (!updatedPayment) {
          throw new AppError("Failed to update payment", 500);
        }

        // Create enrollment if payment is successful and link to payment
        if (updatedPayment.status === PAYMENT_STATUS.SUCCESS) {
          // Check if enrollment already exists
          const existingEnrollment = await Enrollment.findOne({
            user: payment.user,
            course: payment.course
          }).session(session);

          if (!existingEnrollment) {
            const enrollment = await Enrollment.create([{
              user: payment.user,
              course: payment.course,
              status: "active",
              progress: 0,
              completedVideoIds: [],
              enrolledAt: new Date(),
              payment: updatedPayment._id // Link enrollment to payment
            }], { session });

            // Update payment with enrollment reference
            if (enrollment.length > 0 && enrollment[0]) {
              const enrollmentId = enrollment[0]._id;
              await Payment.findByIdAndUpdate(
                updatedPayment._id,
                {
                  $set: {
                    "metadata.enrollmentId": enrollmentId
                  }
                },
                { session }
              );
            } else {
              throw new AppError("Failed to create enrollment", 500);
            }
          } else {
            // If enrollment exists but doesn't have payment linked, link it
            if (!existingEnrollment.payment) {
              await Enrollment.findByIdAndUpdate(
                existingEnrollment._id,
                {
                  payment: updatedPayment._id
                }
              ).session(session);

              // Update payment with enrollment reference
              await Payment.findByIdAndUpdate(
                updatedPayment._id,
                {
                  $set: {
                    "metadata.enrollmentId": existingEnrollment._id
                  }
                },
                { session }
              );
            }
          }
        }
      });
    } finally {
      await session.endSession();
    }

    if (!updatedPayment) {
      throw new AppError("Failed to update payment", 500);
    }

    return updatedPayment;
  }

  // GET PAYMENT BY ID
  static async getPaymentById(paymentId: string) {
    if (!mongoose.Types.ObjectId.isValid(paymentId)) {
      throw new AppError("Invalid payment ID", 400);
    }

    const payment = await Payment.findById(paymentId);
    if (!payment) {
      throw new AppError("Payment not found", 404);
    }

    return payment;
  }

  // GET PAYMENTS BY USER ID
  static async getPaymentsByUserId(userId: string, query: any = {}) {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new AppError("Invalid or missing user ID", 400);
    }

    const { page, limit, skip } = getPagination(query);

    const [payments, total] = await Promise.all([
      Payment.find({ user: userId })
        .populate("course", "title desc thumbnail level price discountPrice finalPrice")
        .skip(skip)
        .limit(limit),
      Payment.countDocuments({ user: userId })
    ]);

    return {
      success: true,
      message: "Payments fetched successfully",
      data: payments.map(payment => ({
        id: payment._id,
        user: payment.user,
        course: payment.course,
        amount: payment.amount,
        currency: payment.currency,
        provider: payment.provider,
        providerPaymentId: payment.providerPaymentId,
        status: payment.status,
        purpose: payment.purpose,
        initiatedAt: payment.initiatedAt,
        updatedAt: payment.updatedAt,
        verifiedAt: payment.verifiedAt,
        expiresAt: payment.expiresAt,
        metadata: payment.metadata
      })),
      meta: getPaginationMeta({
        total,
        page,
        limit
      })
    };
  }

  // GET PAYMENTS BY COURSE ID
  static async getPaymentsByCourseId(courseId: string, query: any = {}) {
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      throw new AppError("Invalid or missing course ID", 400);
    }

    const { page, limit, skip } = getPagination(query);

    const [payments, total] = await Promise.all([
      Payment.find({ course: courseId })
        .populate("user", "fullName email")
        .skip(skip)
        .limit(limit),
      Payment.countDocuments({ course: courseId })
    ]);

    return {
      success: true,
      message: "Payments fetched successfully",
      data: payments.map(payment => ({
        id: payment._id,
        user: payment.user,
        course: payment.course,
        amount: payment.amount,
        currency: payment.currency,
        provider: payment.provider,
        providerPaymentId: payment.providerPaymentId,
        status: payment.status,
        purpose: payment.purpose,
        initiatedAt: payment.initiatedAt,
        updatedAt: payment.updatedAt,
        verifiedAt: payment.verifiedAt,
        expiresAt: payment.expiresAt,
        metadata: payment.metadata
      })),
      meta: require("../../shared/helper/pagination.js").getPaginationMeta({
        total,
        page,
        limit
      })
    };
  }
}