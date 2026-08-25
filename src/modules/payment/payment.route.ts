import { Router } from "express";
import { PaymentController } from "./payment.controller.js";
import { auth } from "../../shared/middlewares/auth.js";
import { accessTo } from "../../shared/middlewares/rbac.js";

const router = Router();

// Apply authentication to all payment routes
router.use(auth);

// POST - Initiate payment
router.post(
  "/initiate",
  accessTo("payment.initiate"),
  PaymentController.initiatePayment
);

// POST - Verify payment (eSewa callback)
router.post(
  "/verify",
  PaymentController.verifyPayment // No accessTo needed as this is a public callback from eSewa
);

// GET
router.get(
  "/:paymentId",
  accessTo("payment.read"),
  PaymentController.getPaymentById
);

router.get(
  "/me",
  accessTo("payment.read"),
  PaymentController.getMyPayments
);

// GET 
router.get(
  "/course/:courseId",
  accessTo("payment.read"),
  PaymentController.getPaymentsByCourse
);

export default router;