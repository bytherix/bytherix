import { AppError } from "../../shared/error/appError.js";
import { getPagination, getPaginationMeta, type PaginationQuery } from "../../shared/helper/pagination.js";
import { Category, type ICategory } from "./category.model.js";


//INPUT PAYLOADS
class CatPayload {
    public readonly name: string;
    public readonly desc: string;

    constructor(data: Partial<ICategory>) {
        if (!data || !data.name || !data.desc) {
            throw new AppError("Please fill all the required fields", 400);
        };

        this.name = data.name.toLowerCase().trim();
        this.desc = data.desc.trim();
    }
}


export class CategoryService {


    //CREATE
    static async createCat(data: ICategory) {
        const input = new CatPayload(data);

        const checkCat = await Category.findOne({ name: input.name });

        if (checkCat) {
            throw new AppError("Category with same name already exists", 409);
        }

        const newCat = await Category.create({ name: input.name, desc: input.desc });

        return newCat;
    }

    //UPDATE
    static async updateCat(id: string, data: Partial<ICategory>) {

        const category = await Category.findById(id);

        if (!category) {
            throw new AppError("Invalid id", 404);
        }

        const input = new CatPayload(data);

        const updateData: Partial<ICategory> = {};

        if (input.name) {
            const normalizedName = input.name.toLowerCase().trim();
            const duplicate = await Category.findOne({ name: normalizedName, _id: { $ne: id } });

            if (duplicate) {
                throw new AppError("Category with same name already exists", 409);
            }

            updateData.name = normalizedName;
        }

        if (input.desc) {
            updateData.desc = input.desc.trim();
        }

        const updatedData = await Category.findByIdAndUpdate(id, { $set: updateData }, { new: true, runValidators: true });

        return {
            success: true, message: `${input.name} updated successfully`, updatedData
        };
    };


    //DELETE
    static async deleteCat(id: string) {
        const category = await Category.findByIdAndDelete(id);

        if (!category) {
            throw new AppError("Category not found", 404);
        };

        return {
            success: true, message: `${category.name} deleted successfully`, category
        }
    };


    //FETCH BY ID
    static async getById(id: string) {
        const category = await Category.findById(id);

        if (!category) {
            throw new AppError("Category not found", 404);
        }

        return {
            success: true, message: "Category fetched successfully", data: {
                id: category._id, name: category.name, desc: category.desc
            }
        }
    };


    //FETCH ALL
    static async getAll(query: PaginationQuery = {}) {
        const { page, limit, skip } = getPagination(query);

        const [total, categories] = await Promise.all([
            Category.countDocuments(),
            Category.find()
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
        ]);

        if (!categories || categories.length === 0) {
            throw new AppError("Categories not available", 404);
        }

        const formattedCategories = categories.map((cat) => ({
            id: cat._id,
            name: cat.name,
            desc: cat.desc,
        }));

        const paginationMeta = getPaginationMeta({ total, page, limit });

        return {
            success: true,
            message: "Categories fetched successfully",
            data: formattedCategories,
            meta: paginationMeta,
        };
    }

    //CATEGORY VALIDATION
    static async getCatId(id: string) {
        const category = await Category.findById(id);

        if (!category) {
            throw new AppError("Category not found", 404);
        }

        return category;
    }
}