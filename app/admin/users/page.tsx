"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  MoreHorizontal,
  Edit,
  Trash,
  Eye,
  CheckCircle,
  XCircle,
  Filter,
  Loader2,
  User,
  Mail,
  Phone,
  MapPin,
} from "lucide-react"

// Mock data for users
const mockUsers = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    role: "customer",
    status: "active",
    location: "Tokyo",
    joinDate: "2023-01-15",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "seller",
    status: "active",
    location: "Osaka",
    joinDate: "2023-02-20",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 3,
    name: "Robert Johnson",
    email: "robert.j@example.com",
    role: "customer",
    status: "inactive",
    location: "Kyoto",
    joinDate: "2023-03-10",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 4,
    name: "Emily Davis",
    email: "emily.d@example.com",
    role: "seller",
    status: "active",
    location: "Nagoya",
    joinDate: "2023-04-05",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 5,
    name: "Michael Wilson",
    email: "michael.w@example.com",
    role: "customer",
    status: "active",
    location: "Sapporo",
    joinDate: "2023-05-12",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 6,
    name: "Sarah Brown",
    email: "sarah.b@example.com",
    role: "seller",
    status: "active",
    location: "Fukuoka",
    joinDate: "2023-06-18",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 7,
    name: "David Lee",
    email: "david.l@example.com",
    role: "customer",
    status: "inactive",
    location: "Yokohama",
    joinDate: "2023-07-22",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 8,
    name: "Lisa Taylor",
    email: "lisa.t@example.com",
    role: "seller",
    status: "active",
    location: "Kobe",
    joinDate: "2023-08-30",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 9,
    name: "James Anderson",
    email: "james.a@example.com",
    role: "customer",
    status: "active",
    location: "Hiroshima",
    joinDate: "2023-09-14",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 10,
    name: "Patricia Martin",
    email: "patricia.m@example.com",
    role: "seller",
    status: "inactive",
    location: "Sendai",
    joinDate: "2023-10-05",
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

export default function UsersPage() {
  const [users, setUsers] = useState(mockUsers)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [roleFilter, setRoleFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(false)

  // Filter users based on search query and filters
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.location.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || user.status === statusFilter
    const matchesRole = roleFilter === "all" || user.role === roleFilter

    return matchesSearch && matchesStatus && matchesRole
  })

  const handleEditUser = () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      const updatedUsers = users.map((user) => (user.id === currentUser.id ? { ...user, ...currentUser } : user))
      setUsers(updatedUsers)
      setIsEditDialogOpen(false)
      setCurrentUser(null)
      setIsLoading(false)
    }, 1000)
  }

  const handleDeleteUser = () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      const updatedUsers = users.filter((user) => user.id !== currentUser.id)
      setUsers(updatedUsers)
      setIsDeleteDialogOpen(false)
      setCurrentUser(null)
      setIsLoading(false)
    }, 1000)
  }

  const handleToggleStatus = (user: any) => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      const updatedUsers = users.map((u) =>
        u.id === user.id ? { ...u, status: u.status === "active" ? "inactive" : "active" } : u,
      )
      setUsers(updatedUsers)
      setIsLoading(false)
    }, 500)
  }

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Users</h2>
        </div>

        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search users..."
              className="w-full bg-background pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex flex-col space-y-2 md:flex-row md:space-x-2 md:space-y-0">
            <div className="flex items-center space-x-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>

              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="customer">Customer</SelectItem>
                  <SelectItem value="seller">Seller</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  setSearchQuery("")
                  setStatusFilter("all")
                  setRoleFilter("all")
                }}
              >
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No users found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 overflow-hidden rounded-full">
                          <Image
                            src={user.avatar || "/placeholder.svg"}
                            alt={user.name}
                            width={40}
                            height={40}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-xs text-muted-foreground">ID: {user.id}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={user.role === "seller" ? "outline" : "secondary"}>
                        {user.role === "seller" ? "Seller" : "Customer"}
                      </Badge>
                    </TableCell>
                    <TableCell>{user.location}</TableCell>
                    <TableCell>{user.joinDate}</TableCell>
                    <TableCell>
                      <Badge variant={user.status === "active" ? "success" : "destructive"}>
                        {user.status === "active" ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setCurrentUser(user)
                              setIsEditDialogOpen(true)
                            }}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleToggleStatus(user)}>
                            {user.status === "active" ? (
                              <>
                                <XCircle className="mr-2 h-4 w-4" />
                                Deactivate
                              </>
                            ) : (
                              <>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Activate
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => {
                              setCurrentUser(user)
                              setIsDeleteDialogOpen(true)
                            }}
                          >
                            <Trash className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>
                2
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      {/* Edit User Dialog - Responsive */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[90vw] md:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Make changes to the user information.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 overflow-hidden rounded-full">
                <Image
                  src={currentUser?.avatar || "/placeholder.svg?height=64&width=64"}
                  alt={currentUser?.name || "User"}
                  width={64}
                  height={64}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-lg font-medium">{currentUser?.name}</h3>
                <p className="text-sm text-muted-foreground">ID: {currentUser?.id}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Name</Label>
                <div className="relative">
                  <User className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="edit-name"
                    value={currentUser?.name || ""}
                    onChange={(e) => setCurrentUser({ ...currentUser, name: e.target.value })}
                    className="pl-8"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="edit-email"
                    type="email"
                    value={currentUser?.email || ""}
                    onChange={(e) => setCurrentUser({ ...currentUser, email: e.target.value })}
                    className="pl-8"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-role">Role</Label>
                <Select
                  value={currentUser?.role || ""}
                  onValueChange={(value) => setCurrentUser({ ...currentUser, role: value })}
                >
                  <SelectTrigger id="edit-role">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="customer">Customer</SelectItem>
                    <SelectItem value="seller">Seller</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select
                  value={currentUser?.status || ""}
                  onValueChange={(value) => setCurrentUser({ ...currentUser, status: value })}
                >
                  <SelectTrigger id="edit-status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-phone">Phone</Label>
                <div className="relative">
                  <Phone className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="edit-phone"
                    value={currentUser?.phone || ""}
                    onChange={(e) => setCurrentUser({ ...currentUser, phone: e.target.value })}
                    className="pl-8"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-location">Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="edit-location"
                    value={currentUser?.location || ""}
                    onChange={(e) => setCurrentUser({ ...currentUser, location: e.target.value })}
                    className="pl-8"
                  />
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row sm:justify-end gap-2">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditUser} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete User Dialog - Responsive */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[90vw] md:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-3 rounded-md border p-4">
            <div className="h-10 w-10 overflow-hidden rounded-full">
              <Image
                src={currentUser?.avatar || "/placeholder.svg?height=40&width=40"}
                alt={currentUser?.name || "User"}
                width={40}
                height={40}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium leading-none">{currentUser?.name}</p>
              <p className="text-sm text-muted-foreground">
                {currentUser?.email} • {currentUser?.role}
              </p>
            </div>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row sm:justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteUser} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete User"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
