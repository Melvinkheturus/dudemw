import { InventoryTable } from "@/domains/admin/inventory/inventory-table"
import { InventoryFilters } from "@/domains/admin/inventory/inventory-filters"
import { InventoryEmptyState } from "@/components/common/empty-states"
import { Button } from "@/components/ui/button"
import { Download, Upload, AlertTriangle, Plus } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function InventoryPage() {
  // Simulate empty state - in real app, this would come from your data source
  const hasInventory = false // Change to true to see the normal view
  
  if (!hasInventory) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">Inventory</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">
              Monitor stock levels and manage inventory
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" className="border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300 dark:border-red-800 dark:text-red-300 dark:hover:bg-red-950/30">
              <Upload className="mr-2 h-4 w-4" />
              Import
            </Button>
            <Button className="bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/25" asChild>
              <Link href="/admin/products/create">
                <Plus className="mr-2 h-4 w-4" />
                Add Products
              </Link>
            </Button>
          </div>
        </div>
        
        <InventoryEmptyState />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">Inventory</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">
            Monitor stock levels and manage inventory
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" className="border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300 dark:border-red-800 dark:text-red-300 dark:hover:bg-red-950/30">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" className="border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300 dark:border-red-800 dark:text-red-300 dark:hover:bg-red-950/30">
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
        </div>
      </div>
      
      {/* Quick Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="border-0 shadow-sm bg-gradient-to-b from-white to-red-50 dark:from-gray-900 dark:to-red-950/20 border-red-100/50 dark:border-red-900/20 hover:shadow-md transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-gray-700 dark:text-gray-300">Total Products</CardTitle>
            <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-900/30">
              <AlertTriangle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">156</div>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Across all variants
            </p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm bg-gradient-to-b from-white to-red-50 dark:from-gray-900 dark:to-red-950/20 border-red-100/50 dark:border-red-900/20 hover:shadow-md transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-gray-700 dark:text-gray-300">Low Stock</CardTitle>
            <div className="p-2 rounded-xl bg-red-100 dark:bg-red-900/30">
              <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-3xl font-bold text-red-600 dark:text-red-400 mb-2">12</div>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Need restocking
            </p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm bg-gradient-to-b from-white to-red-50 dark:from-gray-900 dark:to-red-950/20 border-red-100/50 dark:border-red-900/20 hover:shadow-md transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-gray-700 dark:text-gray-300">Out of Stock</CardTitle>
            <div className="p-2 rounded-xl bg-orange-100 dark:bg-orange-900/30">
              <AlertTriangle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">3</div>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Currently unavailable
            </p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm bg-gradient-to-b from-white to-red-50 dark:from-gray-900 dark:to-red-950/20 border-red-100/50 dark:border-red-900/20 hover:shadow-md transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-gray-700 dark:text-gray-300">Total Value</CardTitle>
            <div className="p-2 rounded-xl bg-green-100 dark:bg-green-900/30">
              <AlertTriangle className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">₹2,45,670</div>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Current inventory value
            </p>
          </CardContent>
        </Card>
      </div>
      
      <InventoryFilters />
      <InventoryTable />
    </div>
  )
}
