import { AppError } from "../../shared/error/appError.js";
import { getPagination, getPaginationMeta, type PaginationQuery } from "../../shared/helper/pagination.js";
import { Category, type ICategory } from "./category.model.js";
import type { CreateCategoryInput, UpdateCategoryInput, CategoryOutput } from "./dto.js";

export class CategoryRepository {
  // CREATE
  static async create(data: CreateCategoryInput): Promise<CategoryOutput> {
    const category = await Category.create(data);
    return {
      id: category._id.toString(),
      name: category.name,
      desc: category.desc,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    };
  }

  // UPDATE
  static async update(id: string, data: UpdateCategoryInput): Promise<CategoryOutput> {
    const category = await Category.findByIdAndUpdate(id, data, { new: true, runValidators: true });

    if (!category) {
      throw new AppError("Category not found", 404);
    }

    return {
      id: category._id.toString(),
      name: category.name,
      desc: category.desc,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    };
  }

  // DELETE
  static async delete(id: string): Promise<{ success: boolean; message: string; data: ICategory | null }> {
    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      throw new AppError("Category not found", 404);
    }

    return {
      success: true,
      message: `${category.name} deleted successfully`,
      data: category
    };
  }

  // FETCH BY ID
  static async getById(id: string): Promise<CategoryOutput> {
    const category = await Category.findById(id);

    if (!category) {
      throw new AppError("Category not found", 404);
    }

    return {
      id: category._id.toString(),
      name: category.name,
      desc: category.desc,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    };
  }

  // FETCH ALL
  static async getAll(query: PaginationQuery = {}): Promise<{
    success: boolean;
    message: string;
    data: CategoryOutput[];
    meta: any;
  }> {
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
      id: cat._id.toString(),
      name: cat.name,
      desc: cat.desc,
      createdAt: cat.createdAt,
      updatedAt: cat.updatedAt,
    }));

    const paginationMeta = getPaginationMeta({ total, page, limit });

    return {
      success: true,
      message: "Categories fetched successfully",
      data: formattedCategories,
      meta: paginationMeta,
    };
  }
}