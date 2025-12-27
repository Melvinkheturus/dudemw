import { supabaseAdmin } from '@/lib/supabase/supabase'
import {
  Supplier,
  SupplierProduct,
  CreateSupplierInput,
  UpdateSupplierInput,
  SupplierFilters,
} from '@/lib/types/supplier'

export class SupplierService {
  /**
   * Get all suppliers with optional filtering
   */
  static async getSuppliers(filters?: SupplierFilters) {
    try {
      let query = supabaseAdmin.from('suppliers').select('*')

      if (filters?.search) {
        query = query.or(`name.ilike.%${filters.search}%,contact_person.ilike.%${filters.search}%,email.ilike.%${filters.search}%`)
      }

      if (filters?.is_active !== undefined) {
        query = query.eq('is_active', filters.is_active)
      }

      const { data, error } = await query.order('name', { ascending: true })

      if (error) throw error

      return { success: true, data: data as Supplier[] }
    } catch (error) {
      console.error('Error fetching suppliers:', error)
      return { success: false, error: 'Failed to fetch suppliers' }
    }
  }

  /**
   * Get a single supplier by ID
   */
  static async getSupplier(id: string) {
    try {
      const { data, error } = await supabaseAdmin
        .from('suppliers')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error

      return { success: true, data: data as Supplier }
    } catch (error) {
      console.error('Error fetching supplier:', error)
      return { success: false, error: 'Failed to fetch supplier' }
    }
  }

  /**
   * Create a new supplier
   */
  static async createSupplier(input: CreateSupplierInput) {
    try {
      const { data, error } = await supabaseAdmin
        .from('suppliers')
        .insert({
          ...input,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (error) throw error

      return { success: true, data: data as Supplier }
    } catch (error) {
      console.error('Error creating supplier:', error)
      return { success: false, error: 'Failed to create supplier' }
    }
  }

  /**
   * Update an existing supplier
   */
  static async updateSupplier(id: string, input: UpdateSupplierInput) {
    try {
      const { data, error } = await supabaseAdmin
        .from('suppliers')
        .update({
          ...input,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      return { success: true, data: data as Supplier }
    } catch (error) {
      console.error('Error updating supplier:', error)
      return { success: false, error: 'Failed to update supplier' }
    }
  }

  /**
   * Delete a supplier
   */
  static async deleteSupplier(id: string) {
    try {
      const { error } = await supabaseAdmin.from('suppliers').delete().eq('id', id)

      if (error) throw error

      return { success: true }
    } catch (error) {
      console.error('Error deleting supplier:', error)
      return { success: false, error: 'Failed to delete supplier' }
    }
  }

  /**
   * Link a product to a supplier
   */
  static async linkProductToSupplier(supplierProduct: Omit<SupplierProduct, 'id' | 'created_at' | 'updated_at'>) {
    try {
      const { data, error } = await supabaseAdmin
        .from('supplier_products')
        .insert({
          ...supplierProduct,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (error) throw error

      return { success: true, data: data as unknown as SupplierProduct }
    } catch (error) {
      console.error('Error linking product to supplier:', error)
      return { success: false, error: 'Failed to link product to supplier' }
    }
  }

  /**
   * Get all products for a supplier
   */
  static async getSupplierProducts(supplierId: string) {
    try {
      const { data, error } = await supabaseAdmin
        .from('supplier_products')
        .select(`
          *,
          products (
            id,
            title
          ),
          product_variants (
            id,
            name,
            sku
          )
        `)
        .eq('supplier_id', supplierId)

      if (error) throw error

      return { success: true, data }
    } catch (error) {
      console.error('Error fetching supplier products:', error)
      return { success: false, error: 'Failed to fetch supplier products' }
    }
  }
}
