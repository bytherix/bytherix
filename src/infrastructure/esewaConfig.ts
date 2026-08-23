import { ENV } from "./env.js";

export const esewaConfig = ({
    merchantId: ENV.ESEWA_MERCHANT_ID,
    successUrl: `${ENV.FRONTEND_URL}/payment-success`,
    failureUrl: `${ENV.FRONTEND_URL}/payment-failed`,
    esewaPaymentUrl: ENV.ESEWA_URL,
    secret: ENV.ESEWA_SECRET_KEY
});