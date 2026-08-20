import type { Request, Response } from "express";
import { catchAsync } from "../../shared/error/catchAsync.js";
import { CategoryService } from "./category.service.js";
import { AppError } from "../../shared/error/appError.js";


export class CategoryController {

    //ADD
    static addCat = catchAsync(async (req: Request, res: Response) => {
        const data = await CategoryService.createCat(req.body);

        return res.status(201).json({
            success: true, message: "Category added successfully", data: {
                id: data.id, name: data.name, desc: data.desc
            }
        });
    });


    //UPDATE
    static updateCat = catchAsync(async (req: Request, res: Response) => {

        const { id } = req.params;

        if (!id) {
            throw new AppError("Invalid id", 400);
        }

        const data = await CategoryService.updateCat(id.toString(), req.body)

        return res.status(201).json(data);
    });


    //DELETE
    static deleteCat = catchAsync(async (req: Request, res: Response) => {
        const { id } = req.params;

        if (!id) {
            throw new AppError("Invalid id", 400);
        }

        const data = await CategoryService.deleteCat(id.toString());

        return res.status(200).json(data);
    });


    //GET BY ID
    static fetchById = catchAsync(async (req: Request, res: Response) => {
        const { id } = req.params;

        if (!id) {
            throw new AppError("Invalid id", 400);
        }

        const data = await CategoryService.getById(id.toString());

        return res.status(200).json(data);
    });


    //GET ALL
    static fetchAll = catchAsync(async (req: Request, res: Response) => {
        const { page, limit } = req.query;

        const data = await CategoryService.getAll({
            page: page as string | undefined,
            limit: limit as string | undefined,
        });

        return res.status(200).json(data);
    });
}