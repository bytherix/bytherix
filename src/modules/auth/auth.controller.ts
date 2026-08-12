import type { Request, Response } from "express";
import { catchAsync } from "../../shared/error/catchAsync.js";
import { AuthService } from "./auth.service.js";
import { AppError } from "../../shared/error/appError.js";
import { ENV } from "../../infrastructure/env.js";


export class AuthController {

    //REGISTER
    static register = catchAsync(async (req: Request, res: Response) => {

        const data = await AuthService.register(req.body);

        return res.status(201).json({ success: true, message: "Registered successfully", data });
    });


    //VERIFICATION
    static verifyEmail = catchAsync(async (req: Request, res: Response) => {
        const { accessToken } = req.params;

        if (!accessToken || Array.isArray(accessToken)) {
            throw new AppError("Invalid verification token", 400);
        }

        const verify = await AuthService.verifyToken(accessToken);

        return res.status(200).json(verify);
    });


    //LOGIN
    static login = catchAsync(async (req: Request, res: Response) => {
        const data = await AuthService.login(req.body);

        res.cookie("refreshToken", data.refreshToken, {
            httpOnly: true,
            secure: ENV.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        const { refreshToken, ...responseData } = data;

        return res.status(200).json({
            success: true,
            message: "Login successful",
            data: responseData,
        });
    });



    // REFRESH-TOKEN
    static refreshToken = catchAsync(async (req: Request, res: Response) => {
        const token = req.cookies.refreshToken;

        const data = await AuthService.refresh(token);

        res.cookie("refreshToken", data.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        const { refreshToken, ...responseData } = data;

        return res.status(200).json({
            success: true,
            message: "Token refreshed successfully",
            data: responseData,
        });
    });


    // LOGOUT
    static logout = catchAsync(async (req: Request, res: Response) => {
        const token = req.cookies.refreshToken;

        await AuthService.logout(token);

        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: ENV.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
        });

        return res.status(200).json({
            success: true,
            message: "Logged out successfully.",
        });
    });


    // FORGOT PASSWORD
    static forgotPassword = catchAsync(async (req: Request, res: Response) => {
        const { email } = req.body;
        const result = await AuthService.forgotPassword(email);
        return res.status(200).json(result);
    });


    // RESET PASSWORD
    static resetPassword = catchAsync(async (req: Request, res: Response) => {
        const { token } = req.params;

        if (!token || typeof token !== 'string') {
            throw new AppError('Invalid or missing token', 400);
        }

        const { password } = req.body;
        const result = await AuthService.resetPassword(token, password);
        return res.status(200).json(result);
    });


    // GOOGLE LOGIN
    static googleLogin = catchAsync(async (req: Request, res: Response) => {
        const { credential } = req.body;
        const data = await AuthService.googleLogin(credential);

        res.cookie("refreshToken", data.refreshToken, {
            httpOnly: true,
            secure: ENV.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        const { refreshToken, ...responseData } = data;

        return res.status(200).json({
            success: true,
            message: "Google login successful",
            data: responseData,
        });
    });

}