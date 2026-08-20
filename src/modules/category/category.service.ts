import type { PaginationQuery } from "../../shared/helper/pagination.js";
import type { ICategory } from "./category.model.js";
import { CategoryRepository } from "./category.repository.js";
import type { CreateCategoryInput, UpdateCategoryInput, CategoryOutput } from "./dto.js";

export class CategoryService {

    //CREATE
    static async createCat(data: ICategory): Promise<CategoryOutput> {
        const repositoryData: CreateCategoryInput = {
            name: data.name,
            desc: data.desc
        };
        const result = await CategoryRepository.create(repositoryData);
        return result;
    }

    //UPDATE
    static async updateCat(id: string, data: Partial<ICategory>): Promise<{ success: boolean; message: string; updatedData: CategoryOutput }> {
        const repositoryData: UpdateCategoryInput = {
            name: data.name,
            desc: data.desc
        };
        const result = await CategoryRepository.update(id, repositoryData);
        return {
            success: true,
            message: `${result.name} updated successfully`,
            updatedData: result
        };
    }

    //DELETE
    static async deleteCat(id: string): Promise<{ success: boolean; message: string; data: CategoryOutput | null }> {
        const result = await CategoryRepository.delete(id);
        if (result.data) {
            return {
                success: true,
                message: `${result.data.name} deleted successfully`,
                data: {
                    id: result.data._id.toString(),
                    name: result.data.name,
                    desc: result.data.desc,
                    createdAt: result.data.createdAt,
                    updatedAt: result.data.updatedAt,
                }
            };
        }
        return {
            success: false,
            message: "Category not found",
            data: null
        };
    }

    //FETCH BY ID
    static async getById(id: string): Promise<CategoryOutput> {
        const result = await CategoryRepository.getById(id);
        // Repository already returns CategoryOutput with string id
        return result;
    }

    //FETCH ALL
    static async getAll(query: PaginationQuery = {}): Promise<{
        success: boolean;
        message: string;
        data: CategoryOutput[];
        meta: any;
    }> {
        const result = await CategoryRepository.getAll(query);
        return {
            success: true,
            message: "Categories fetched successfully",
            data: result.data,
            meta: result.meta,
        };
    }

    //CATEGORY VALIDATION
    static async getCatId(id: string): Promise<CategoryOutput> {
        const result = await CategoryRepository.getById(id);
        return result;
    }
}