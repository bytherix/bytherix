import type { NextFunction, Request, Response } from "express";
import { catchAsync } from "../error/catchAsync.js";
import { Role } from "../../modules/role/role.model.js";

export const accessTo = (...permissions: string[]) => {
    return catchAsync(async (req: Request, res: Response, next: NextFunction) => {

        const user = req.user;

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized access",
            });
        }

        const role = await Role.findById(user.role)
            .populate("permissions");

        if (!role) {
            return res.status(403).json({
                success: false,
                message: "Role not found",
            });
        }

        const userPermissions = role.permissions.map(
            (permission: any) => permission.name
        );

        const hasPermission = permissions.every((permission) =>
            userPermissions.includes(permission)
        );

        if (!hasPermission) {
            return res.status(403).json({
                success: false,
                message: "You don't have permission to perform this action",
            });
        }

        next();
    })
};