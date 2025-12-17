"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Eye, MoreHorizontal, Package, Truck, X } from "lucide-react"

interface Order {
  id: string
  customer: string
  email: string
  items: number
  total: string
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  paymentStatus: "paid" | "pending" | "failed"
  date: string
  address: string
}

interface OrdersTableProps {
  orders: Order[]
}

const statusColors = {
  pending: "destructive",
  processing: "secondary",
  shipped: "default",
  delivered: "outline",
  cancelled: "destructive",
} as const

const paymentStatusColors = {
  paid: "outline",
  pending: "secondary",
  failed: "destructive",
} as const

export function OrdersTable({ orders }: OrdersTableProps) {
  const [selectedOrders, setSelectedOrders] = useState<string[]>([])

  const toggleOrder = (orderId: string) => {
    setSelectedOrders(prev =>
      prev.includes(orderId)
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    )
  }

  const toggleAll = () => {
    setSelectedOrders(prev =>
      prev.length === orders.length ? [] : orders.map(order => order.id)
    )
  }

  const handleBulkAction = (action: string) => {
    // TODO: Implement bulk actions
    console.log(`Bulk action: ${action} for orders:`, selectedOrders)
    setSelectedOrders([])
  }

  const handleOrderAction = (orderId: string, action: string) => {
    // TODO: Implement individual order actions
    console.log(`Action: ${action} for order: ${orderId}`)
  }

  if (orders.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      {selectedOrders.length > 0 && (
        <div className="flex items-center justify-between p-4 bg-red-50/50 dark:bg-red-950/20 rounded-xl border border-red-200/50 dark:border-red-800/50">
          <span className="text-sm font-semibold text-gray-900 dark:text-white">
            {selectedOrders.length} order(s) selected
          </span>
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300 dark:border-red-800 dark:text-red-300 dark:hover:bg-red-950/30"
              onClick={() => handleBulkAction('processing')}
            >
              <Package className="mr-2 h-4 w-4" />
              Mark as Processing
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300 dark:border-red-800 dark:text-red-300 dark:hover:bg-red-950/30"
              onClick={() => handleBulkAction('shipped')}
            >
              <Truck className="mr-2 h-4 w-4" />
              Mark as Shipped
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300 dark:border-red-800 dark:text-red-300 dark:hover:bg-red-950/30"
              onClick={() => handleBulkAction('cancelled')}
            >
              <X className="mr-2 h-4 w-4" />
              Cancel Orders
            </Button>
          </div>
        </div>
      )}

      <div className="rounded-xl border-0 shadow-sm bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/50 dark:bg-gray-800/50 hover:bg-gray-50/80 dark:hover:bg-gray-800/80 border-b border-gray-200/60 dark:border-gray-700/60">
              <TableHead className="w-12 font-semibold text-gray-700 dark:text-gray-300">
                <Checkbox
                  checked={selectedOrders.length === orders.length}
                  onCheckedChange={toggleAll}
                />
              </TableHead>
              <TableHead className="font-semibold text-gray-700 dark:text-gray-300">Order ID</TableHead>
              <TableHead className="font-semibold text-gray-700 dark:text-gray-300">Customer</TableHead>
              <TableHead className="font-semibold text-gray-700 dark:text-gray-300">Items</TableHead>
              <TableHead className="font-semibold text-gray-700 dark:text-gray-300">Total</TableHead>
              <TableHead className="font-semibold text-gray-700 dark:text-gray-300">Status</TableHead>
              <TableHead className="font-semibold text-gray-700 dark:text-gray-300">Payment</TableHead>
              <TableHead className="font-semibold text-gray-700 dark:text-gray-300">Date</TableHead>
              <TableHead className="font-semibold text-gray-700 dark:text-gray-300">Address</TableHead>
              <TableHead className="text-right font-semibold text-gray-700 dark:text-gray-300">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors border-b border-gray-100 dark:border-gray-800/50">
                <TableCell>
                  <Checkbox
                    checked={selectedOrders.includes(order.id)}
                    onCheckedChange={() => toggleOrder(order.id)}
                  />
                </TableCell>
                <TableCell className="font-mono font-semibold text-gray-900 dark:text-white">{order.id}</TableCell>
                <TableCell>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">{order.customer}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{order.email}</div>
                  </div>
                </TableCell>
                <TableCell className="text-gray-700 dark:text-gray-300">{order.items}</TableCell>
                <TableCell className="font-semibold text-gray-900 dark:text-white">{order.total}</TableCell>
                <TableCell>
                  <Badge 
                    className={`font-medium ${
                      order.status === 'pending' ? 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800' :
                      order.status === 'processing' ? 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800' :
                      order.status === 'shipped' ? 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800' :
                      order.status === 'delivered' ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800' :
                      'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700'
                    }`}
                  >
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge 
                    className={`font-medium ${
                      order.paymentStatus === 'paid' ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800' :
                      order.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800' :
                      'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800'
                    }`}
                  >
                    {order.paymentStatus}
                  </Badge>
                </TableCell>
                <TableCell className="text-gray-600 dark:text-gray-400">{order.date}</TableCell>
                <TableCell className="text-gray-600 dark:text-gray-400">{order.address}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => handleOrderAction(order.id, 'view')}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleOrderAction(order.id, 'processing')}>
                        <Package className="mr-2 h-4 w-4" />
                        Mark as Processing
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleOrderAction(order.id, 'shipped')}>
                        <Truck className="mr-2 h-4 w-4" />
                        Mark as Shipped
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-red-600 dark:text-red-400"
                        onClick={() => handleOrderAction(order.id, 'cancel')}
                      >
                        <X className="mr-2 h-4 w-4" />
                        Cancel Order
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
