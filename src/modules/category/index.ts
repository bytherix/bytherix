import { CategoryService } from './category.service.js';

// Expose only the functions needed by courses module
export const getCatById = CategoryService.getCatId;
export const getCategoryById = CategoryService.getById;