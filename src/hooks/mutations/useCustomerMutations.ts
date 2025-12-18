import { useMutation, useQueryClient } from '@tanstack/react-query'
import { exportCustomersAction } from '@/lib/actions/customers'
import { customerKeys } from '../queries/useCustomers'
import { toast } from 'sonner'

/**
 * Mutation hook for exporting customers to CSV
 */
export function useExportCustomers() {
  return useMutation({
    mutationFn: async (filters?: any) => {
      const result = await exportCustomersAction(filters)
      if (!result.success) {
        throw new Error(result.error || 'Failed to export customers')
      }
      return result
    },
    onSuccess: () => {
      toast.success('Customers exported successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to export customers')
    },
  })
}

/**
 * Mutation hook for sending email to customer
 * Note: Email functionality would need to be implemented server-side
 */
export function useSendCustomerEmail() {
  return useMutation({
    mutationFn: async ({
      customerId,
      subject,
      message,
    }: {
      customerId: string
      subject: string
      message: string
    }) => {
      // TODO: Implement server action for sending emails
      throw new Error('Email functionality not yet implemented')
    },
    onSuccess: () => {
      toast.success('Email sent successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to send email')
    },
  })
}
