import type { Request, Response } from "express";
import { catchAsync } from "../../shared/error/catchAsync.js";
import { PermissionService } from "./permission.service.js";
import { AppError } from "../../shared/error/appError.js";

export class PermissionController {

    //ADD
    static addPerm = catchAsync(async (req: Request, res: Response) => {

        const newPerm = await PermissionService.createPerm(req.body);

        res.status(201).json({
            success: true, message: "Permission created successfully", data: {
                id: newPerm._id, name: newPerm.name, group: newPerm.group
            }
        })
    });


    //UPDATE
    static updatePerm = catchAsync(async (req: Request, res: Response) => {
        const { id } = req.params;

        if (!id) {
            throw new AppError("Invalid id", 400);
        }

        const update = await PermissionService.updatePerm(id.toString(), req.body);

        return res.status(200).json({
            success: true, message: `${update.name} updated successfully`, data: {
                id: update._id, name: update.name, group: update.group
            }
        });
    });


    //DELETE
    static deletePerm = catchAsync(async (req: Request, res: Response) => {
        const { id } = req.params;

        if (!id) {
            throw new AppError("Invalid id", 400);
        };

        const delPerm = await PermissionService.deletePerm(id.toString());

        return res.status(200).json({ success: true, message: `${delPerm.name} deleted successfully`, data: delPerm });
    });



    //FETCH BY ID
    static fetchById = catchAsync(async (req: Request, res: Response) => {
        const { id } = req.params;

        if (!id) {
            throw new AppError("Invalid id", 400);
        }

        const perm = await PermissionService.getPermById(id.toString());

        return res.status(200).json({
            success: true, message: `${perm.name} fetch successfully`, data: {
                id: perm._id, name: perm.name, group: perm.group
            }
        });
    });



    //FETCH ALL
    static fetchAll = catchAsync(async (req: Request, res: Response) => {
        const permissions = await PermissionService.getAllPerm(req.query);

        return res.status(200).json({
            success: true, message: "Permissions fetched successfully", data: permissions.data.map(perm => ({
                id: perm._id,
                name: perm.name,
                group: perm.group,
            })),
            pagination: permissions.pagination,
        });
    });


}