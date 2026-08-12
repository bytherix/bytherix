import { AppError } from "../../shared/error/appError.js";
import { generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken } from "../../shared/helper/generateToken.js";
import { EmailService } from "../../shared/services/email.service.js";
import { SessionService } from "../session/session.service.js";
import { UserService } from "../user/user.service.js";
import type { LoginDTO, RegisterDTO } from "./auth.dto.js";
import bcrypt from "bcrypt";
import { OAuth2Client } from "google-auth-library";
import { ENV } from "../../infrastructure/env.js";

const client = new OAuth2Client(ENV.GOOGLE_CLIENT_ID);


export class AuthService {

    //REGISTER
    static async register(data: RegisterDTO) {

        const user = await UserService.createUser(data);


        const verificationToken = generateAccessToken({
            id: user._id.toString(),
            email: user.email,
        });


        await EmailService.sendVerificationLink(
            user.email,
            user.fullName,
            verificationToken
        );


        return {
            id: user._id,
            fullName: user.fullName,
            email: user.email,
            isVerified: user.isVerified,
            message: "Registration successful. Please verify your email."
        };
    }


    //EMAIL-VERIFICATION
    static async verifyToken(accessToken: string) {

        const decoded = await verifyAccessToken(accessToken);

        const user = await UserService.getUserId(decoded.id);

        if (!user)
            throw new AppError("User not found", 404);

        if (user.isVerified)
            return { success: true, message: "Email is already verified" }

        user.isVerified = true;
        await user.save();

        return { success: true, message: "Email verified successfully" };

    }


    // LOGIN
    static async login(data: LoginDTO) {
        const user = await UserService.findByEmail(data.email);

        if (!user) {
            throw new AppError("Incorrect email or password", 400);
        }


        const isPasswordValid = await bcrypt.compare(
            data.password,
            user.password
        );

        if (!isPasswordValid) {
            throw new AppError("Incorrect email or password", 400);
        }


        if (!user.isVerified) {

            const resendCooldown = 5 * 60 * 1000; // 5 minutes

            if (
                user.verificationSentAt &&
                Date.now() - user.verificationSentAt.getTime() < resendCooldown
            ) {
                throw new AppError(
                    "Please wait before requesting another verification email.",
                    429
                );
            }


            const verificationToken = generateAccessToken({
                id: user.id.toString(),
                email: user.email,
            });


            await EmailService.sendVerificationLink(
                user.email,
                user.fullName,
                verificationToken
            );


            await UserService.updateVerificationSentAt(
                user.id.toString()
            );


            throw new AppError("Email is not verified. A new verification link has been sent.", 401);
        }

        const roleObj = user.role as any;
        const roleId = roleObj?._id?.toString();

        const tokenPayload = {
            id: user.id.toString(),
            email: user.email,
            role: roleId,
        };


        const accessToken = generateAccessToken(tokenPayload);

        const refreshToken = generateRefreshToken(tokenPayload);


        await SessionService.createSession(
            user.id,
            refreshToken,
            new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        );


        return {
            success: true,
            message: "Login successful",
            refreshToken,
            data: {
                accessToken,
                user: {
                    id: user.id,
                    fullName: user.fullName,
                    email: user.email,
                    isVerified: user.isVerified,
                    role: {
                        id: roleObj?._id,
                        name: roleObj?.name,
                        permissions: roleObj?.permissions
                    }
                }
            }
        }
    }



    // TOKEN ROTATION
    static async refresh(token: string) {
        if (!token) {
            throw new AppError("Refresh token missing", 401);
        }

        const session = await SessionService.findSession(token);

        await SessionService.revokeSession(token);

        const user = await UserService.getUserId(session.userId.toString());

        if (!user) {
            throw new AppError("User not found", 404);
        }

        const roleObj = user.roleId as any;
        const roleId = roleObj?._id?.toString();
        const roleName = roleObj?.name;

        const tokenPayload = {
            id: user.id.toString(),
            email: user.email,
            role: roleId,
        };

        const newAccessToken = generateAccessToken(tokenPayload);
        const newRefreshToken = generateRefreshToken(tokenPayload);

        await SessionService.createSession(
            user._id,
            newRefreshToken,
            new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        );

        return {
            success: true,
            message: "Token refreshed successfully",
            refreshToken: newRefreshToken,
            data: {
                accessToken: newAccessToken,
                user: {
                    id: user.id,
                    email: user.email,
                    role: {
                        id: roleId,
                        name: roleName,
                    }
                }
            }
        };
    }


    // LOGOUT
    static async logout(token: string) {
        if (!token) {
            throw new AppError("Refresh token missing", 401);
        }

        await SessionService.revokeSession(token);

        return true;
    }


    //FORGOT PASSWORD
    static async forgotPassword(email: string) {
        if (!email) {
            throw new AppError("Email is required", 400);
        }

        const user = await UserService.findByEmail(email);
        if (!user) {
            throw new AppError("User not found", 404);
        }

        const resetToken = generateAccessToken({
            id: user.id.toString(),
            email: user.email,
        }, "15m");

        await EmailService.sendResetPasswordLink(
            user.email,
            user.fullName,
            resetToken
        );

        return {
            success: true,
            message: "Password reset link sent to your email."
        };
    }

    //RESET PASSWORD
    static async resetPassword(token: string, password: string) {
        if (!token) {
            throw new AppError("Reset token is required", 400);
        }
        if (!password || password.length < 6) {
            throw new AppError("Password must be at least six characters long", 400);
        }

        const decoded = await verifyAccessToken(token);
        const user = await UserService.getUserId(decoded.id);

        if (!user) {
            throw new AppError("User not found", 404);
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        user.password = hashedPassword;
        await user.save();

        return {
            success: true,
            message: "Password reset successful."
        };
    }


    // GOOGLE LOGIN
    static async googleLogin(credential: string) {
        if (!credential) {
            throw new AppError("Credential token is required", 400);
        }

        let payload;
        try {
            const ticket = await client.verifyIdToken({
                idToken: credential,
                audience: ENV.GOOGLE_CLIENT_ID,
            });
            payload = ticket.getPayload();
        } catch (error: any) {
            throw new AppError("Invalid Google credential: " + error.message, 400);
        }

        if (!payload || !payload.email) {
            throw new AppError("Invalid Google token payload", 400);
        }

        const user = await UserService.findOrCreateGoogleUser({
            email: payload.email,
            fullName: payload.name || "Google User",
        });

        const roleObj = user.roleId as any;
        const roleId = roleObj?._id?.toString();
        const roleName = roleObj?.name;

        const tokenPayload = {
            id: user.id.toString(),
            email: user.email,
            role: roleId,
        };

        const accessToken = generateAccessToken(tokenPayload);
        const refreshToken = generateRefreshToken(tokenPayload);

        await SessionService.createSession(
            user._id,
            refreshToken,
            new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        );

        return {
            success: true,
            message: "Google login successful",
            refreshToken,
            data: {
                accessToken,
                user: {
                    id: user._id,
                    fullName: user.fullName,
                    email: user.email,
                    isVerified: user.isVerified,
                    role: {
                        id: roleId,
                        name: roleName,
                    }
                }
            }
        };
    }
}
