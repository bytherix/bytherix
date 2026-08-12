import type { Request, Response } from "express";
import { catchAsync } from "../../shared/error/catchAsync.js";
import { RoleService } from "./role.service.js";
import { AppError } from "../../shared/error/appError.js";

export class RoleController {
    //ADD-ROLE
    static addRole = catchAsync(async (req: Request, res: Response) => {

        const role = await RoleService.createRole(req.body);
        return res.status(201).json({ success: true, message: "Role created successfully", data: role });
    });


    //UPDATE-ROLE
    static updateRole = catchAsync(async (req: Request, res: Response) => {

        const { id } = req.params;

        if (!id) {
            throw new AppError("Invalid id", 400);
        }

        const role = await RoleService.updateRole(id.toString(), req.body);

        return res.status(200).json({ success: true, message: "Role updated successfully", data: role });
    });


    //DELETE-ROLE
    static deleteRole = catchAsync(async (req: Request, res: Response) => {
        const { id } = req.params;

        if (!id) {
            throw new AppError("Invalid id", 400);
        }

        const role = await RoleService.deleteRole(id.toString());

        return res.status(200).json({ success: true, message: `${role} deleted successfully` });
    });


    //FETCH-ALL-ROLES
    static fetchAllRoles = catchAsync(async (req: Request, res: Response) => {
        const role = await RoleService.getAllRoles();
        return res.status(200).json({ success: true, message: "Roles fetched successfully", data: role });
    });


    //FETCH-ROLE-ID
    static fetchRoleById = catchAsync(async (req: Request, res: Response) => {
        const { id } = req.params;

        if (!id) {
            throw new AppError("Invalid id", 400);
        }

        const role = await RoleService.getRoleById(id.toString());

        return res.status(200).json({ success: true, message: "Role fetched successfully", data: role });
    })
}