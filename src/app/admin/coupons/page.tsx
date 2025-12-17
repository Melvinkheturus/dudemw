import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Percent, Users, Calendar, Copy, Edit, Trash2, Eye, EyeOff } from "lucide-react"

const coupons = [
  {
    id: 1,
    code: "WINTER20",
    description: "20% off winter collection",
    type: "percentage",
    value: 20,
    minOrder: 1000,
    usageLimit: 100,
    usedCount: 45,
    status: "active",
    startDate: "2024-01-01",
    endDate: "2024-02-29",
  },
  {
    id: 2,
    code: "FLAT500",
    description: "Flat ₹500 off on orders above ₹2000",
    type: "fixed",
    value: 500,
    minOrder: 2000,
    usageLimit: 50,
    usedCount: 23,
    status: "active",
    startDate: "2024-01-15",
    endDate: "2024-03-15",
  },
  {
    id: 3,
    code: "NEWUSER",
    description: "15% off for new customers",
    type: "percentage",
    value: 15,
    minOrder: 500,
    usageLimit: 200,
    usedCount: 156,
    status: "inactive",
    startDate: "2024-01-01",
    endDate: "2024-01-31",
  },
]

export default function CouponsPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">Coupons</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">
            Create and manage discount coupons and promotional codes
          </p>
        </div>
        <Button className="bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/25">
          <Plus className="mr-2 h-4 w-4" />
          Create Coupon
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="border-0 shadow-sm bg-gradient-to-b from-white to-red-50 dark:from-gray-900 dark:to-red-950/20 border-red-100/50 dark:border-red-900/20 hover:shadow-md transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Active Coupons
            </CardTitle>
            <div className="p-2 rounded-xl bg-green-100 dark:bg-green-900/30">
              <Percent className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">2</div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Currently running</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-b from-white to-red-50 dark:from-gray-900 dark:to-red-950/20 border-red-100/50 dark:border-red-900/20 hover:shadow-md transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Total Usage
            </CardTitle>
            <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-900/30">
              <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">224</div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Times used</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-b from-white to-red-50 dark:from-gray-900 dark:to-red-950/20 border-red-100/50 dark:border-red-900/20 hover:shadow-md transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Total Discount
            </CardTitle>
            <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-900/30">
              <Percent className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">₹45,670</div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Total savings</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-b from-white to-red-50 dark:from-gray-900 dark:to-red-950/20 border-red-100/50 dark:border-red-900/20 hover:shadow-md transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Expiring Soon
            </CardTitle>
            <div className="p-2 rounded-xl bg-orange-100 dark:bg-orange-900/30">
              <Calendar className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">1</div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Within 7 days</p>
          </CardContent>
        </Card>
      </div>

      {/* Coupons List */}
      <Card className="border-0 shadow-sm bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">All Coupons</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {coupons.map((coupon) => (
              <div key={coupon.id} className="flex items-center justify-between p-4 rounded-xl bg-white/60 dark:bg-gray-800/60 border border-gray-200/50 dark:border-gray-700/50 hover:shadow-md transition-all duration-200">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
                    <Percent className="h-6 w-6 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white font-mono">{coupon.code}</h3>
                      <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-gray-100 dark:hover:bg-gray-800">
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{coupon.description}</p>
                    <div className="flex items-center space-x-4 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {coupon.type === "percentage" ? `${coupon.value}% off` : `₹${coupon.value} off`}
                      </Badge>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Min order: ₹{coupon.minOrder}
                      </span>
                      <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                        <Calendar className="h-3 w-3" />
                        <span>Expires {coupon.endDate}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {coupon.usedCount}/{coupon.usageLimit}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Used</p>
                  </div>
                  <Badge
                    variant={coupon.status === "active" ? "default" : "secondary"}
                    className={coupon.status === "active" 
                      ? "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800" 
                      : "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
                    }
                  >
                    {coupon.status}
                  </Badge>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-gray-100 dark:hover:bg-gray-800">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-gray-100 dark:hover:bg-gray-800">
                      {coupon.status === "active" ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
