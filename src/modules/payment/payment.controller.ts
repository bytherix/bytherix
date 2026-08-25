import type { Request, Response } from "express";
import { catchAsync } from "../../shared/error/catchAsync.js";
import { PaymentService } from "./payment.service.js";
import { AppError } from "../../shared/error/appError.js";
import type { AuthenticatedRequest } from "../../shared/middlewares/auth.js";
import type { InitiatePaymentDTO, VerifyPaymentDTO } from "./payment.dto.js";
import mongoose from "mongoose";
import { esewaConfig } from "../../infrastructure/esewaConfig.js";

export class PaymentController {
  // INITIATE PAYMENT
  static initiatePayment = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const { courseId, successUrl, failureUrl } = req.body as InitiatePaymentDTO;

    if (!courseId) {
      throw new AppError("Course ID is required", 400);
    }

    // Validate courseId format
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      throw new AppError("Invalid course ID format", 400);
    }

    const payment = await PaymentService.initiatePayment(req.user!.id, courseId, {
      courseId,
      successUrl,
      failureUrl
    });

    return res.status(201).json({
      success: true,
      message: "Payment initiated successfully",
      data: {
        paymentId: payment._id,
        transactionUuid: payment.providerPaymentId,
        esewaPaymentUrl: esewaConfig.esewaPaymentUrl,
        esewaPaymentData: payment.metadata!.esewaData
      }
    });
  });

  // VERIFY PAYMENT (eSewa callback)
  static verifyPayment = catchAsync(async (req: Request, res: Response) => {
    const dto: VerifyPaymentDTO = req.body;

    // Extract providerPaymentId from transaction_uuid
    const providerPaymentId = dto.transaction_uuid;

    if (!providerPaymentId) {
      throw new AppError("Transaction UUID is required", 400);
    }

    const payment = await PaymentService.verifyPayment(providerPaymentId, dto);

    return res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      data: {
        id: payment._id,
        status: payment.status,
        verifiedAt: payment.verifiedAt,
        amount: payment.amount,
        currency: payment.currency
      }
    });
  });

  // GET PAYMENT BY ID
  static getPaymentById = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const { paymentId } = req.params;
    const id = Array.isArray(paymentId) ? paymentId[0] : paymentId;

    if (!id) {
      throw new AppError("Payment ID is required", 400);
    }

    // Validate paymentId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError("Invalid payment ID format", 400);
    }

    const payment = await PaymentService.getPaymentById(id);
    if (!payment) {
      throw new AppError("Payment not found", 404);
    }

    return res.status(200).json({
      success: true,
      message: "Payment fetched successfully",
      data: payment
    });
  });

  // GET MY PAYMENTS
  static getMyPayments = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const result = await PaymentService.getPaymentsByUserId(req.user!.id, req.query);
    return res.status(200).json(result);
  });

  // GET PAYMENTS FOR A COURSE (for instructors/admins)
  static getPaymentsByCourse = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const { courseId } = req.params;
    const id = Array.isArray(courseId) ? courseId[0] : courseId;

    if (!id) {
      throw new AppError("Course ID is required", 400);
    }

    // Validate courseId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError("Invalid course ID format", 400);
    }

    const result = await PaymentService.getPaymentsByCourseId(id, req.query);
    return res.status(200).json(result);
  });
}
