"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus, Edit, Trash2, UserPlus, Shield } from "lucide-react"

const adminUsers = [
  {
    id: 1,
    name: "Admin User",
    email: "admin@dudemenswears.com",
    role: "owner",
    status: "active",
    lastLogin: "2 hours ago",
  },
  {
    id: 2,
    name: "Store Manager",
    email: "manager@dudemenswears.com",
    role: "admin",
    status: "active",
    lastLogin: "1 day ago",
  },
  {
    id: 3,
    name: "Support Staff",
    email: "support@dudemenswears.com",
    role: "staff",
    status: "active",
    lastLogin: "3 days ago",
  },
]

const roleColors = {
  owner: "destructive",
  admin: "default",
  staff: "secondary",
} as const

const statusColors = {
  active: "outline",
  inactive: "secondary",
} as const

export function AdminUsersSettings() {
  const [isAddUserOpen, setIsAddUserOpen] = useState(false)

  return (
    <div className="w-full max-w-full overflow-x-hidden">
      <div className="space-y-6 w-full">
      <Card className="border-0 shadow-sm bg-gradient-to-b from-white to-red-50 dark:from-gray-900 dark:to-red-950/20 border-red-100/50 dark:border-red-900/20 hover:shadow-md transition-all duration-200">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">Admin Users</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Manage admin access and permissions for your store
            </CardDescription>
          </div>
          <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Admin User</DialogTitle>
                <DialogDescription>
                  Create a new admin user account with specific permissions
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 w-full">
                  <div className="space-y-2 min-w-0">
                    <Label htmlFor="userName">Full Name</Label>
                    <Input id="userName" placeholder="Enter full name" className="w-full" />
                  </div>
                  <div className="space-y-2 min-w-0">
                    <Label htmlFor="userEmail">Email Address</Label>
                    <Input id="userEmail" type="email" placeholder="Enter email" className="w-full" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="userRole">Role</Label>
                  <Select>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="staff">Staff</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tempPassword">Temporary Password</Label>
                  <Input id="tempPassword" type="password" placeholder="Enter temporary password" className="w-full" />
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    User will be required to change password on first login
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsAddUserOpen(false)}>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Create User
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {adminUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{user.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={roleColors[user.role as keyof typeof roleColors]}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusColors[user.status as keyof typeof statusColors]}>
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-400">{user.lastLogin}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      {user.role !== "owner" && (
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm bg-gradient-to-b from-white to-red-50 dark:from-gray-900 dark:to-red-950/20 border-red-100/50 dark:border-red-900/20 hover:shadow-md transition-all duration-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-xl font-bold text-gray-900 dark:text-white">
            <Shield className="h-5 w-5" />
            <span>Role Permissions</span>
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Configure what each role can access and modify
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-medium">Owner</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Full access to all features</p>
                </div>
                <Badge variant="destructive">Full Access</Badge>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Can manage all settings, users, and store operations
              </div>
            </div>
            
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-medium">Admin</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Manage daily operations</p>
                </div>
                <Badge variant="default">Limited Access</Badge>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Can manage orders, products, inventory, and customers. Cannot access user management or critical settings.
              </div>
            </div>
            
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-medium">Staff</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">View and basic operations</p>
                </div>
                <Badge variant="secondary">Read Only</Badge>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Can view orders, products, and customers. Can update order status and inventory levels.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  )
}
