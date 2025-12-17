"use client"

import { useState } from "react"
import { OrdersTable } from "@/domains/admin/orders/orders-table"
import { OrdersFilters } from "@/domains/admin/orders/orders-filters"
import { OrdersEmptyState } from "@/components/common/empty-states"
import { Button } from "@/components/ui/button"
import { Plus, Download } from "lucide-react"

export default function OrdersPage() {
  const [orders, setOrders] = useState([]) // Start with empty array
  const [isLoading, setIsLoading] = useState(false)

  const handleCreateOrder = () => {
    // TODO: Implement create order functionality
    console.log("Create order clicked")
  }

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log("Export clicked")
  }

  const hasOrders = orders.length > 0

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">Orders</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">
            Manage customer orders and fulfillment
          </p>
        </div>
        {hasOrders && (
          <div className="flex items-center space-x-3">
            <Button 
              variant="outline" 
              className="border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300 dark:border-red-800 dark:text-red-300 dark:hover:bg-red-950/30"
              onClick={handleExport}
            >
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button 
              className="bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/25"
              onClick={handleCreateOrder}
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Order
            </Button>
          </div>
        )}
      </div>
      
      {hasOrders ? (
        <>
          <OrdersFilters />
          <OrdersTable orders={orders} />
        </>
      ) : (
        <OrdersEmptyState />
      )}
    </div>
  )
}
