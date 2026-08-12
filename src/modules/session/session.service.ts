import { Session } from "./session.model.js";
import { AppError } from "../../shared/error/appError.js";
import type { Types } from "mongoose";

export class SessionService {

    // CREATE SESSION
    static async createSession(userId: Types.ObjectId, token: string, expiresAt: Date) {
        return Session.create({
            userId,
            token,
            expiresAt,
        });
    }


    // FIND ACTIVE SESSION
    static async findSession(token: string) {
        const session = await Session.findOne({
            token,
            revoked: false,
        });

        if (!session) {
            throw new AppError("Invalid session", 401);
        }

        return session;
    }


    // REVOKE SESSION
    static async revokeSession(token: string) {
        const session = await Session.findOneAndUpdate(
            { token },
            { revoked: true },
            { new: true }
        );

        if (!session) {
            throw new AppError("Session not found", 404);
        }

        return session;
    }


    // REVOKE ALL USER SESSIONS
    static async revokeAllUserSessions(userId: string) {
        return Session.updateMany(
            { userId },
            { revoked: true }
        );
    }


    // DELETE SESSION
    static async deleteSession(token: string) {
        return Session.findOneAndDelete({ token });
    }
}
