import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Eye, Package } from "lucide-react"
import Link from "next/link"

interface Order {
  id: string
  customer: string
  items: number
  total: string
  status: "pending" | "processing" | "shipped" | "delivered"
  date: string
}

interface RecentOrdersProps {
  orders: Order[]
}

const statusColors = {
  pending: "destructive",
  processing: "secondary",
  shipped: "default",
  delivered: "outline",
} as const

export function RecentOrders({ orders }: RecentOrdersProps) {
  const handleOrderAction = (orderId: string, action: string) => {
    // TODO: Implement order actions
    console.log(`Action: ${action} for order: ${orderId}`)
  }

  if (orders.length === 0) {
    return null
  }
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div>
          <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">Orders Needing Action</CardTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Recent orders requiring your attention</p>
        </div>
        <Button variant="outline" size="sm" className="border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300 dark:border-red-800 dark:text-red-300 dark:hover:bg-red-950/30" asChild>
          <Link href="/admin/orders">
            View All Orders
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-hidden rounded-lg border border-gray-200/60 dark:border-gray-800/60">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/50 dark:bg-gray-800/50 hover:bg-gray-50/80 dark:hover:bg-gray-800/80">
                <TableHead className="font-semibold text-gray-700 dark:text-gray-300">Order ID</TableHead>
                <TableHead className="font-semibold text-gray-700 dark:text-gray-300">Customer</TableHead>
                <TableHead className="font-semibold text-gray-700 dark:text-gray-300">Items</TableHead>
                <TableHead className="font-semibold text-gray-700 dark:text-gray-300">Total</TableHead>
                <TableHead className="font-semibold text-gray-700 dark:text-gray-300">Status</TableHead>
                <TableHead className="font-semibold text-gray-700 dark:text-gray-300">Date</TableHead>
                <TableHead className="text-right font-semibold text-gray-700 dark:text-gray-300">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                  <TableCell className="font-mono font-medium text-gray-900 dark:text-white">{order.id}</TableCell>
                  <TableCell className="font-medium text-gray-900 dark:text-white">{order.customer}</TableCell>
                  <TableCell className="text-gray-700 dark:text-gray-300">{order.items}</TableCell>
                  <TableCell className="font-semibold text-gray-900 dark:text-white">{order.total}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={statusColors[order.status as keyof typeof statusColors]}
                      className={`${
                        order.status === 'pending' ? 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800' :
                        order.status === 'processing' ? 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800' :
                        order.status === 'shipped' ? 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800' :
                        'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800'
                      } font-medium`}
                    >
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-400">{order.date}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-1">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
                        onClick={() => handleOrderAction(order.id, 'view')}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
                        onClick={() => handleOrderAction(order.id, 'process')}
                      >
                        <Package className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
