import { PaymentRepository } from "./payment.repository.js";
import type { InitiatePaymentDTO, VerifyPaymentDTO } from "./payment.dto.js";

export class PaymentService {
  // INITIATE PAYMENT
  static async initiatePayment(userId: string, courseId: string, dto: InitiatePaymentDTO) {
    return await PaymentRepository.createPayment(userId, courseId, dto);
  }

  // VERIFY PAYMENT
  static async verifyPayment(providerPaymentId: string, dto: VerifyPaymentDTO) {
    return await PaymentRepository.verifyPayment(providerPaymentId, dto);
  }

  // GET PAYMENT BY ID
  static async getPaymentById(paymentId: string) {
    return await PaymentRepository.getPaymentById(paymentId);
  }

  // GET PAYMENTS BY USER ID
  static async getPaymentsByUserId(userId: string, query: any = {}) {
    return await PaymentRepository.getPaymentsByUserId(userId, query);
  }

  // GET PAYMENTS BY COURSE ID
  static async getPaymentsByCourseId(courseId: string, query: any = {}) {
    return await PaymentRepository.getPaymentsByCourseId(courseId, query);
  }
}
