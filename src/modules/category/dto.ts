export interface CreateCategoryInput {
  name: string;
  desc: string;
}

export interface UpdateCategoryInput extends Partial<CreateCategoryInput> { }

export interface CategoryOutput {
  id: string;
  name: string;
  desc: string;
  createdAt: Date;
  updatedAt: Date;
}