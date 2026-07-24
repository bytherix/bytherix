import { HydratedDocument, Types } from "mongoose";

export type UserRole = "USER" | "MODERATOR" | "ADMIN" | "SUPER_ADMIN";

export interface IUser {
  _id: Types.ObjectId;

  email: string;
  password?: string | undefined;

  firstName: string;
  lastName: string;

  role: UserRole;

  isActive: boolean;
  isEmailVerified: boolean;

  emailVerificationToken?: string | undefined;
  emailVerificationExpiry?: Date | undefined;

  passwordResetToken?: string | undefined;
  passwordResetExpiry?: Date | undefined;

  avatar?: string | undefined;
  lastLoginAt?: Date | undefined;

  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | undefined;
}

export type UserDocument = HydratedDocument<IUser>;
