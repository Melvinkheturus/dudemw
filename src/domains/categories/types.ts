export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  parent_id?: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface CategoryWithChildren extends Category {
  children: CategoryWithChildren[];
}

export interface CategoryFilters {
  parent_id?: string;
  search?: string;
}

export interface CreateCategoryData {
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parent_id?: string;
}

export interface UpdateCategoryData extends Partial<CreateCategoryData> {}
