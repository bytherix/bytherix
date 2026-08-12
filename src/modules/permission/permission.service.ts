import { AppError } from "../../shared/error/appError.js";
import { getPagination, getPaginationMeta } from "../../shared/helper/pagination.js";
import { Permission, type IPermission } from "./permission.model.js";


//INPUT PAYLOADS
class PermissionPayload {
    public readonly name: string;
    public readonly group: string;

    constructor(data: Partial<IPermission>) {
        if (!data || !data.name || !data.group) {
            throw new AppError("Please fill all the required fields", 400);
        };

        this.name = data.name.toLowerCase().trim();
        this.group = data.group.toLowerCase().trim();
    }
}



export class PermissionService {

    //ADD
    static async createPerm(data: IPermission) {
        const input = new PermissionPayload(data);

        const checkPerm = await Permission.findOne({ name: input.name });

        if (checkPerm) {
            throw new AppError("Permission with same name already exists", 409);
        };

        return await Permission.create({ name: input.name, group: input.group });
    };


    //UPDATE
    static async updatePerm(id: string, data: IPermission) {

        if (!id) {
            throw new AppError("Invalid id", 400);
        }

        const permission = await Permission.findById(id);

        if (!permission) {
            throw new AppError("Permission not found", 404);
        }

        const input = new PermissionPayload(data);

        const duplicateCheck = await Permission.findOne({ name: input.name, _id: { $ne: id } });

        if (duplicateCheck) {
            throw new AppError("Another permission with this name already exists", 409);
        }

        permission.name = input.name;
        permission.group = input.group;

        await permission.save();
        return permission;
    }


    //DELETE
    static async deletePerm(id: string) {

        if (!id) {
            throw new AppError("Invalid id", 400);
        }

        const permission = await Permission.findByIdAndDelete(id);

        if (!permission) {
            throw new AppError("Permission not found", 404);
        }

        return permission;
    }


    //FETCH BY ID
    static async getPermById(id: string) {
        if (!id) {
            throw new AppError("Invalid id", 400);
        }

        const permission = await Permission.findById(id);

        if (!permission) {
            throw new AppError("Permission not found", 404);
        }

        return permission;
    }


    //FETCH ALL
    static async getAllPerm(query: { page?: number | string; limit?: number | string }) {

        const { page, limit, skip } = getPagination(query);

        const [permissions, total] = await Promise.all([
            Permission.find()
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            Permission.countDocuments(),
        ]);

        return {
            data: permissions,
            pagination: getPaginationMeta({
                total,
                page,
                limit,
            }),
        };
    };


    //PERMISSION NAME
    static async permName(name: string) {
        const permission = await Permission.findOne({ name });

        if (!permission) {
            throw new AppError("Permission not found", 404);
        }

        return {
            id: permission._id, name: permission.name, group: permission.group
        }
    }


    //VALIDATE PERMISSIONS
    static async validatePermissionsIds(ids: string[]) {

        if (!Array.isArray(ids) || ids.length === 0)
            throw new AppError("Permissions are required", 400);

        const permissions = await Permission.find({ _id: { $in: ids } });

        if (permissions.length !== ids.length)
            throw new AppError("One or more permissions do not exist", 404);

        return permissions;
    }
}