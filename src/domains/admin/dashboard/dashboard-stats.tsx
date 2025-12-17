import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Package, Users } from "lucide-react"

interface DashboardStatsProps {
  stats: {
    revenue: number
    orders: number
    aov: number
    customers: number
  }
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  const statsConfig = [
    {
      title: "Revenue",
      value: `₹${stats.revenue.toLocaleString()}`,
      change: stats.revenue > 0 ? "+0%" : "0%",
      trend: "up" as const,
      period: "from last month",
      icon: DollarSign,
    },
    {
      title: "Orders",
      value: stats.orders.toString(),
      change: stats.orders > 0 ? "+0%" : "0%",
      trend: "up" as const,
      period: "from last week",
      icon: ShoppingCart,
    },
    {
      title: "AOV",
      value: `₹${stats.aov.toLocaleString()}`,
      change: stats.aov > 0 ? "+0%" : "0%",
      trend: "up" as const,
      period: "from last month",
      icon: Package,
    },
    {
      title: "Customers",
      value: stats.customers.toString(),
      change: stats.customers > 0 ? "+0%" : "0%",
      trend: "up" as const,
      period: "new this month",
      icon: Users,
    },
  ]
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {statsConfig.map((stat) => (
        <Card key={stat.title} className="border-0 shadow-sm bg-gradient-to-b from-white to-red-50 dark:from-gray-900 dark:to-red-950/20 border-red-100/50 dark:border-red-900/20 hover:shadow-md transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              {stat.title}
            </CardTitle>
            <div className={`p-2 rounded-xl ${
              stat.title === "Revenue" ? "bg-green-100 dark:bg-green-900/30" :
              stat.title === "Orders" ? "bg-blue-100 dark:bg-blue-900/30" :
              stat.title === "AOV" ? "bg-purple-100 dark:bg-purple-900/30" :
              "bg-red-100 dark:bg-red-900/30"
            }`}>
              <stat.icon className={`h-4 w-4 ${
                stat.title === "Revenue" ? "text-green-600 dark:text-green-400" :
                stat.title === "Orders" ? "text-blue-600 dark:text-blue-400" :
                stat.title === "AOV" ? "text-purple-600 dark:text-purple-400" :
                "text-red-600 dark:text-red-400"
              }`} />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{stat.value}</div>
            <div className="flex items-center space-x-2 text-xs">
              <Badge
                variant={stat.trend === "up" ? "default" : "destructive"}
                className={`flex items-center space-x-1 px-2 py-1 ${
                  stat.trend === "up" 
                    ? "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800" 
                    : "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800"
                }`}
              >
                {stat.trend === "up" ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                <span className="font-medium">{stat.change}</span>
              </Badge>
              <span className="text-gray-600 dark:text-gray-400">{stat.period}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
