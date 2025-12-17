import { supabase } from '@/lib/supabase/supabase';
import { Category, CategoryWithChildren, CategoryFilters, CreateCategoryData, UpdateCategoryData } from '../types';

class CategoryService {
  async getCategories(filters?: CategoryFilters): Promise<Category[]> {
    let query = supabase
      .from('categories')
      .select('*')
      .order('name');

    if (filters?.parent_id) {
      query = query.eq('parent_id', filters.parent_id);
    } else if (filters?.parent_id === null) {
      query = query.is('parent_id', null);
    }

    if (filters?.search) {
      query = query.ilike('name', `%${filters.search}%`);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Failed to fetch categories: ${error.message}`);
    }

    return data || [];
  }

  async getCategoryTree(): Promise<CategoryWithChildren[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (error) {
      throw new Error(`Failed to fetch categories: ${error.message}`);
    }

    // Build tree structure
    const categoryMap = new Map<string, CategoryWithChildren>();
    const rootCategories: CategoryWithChildren[] = [];

    // First pass: create all category objects
    data?.forEach(category => {
      categoryMap.set(category.id, { 
        ...category, 
        children: [] 
      });
    });

    // Second pass: build tree structure
    data?.forEach(category => {
      const categoryWithChildren = categoryMap.get(category.id)!;
      
      if (category.parent_id) {
        const parent = categoryMap.get(category.parent_id);
        if (parent) {
          parent.children.push(categoryWithChildren);
        }
      } else {
        rootCategories.push(categoryWithChildren);
      }
    });

    return rootCategories;
  }

  async getCategoryById(id: string): Promise<Category> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw new Error(`Failed to fetch category: ${error.message}`);
    }

    return data;
  }

  async getCategoryBySlug(slug: string): Promise<Category> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      throw new Error(`Failed to fetch category: ${error.message}`);
    }

    return data;
  }

  async createCategory(data: CreateCategoryData): Promise<Category> {
    const { data: category, error } = await supabase
      .from('categories')
      .insert([data])
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create category: ${error.message}`);
    }

    return category;
  }

  async updateCategory(id: string, data: UpdateCategoryData): Promise<Category> {
    const { data: category, error } = await supabase
      .from('categories')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update category: ${error.message}`);
    }

    return category;
  }

  async deleteCategory(id: string): Promise<void> {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete category: ${error.message}`);
    }
  }
}

export const categoryService = new CategoryService();
