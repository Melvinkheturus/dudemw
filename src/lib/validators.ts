import { z } from 'zod'

// Banner validation schema
export const bannerSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  image_url: z.string().url('Valid image URL is required'),
  link_url: z.string().url().optional(),
  placement: z.enum(['homepage', 'category']).default('homepage'),
  is_active: z.boolean().default(true),
})

export type BannerInput = z.infer<typeof bannerSchema>

// Cart validation schemas
export const addToCartSchema = z.object({
  variant_id: z.string().uuid('Valid variant ID is required'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1'),
})

export type AddToCartInput = z.infer<typeof addToCartSchema>

export const updateCartItemSchema = z.object({
  variant_id: z.string().uuid('Valid variant ID is required'),
  quantity: z.number().int().min(0, 'Quantity must be non-negative'),
})

export type UpdateCartItemInput = z.infer<typeof updateCartItemSchema>

// Product validation schema
export const productSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  price: z.number().min(0, 'Price must be non-negative'),
  compare_price: z.number().min(0).optional(),
  status: z.enum(['active', 'draft', 'archived']).default('draft'),
  category_id: z.string().uuid().optional(),
  images: z.array(z.string().url()).default([]),
  sizes: z.array(z.string()).default([]),
  colors: z.array(z.string()).default([]),
  in_stock: z.boolean().default(true),
  is_bestseller: z.boolean().default(false),
  is_new_drop: z.boolean().default(false),
})

export type ProductInput = z.infer<typeof productSchema>
