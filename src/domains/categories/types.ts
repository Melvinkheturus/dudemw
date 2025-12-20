export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  parent_id?: string | null;
  // New media fields
  homepage_thumbnail_url?: string | null;
  homepage_video_url?: string | null;
  plp_square_thumbnail_url?: string | null;
  // Banner management
  selected_banner_id?: string | null;
  // SEO fields
  meta_title?: string | null;
  meta_description?: string | null;
  status?: 'active' | 'inactive';
  display_order?: number;
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
  // New media fields
  homepage_thumbnail_url?: string;
  homepage_video_url?: string;
  plp_square_thumbnail_url?: string;
  // Banner management
  selected_banner_id?: string;
  // SEO fields
  meta_title?: string;
  meta_description?: string;
  status?: 'active' | 'inactive';
  display_order?: number;
}

export interface UpdateCategoryData extends Partial<CreateCategoryData> {}
