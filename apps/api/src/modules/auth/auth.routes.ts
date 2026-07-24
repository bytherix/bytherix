import { Router }     from 'express'
// import { z }          from 'zod'
import { authController }           from './auth.controller'
import { validate }                 from '../../middleware/validate'
import { authenticate }             from '../../middleware/authenticate'
import { authLimiter, passwordResetLimiter, emailVerifyLimiter } from '../../middleware/rateLimiter'
import { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema, changePasswordSchema, verifyEmailSchema } from './auth.schema'

const router = Router()

router.post('/register',         authLimiter,          validate(registerSchema),        authController.register)
router.post('/login',            authLimiter,          validate(loginSchema),           authController.login)
router.post('/refresh',                                                                 authController.refresh)
router.post('/logout',                                                                  authController.logout)
router.post('/logout-all',       authenticate,                                          authController.logoutAll)
router.get( '/verify-email',     emailVerifyLimiter,   validate(verifyEmailSchema),     authController.verifyEmail)
router.post('/forgot-password',  passwordResetLimiter, validate(forgotPasswordSchema),  authController.forgotPassword)
router.post('/reset-password',   passwordResetLimiter, validate(resetPasswordSchema),   authController.resetPassword)
router.post('/change-password',  authenticate,         validate(changePasswordSchema),  authController.changePassword)
router.get( '/sessions',         authenticate,                                          authController.sessions)

export { router as authRouter }