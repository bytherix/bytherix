import argon2        from 'argon2'
import jwt           from 'jsonwebtoken'
import crypto        from 'crypto'
import { config }    from '../../config'
import { UserRepository } from '../users/user.repository'
import { Session }   from '../sessions/session.model'
import { auditService }   from '../audit/audit.service'
import {
  UnauthorizedError, ConflictError, NotFoundError,
} from '../../shared/errors/AppError'
import type { IUser } from '../users/user.types'

const repo = new UserRepository()

const ARGON2_OPTIONS: argon2.Options = {
  type: argon2.argon2id, memoryCost: 65536, timeCost: 3, parallelism: 4,
}

export class AuthService {

  private signAccess(user: IUser): string {
    return jwt.sign(
      { sub: user._id, role: user.role, email: user.email },
      config.JWT_ACCESS_SECRET,
      { expiresIn: config.JWT_ACCESS_EXPIRES_IN as never },
    )
  }

  private makeRefreshToken(): string {
    return crypto.randomBytes(64).toString('hex')
  }

  private sha256(value: string): string {
    return crypto.createHash('sha256').update(value).digest('hex')
  }

  async register(data: { firstName: string; lastName: string; email: string; password: string }) {
    const existing = await repo.findByEmail(data.email)
    if (existing) throw new ConflictError('Email already registered')

    const password     = await argon2.hash(data.password, ARGON2_OPTIONS)
    const token        = crypto.randomBytes(32).toString('hex')
    const expiry       = new Date(Date.now() + 24 * 60 * 60 * 1000)

    return repo.create({ ...data, password, emailVerificationToken: token, emailVerificationExpiry: expiry })
  }

  async login(email: string, password: string, device: { ip: string; userAgent: string; fingerprint: string }) {
    const user = await repo.findByEmail(email, true)
    if (!user) {
      await auditService.log({ action: 'LOGIN_FAILED', resource: 'auth', ip: device.ip, userAgent: device.userAgent, success: false })
      throw new UnauthorizedError('Invalid credentials')
    }

    if (!user.password) throw new UnauthorizedError('Invalid credentials') // ← fixed: guard before argon2.verify
    const valid = await argon2.verify(user.password, password)
    if (!valid) {
      await auditService.log({ userId: user._id as never, action: 'LOGIN_FAILED', resource: 'auth', ip: device.ip, userAgent: device.userAgent, success: false })
      throw new UnauthorizedError('Invalid credentials')
    }

    if (!user.isActive)        throw new UnauthorizedError('Account is disabled')
    if (!user.isEmailVerified) throw new UnauthorizedError('Please verify your email first')

    const accessToken  = this.signAccess(user)
    const refreshToken = this.makeRefreshToken()

    await Session.create({
      userId: user._id, tokenHash: this.sha256(refreshToken), ...device,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    })

    await repo.update(user._id.toString(), { lastLoginAt: new Date() }) // ← fixed
    await auditService.log({ userId: user._id as never, action: 'LOGIN_SUCCESS', resource: 'auth', ip: device.ip, userAgent: device.userAgent, success: true })

    return { accessToken, refreshToken, user }
  }

  async refresh(refreshToken: string, device: { ip: string; userAgent: string; fingerprint: string }) {
    const hash    = this.sha256(refreshToken)
    const session = await Session.findOne({ tokenHash: hash, isRevoked: false, expiresAt: { $gt: new Date() } })
    if (!session) throw new UnauthorizedError('Invalid or expired refresh token')

    // Rotate
    await Session.findByIdAndUpdate(session._id, { isRevoked: true })

    const user = await repo.findById(session.userId.toString())
    if (!user || !user.isActive) throw new UnauthorizedError('User not found')

    const newAccess  = this.signAccess(user)
    const newRefresh = this.makeRefreshToken()

    await Session.create({
      userId: user._id, tokenHash: this.sha256(newRefresh), ...device,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    })

    return { accessToken: newAccess, refreshToken: newRefresh, user }
  }

  async logout(refreshToken: string): Promise<void> {
    await Session.findOneAndUpdate({ tokenHash: this.sha256(refreshToken) }, { isRevoked: true })
  }

  async logoutAll(userId: string): Promise<void> {
    await Session.updateMany({ userId, isRevoked: false }, { isRevoked: true })
  }

  async verifyEmail(token: string): Promise<void> {
    const user = await repo.findByVerificationToken(token)
    if (!user) throw new NotFoundError('Verification token')
    await repo.update(user._id.toString(), { isEmailVerified: true, emailVerificationToken: undefined, emailVerificationExpiry: undefined }) // ← fixed
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await repo.findByEmail(email)
    if (!user) return // Silent — don't leak whether email exists
    const token  = crypto.randomBytes(32).toString('hex')
    const hashed = this.sha256(token)
    await repo.update(user._id.toString(), { passwordResetToken: hashed, passwordResetExpiry: new Date(Date.now() + 60 * 60 * 1000) }) // ← fixed
    // TODO: enqueue email via BullMQ with plaintext token
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const hash = this.sha256(token)
    const user = await repo.findByResetToken(hash)
    if (!user) throw new UnauthorizedError('Invalid or expired reset token')
    const password = await argon2.hash(newPassword, ARGON2_OPTIONS)
    await repo.update(user._id.toString(), { password, passwordResetToken: undefined, passwordResetExpiry: undefined }) // ← fixed
    await this.logoutAll(user._id.toString()) // ← fixed
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    const user = await repo.findByEmail(userId, true)
    if (!user) throw new NotFoundError('User')
    if (!user.password) throw new UnauthorizedError('Current password is incorrect') // ← fixed: guard before argon2.verify
    const valid = await argon2.verify(user.password, currentPassword)
    if (!valid) throw new UnauthorizedError('Current password is incorrect')
    const password = await argon2.hash(newPassword, ARGON2_OPTIONS)
    await repo.update(user._id.toString(), { password }) // ← fixed
    await this.logoutAll(user._id.toString()) // ← fixed
  }

  async getSessions(userId: string) {
    return Session.find({ userId, isRevoked: false, expiresAt: { $gt: new Date() } })
      .select('-tokenHash').sort({ lastUsedAt: -1 })
  }
}

export const authService = new AuthService()