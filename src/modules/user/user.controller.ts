import type { Request, Response } from "express";
import { AppError } from "../../shared/error/appError.js";
import { catchAsync } from "../../shared/error/catchAsync.js";
import { UserService } from "./user.service.js";


export class UserController {

    //FETCH ALL (ADMINS AND MODS)
    static getAllUsers = catchAsync(async (req: Request, res: Response) => {

        const data = await UserService.fetchAllUsers(req.query);

        return res.status(200).json({ success: true, message: "Users fetched successfully", data });
    });


    //FETCH FILTERED
    static getUsersAdminAndMod = catchAsync(async (req: Request, res: Response) => {

        const data = await UserService.fetchFilteredUsers(req.query);
        return res.status(200).json({ success: true, message: "Users fetched successfully", data });
    });


    //UPDATE USERS ROLE (ADMIN)
    static updateRoleByAdmin = catchAsync(async (req: Request, res: Response) => {

        const { id } = req.params;
        const { role } = req.body;

        if (!id) {
            throw new AppError("Invalid id", 400);
        }

        const data = await UserService.updateUserRole(id.toString(), role);

        return res.status(200).json({ success: true, message: `${data?.fullName} role updated successfully`, data });
    });


    //GET USER BY ID
    static getUserById = catchAsync(async (req: Request, res: Response) => {

        const { id } = req.params;

        if (!id) {
            throw new AppError("Invalid id", 400);
        }

        const data = await UserService.fetchUserById(id.toString());

        return res.status(200).json({ success: true, message: "User fetched successfully", data });
    });


}

