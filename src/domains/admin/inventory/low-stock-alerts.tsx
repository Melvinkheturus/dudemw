import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Package } from "lucide-react"
import Link from "next/link"

interface LowStockItem {
  name: string
  variant: string
  stock: number
  threshold: number
}

interface LowStockAlertsProps {
  items: LowStockItem[]
}

export function LowStockAlerts({ items }: LowStockAlertsProps) {
  const handleItemAction = (itemName: string) => {
    // TODO: Implement item action
    console.log(`Manage stock for: ${itemName}`)
  }

  if (items.length === 0) {
    return null
  }
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="flex items-center space-x-2">
          <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
            <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <span className="text-lg font-semibold text-gray-900 dark:text-white">Low Stock Alerts</span>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-normal">Items running low</p>
          </div>
        </CardTitle>
        <Badge className="bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800 font-semibold">
          {items.length}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50/50 dark:bg-gray-800/30 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{item.name}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">{item.variant}</p>
            </div>
            <div className="flex items-center space-x-3">
              <Badge 
                variant={item.stock === 0 ? "destructive" : "secondary"}
                className={`${
                  item.stock === 0 
                    ? 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800' 
                    : 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800'
                } font-medium`}
              >
                {item.stock} left
              </Badge>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0 hover:bg-gray-200 dark:hover:bg-gray-700"
                onClick={() => handleItemAction(item.name)}
              >
                <Package className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
        <Button variant="outline" className="w-full mt-4 border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300 dark:border-red-800 dark:text-red-300 dark:hover:bg-red-950/30" asChild>
          <Link href="/admin/inventory">
            Manage Inventory
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
