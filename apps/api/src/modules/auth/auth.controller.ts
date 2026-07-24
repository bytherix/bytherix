import type { Request, Response, NextFunction } from "express";
import { authService } from "./auth.service";
import { config } from "../../config";

const COOKIE_OPTS = {
  httpOnly: true,
  secure: config.NODE_ENV === "production",
  sameSite: "strict" as const,
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: "/api/v1/auth",
};

function device(req: Request) {
  const ip =
    ((req.headers["x-forwarded-for"] as string) ?? "").split(",")[0]?.trim() ||
    req.ip ||
    "";
  const userAgent = req.headers["user-agent"] ?? "";
  const fingerprint = Buffer.from(`${ip}:${userAgent}`).toString("base64");
  return { ip, userAgent, fingerprint };
}

type Handler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<void>;

const wrap =
  (fn: Handler) => (req: Request, res: Response, next: NextFunction) =>
    fn(req, res, next).catch(next);

export const authController = {
  register: wrap(async (req, res) => {
    const user = await authService.register(req.body);
    res
      .status(201)
      .json({
        success: true,
        message: "Registration successful. Check your email.",
        data: { id: user._id, email: user.email },
      });
  }),

  login: wrap(async (req, res) => {
    const { email, password } = req.body;
    const { accessToken, refreshToken, user } = await authService.login(
      email,
      password,
      device(req),
    );
    res.cookie("refreshToken", refreshToken, COOKIE_OPTS);
    res.json({ success: true, data: { accessToken, user } });
  }),

  refresh: wrap(async (req, res) => {
    const { refreshToken } = req.cookies as { refreshToken?: string };
    if (!refreshToken) {
      res.status(401).json({ success: false, error: "No refresh token" });
      return;
    }
    const result = await authService.refresh(refreshToken, device(req));
    res.cookie("refreshToken", result.refreshToken, COOKIE_OPTS);
    res.json({
      success: true,
      data: { accessToken: result.accessToken, user: result.user },
    });
  }),

  logout: wrap(async (req, res) => {
    const { refreshToken } = req.cookies as { refreshToken?: string };
    if (refreshToken) await authService.logout(refreshToken);
    res.clearCookie("refreshToken", { path: "/api/v1/auth" });
    res.json({ success: true, message: "Logged out" });
  }),

  logoutAll: wrap(async (req, res) => {
    await authService.logoutAll(req.user!._id.toString());
    res.clearCookie("refreshToken", { path: "/api/v1/auth" });
    res.json({ success: true, message: "Logged out from all devices" });
  }),

  verifyEmail: wrap(async (req, res) => {
    const { token } = req.query as { token: string };
    await authService.verifyEmail(token);
    res.json({ success: true, message: "Email verified successfully" });
  }),

  forgotPassword: wrap(async (req, res) => {
    await authService.forgotPassword(req.body.email);
    res.json({
      success: true,
      message: "If that email exists, a reset link has been sent",
    });
  }),

  resetPassword: wrap(async (req, res) => {
    await authService.resetPassword(req.body.token, req.body.password);
    res.json({
      success: true,
      message: "Password reset successfully. Please sign in again.",
    });
  }),

  changePassword: wrap(async (req, res) => {
    await authService.changePassword(
      req.user!._id.toString(),
      req.body.currentPassword,
      req.body.newPassword,
    );
    res.json({
      success: true,
      message: "Password changed. All sessions revoked.",
    });
  }),

  sessions: wrap(async (req, res) => {
    const sessions = await authService.getSessions(req.user!._id.toString());
    res.json({ success: true, data: sessions });
  }),
};
