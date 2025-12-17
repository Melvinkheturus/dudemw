import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  ShoppingCart, 
  Package, 
  User, 
  CreditCard, 
  AlertTriangle,
  CheckCircle 
} from "lucide-react"

interface Activity {
  type: "order" | "inventory" | "customer" | "payment"
  title: string
  description: string
  time: string
  icon: any
  status: "new" | "warning" | "success" | "info"
}

interface RecentActivityProps {
  activities: Activity[]
}

const statusColors = {
  new: "default",
  warning: "destructive",
  success: "outline",
  info: "secondary",
} as const

const iconColors = {
  new: "text-blue-500",
  warning: "text-red-500",
  success: "text-green-500",
  info: "text-gray-500",
} as const

export function RecentActivity({ activities }: RecentActivityProps) {
  if (activities.length === 0) {
    return null
  }
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-4">
        <div>
          <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">Recent Activity</CardTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Latest system activities and updates</p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div key={index} className="flex items-start space-x-4 p-3 rounded-lg bg-gray-50/50 dark:bg-gray-800/30 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors">
              <div className={`p-2 rounded-xl ${
                activity.status === 'new' ? 'bg-blue-100 dark:bg-blue-900/30' :
                activity.status === 'warning' ? 'bg-red-100 dark:bg-red-900/30' :
                activity.status === 'success' ? 'bg-green-100 dark:bg-green-900/30' :
                'bg-gray-100 dark:bg-gray-800/50'
              }`}>
                <activity.icon className={`h-4 w-4 ${
                  activity.status === 'new' ? 'text-blue-600 dark:text-blue-400' :
                  activity.status === 'warning' ? 'text-red-600 dark:text-red-400' :
                  activity.status === 'success' ? 'text-green-600 dark:text-green-400' :
                  'text-gray-600 dark:text-gray-400'
                }`} />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{activity.title}</p>
                  <Badge 
                    className={`text-xs font-medium ${
                      activity.status === 'new' ? 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800' :
                      activity.status === 'warning' ? 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800' :
                      activity.status === 'success' ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800' :
                      'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800/50 dark:text-gray-300 dark:border-gray-700'
                    }`}
                  >
                    {activity.status}
                  </Badge>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300">{activity.description}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
