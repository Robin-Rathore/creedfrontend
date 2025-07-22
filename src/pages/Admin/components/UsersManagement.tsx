//@ts-nocheck
import React, { useState, useCallback, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Search,
  MoreHorizontal,
  Trash2,
  Users,
  UserCheck,
  UserX,
  Shield,
  Crown,
  X,
  Filter,
  ChevronDown,
  ChevronUp,
  Loader2,
  Download,
  Grid,
  List,
  Eye,
  RefreshCw,
  SortAsc,
  SortDesc,
  ArrowUpDown,
} from "lucide-react";
import {
  useAdminUsers,
  useUpdateUserRole,
  useToggleUserStatus,
  useDeleteUser,
} from "@/queries/hooks/admin/useAdminUsers";

// Mock hooks - replace with your actual hooks
// const useAdminUsers = (params) => ({
//   data: {
//     data: [
//       {
//         id: "usr_12345678",
//         firstName: "John",
//         lastName: "Doe",
//         email: "john.doe@example.com",
//         role: "admin",
//         isActive: true,
//         isEmailVerified: true,
//         createdAt: "2024-01-15T10:30:00Z",
//         avatar: null,
//       },
//       {
//         id: "usr_87654321",
//         firstName: "Jane",
//         lastName: "Smith",
//         email: "jane.smith@example.com",
//         role: "seller",
//         isActive: true,
//         isEmailVerified: false,
//         createdAt: "2024-02-20T14:15:00Z",
//         avatar: null,
//       },
//       {
//         id: "usr_11223344",
//         firstName: "Bob",
//         lastName: "Wilson",
//         email: "bob.wilson@example.com",
//         role: "user",
//         isActive: false,
//         isEmailVerified: true,
//         createdAt: "2024-01-05T09:00:00Z",
//         avatar: null,
//       },
//     ],
//     pagination: {
//       totalItems: 3,
//       totalPages: 1,
//       currentPage: 1,
//     },
//   },
//   isLoading: false,
// });

// const useUpdateUserRole = () => ({
//   mutateAsync: async ({ id, role }) => {
//     await new Promise((resolve) => setTimeout(resolve, 1000));
//     console.log(`Updated user ${id} to role ${role}`);
//   },
//   isPending: false,
// });

// const useToggleUserStatus = () => ({
//   mutateAsync: async (id) => {
//     await new Promise((resolve) => setTimeout(resolve, 1000));
//     console.log(`Toggled status for user ${id}`);
//   },
//   isPending: false,
// });

// const useDeleteUser = () => ({
//   mutateAsync: async (id) => {
//     await new Promise((resolve) => setTimeout(resolve, 1000));
//     console.log(`Deleted user ${id}`);
//   },
//   isPending: false,
// });

// Debounce hook
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Filter Pills Component
const FilterPill = ({ label, onRemove, variant = "default" }) => (
  <Badge variant={variant} className="flex items-center gap-1 pr-1">
    {label}
    <Button
      variant="ghost"
      size="sm"
      className="h-4 w-4 p-0 hover:bg-transparent"
      onClick={onRemove}
    >
      <X className="h-3 w-3" />
    </Button>
  </Badge>
);

// Confirmation Dialog Component
const ConfirmDialog = ({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  isLoading,
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button
          variant="outline"
          onClick={() => onOpenChange(false)}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button onClick={onConfirm} disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Confirm
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

// Loading Skeleton
const UserRowSkeleton = () => (
  <TableRow>
    {[...Array(6)].map((_, i) => (
      <TableCell key={i}>
        <div className="animate-pulse">
          {i === 0 ? (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full" />
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-24" />
                <div className="h-3 bg-gray-200 rounded w-16" />
              </div>
            </div>
          ) : (
            <div className="h-4 bg-gray-200 rounded w-20" />
          )}
        </div>
      </TableCell>
    ))}
  </TableRow>
);

// Mobile Card View
const UserMobileCard = ({
  user,
  onUpdateRole,
  onToggleStatus,
  onDeleteUser,
  isUpdating,
}) => (
  <Card className="p-4">
    <div className="flex items-start justify-between">
      <div className="flex items-center space-x-3 flex-1">
        <Avatar className="h-12 w-12">
          <AvatarImage src={user.avatar?.url || "/placeholder.svg"} />
          <AvatarFallback className="text-sm">
            {user.firstName[0]}
            {user.lastName[0]}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="font-medium truncate">
            {user.firstName} {user.lastName}
          </div>
          <div className="text-sm text-gray-500 truncate">{user.email}</div>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <Badge className={getRoleColor(user.role)}>
              <div className="flex items-center space-x-1">
                {getRoleIcon(user.role)}
                <span className="capitalize">{user.role}</span>
              </div>
            </Badge>
            <Badge
              className={
                user.isActive
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }
            >
              {user.isActive ? "Active" : "Inactive"}
            </Badge>
            {user.isEmailVerified ? (
              <Badge className="bg-green-100 text-green-800">Verified</Badge>
            ) : (
              <Badge className="bg-yellow-100 text-yellow-800">
                Unverified
              </Badge>
            )}
          </div>
        </div>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0" disabled={isUpdating}>
            {isUpdating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <MoreHorizontal className="h-4 w-4" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onUpdateRole(user.id, "admin")}>
            <Crown className="mr-2 h-4 w-4" />
            Make Admin
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onUpdateRole(user.id, "seller")}>
            <Shield className="mr-2 h-4 w-4" />
            Make Seller
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onUpdateRole(user.id, "user")}>
            <Users className="mr-2 h-4 w-4" />
            Make User
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onToggleStatus(user.id)}>
            {user.isActive ? (
              <>
                <UserX className="mr-2 h-4 w-4" />
                Deactivate
              </>
            ) : (
              <>
                <UserCheck className="mr-2 h-4 w-4" />
                Activate
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onDeleteUser(user.id)}
            className="text-red-600"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </Card>
);

// Helper functions
const getRoleColor = (role) => {
  switch (role) {
    case "admin":
      return "bg-red-100 text-red-800";
    case "seller":
      return "bg-blue-100 text-blue-800";
    case "user":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getRoleIcon = (role) => {
  switch (role) {
    case "admin":
      return <Crown className="h-4 w-4" />;
    case "seller":
      return <Shield className="h-4 w-4" />;
    case "user":
      return <Users className="h-4 w-4" />;
    default:
      return <Users className="h-4 w-4" />;
  }
};

export const UsersManagement: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [viewMode, setViewMode] = useState("table");
  const [sortField, setSortField] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");
  const [updatingUserId, setUpdatingUserId] = useState(null);

  // Confirmation states
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    type: "",
    userId: "",
    userLabel: "",
    action: null,
  });

  const debouncedSearch = useDebounce(searchQuery, 500);

  const { data: usersData, isLoading } = useAdminUsers({
    page: currentPage,
    limit: pageSize,
    search: debouncedSearch || undefined,
    role: roleFilter !== "all" ? roleFilter : undefined,
    isActive: statusFilter !== "all" ? statusFilter === "active" : undefined,
    sortField,
    sortDirection,
  });

  const updateUserRoleMutation = useUpdateUserRole();
  const toggleUserStatusMutation = useToggleUserStatus();
  const deleteUserMutation = useDeleteUser();

  const handleUpdateRole = useCallback(
    async (userId, role) => {
      const user = usersData?.data?.find((u) => u.id === userId);
      if (!user) return;

      setConfirmDialog({
        open: true,
        type: "role",
        userId,
        userLabel: `${user.firstName} ${user.lastName}`,
        action: async () => {
          setUpdatingUserId(userId);
          try {
            await updateUserRoleMutation.mutateAsync({ id: userId, role });
          } finally {
            setUpdatingUserId(null);
            setConfirmDialog({
              open: false,
              type: "",
              userId: "",
              userLabel: "",
              action: null,
            });
          }
        },
      });
    },
    [usersData, updateUserRoleMutation]
  );

  const handleToggleStatus = useCallback(
    async (userId) => {
      const user = usersData?.data?.find((u) => u.id === userId);
      if (!user) return;

      setConfirmDialog({
        open: true,
        type: user.isActive ? "deactivate" : "activate",
        userId,
        userLabel: `${user.firstName} ${user.lastName}`,
        action: async () => {
          setUpdatingUserId(userId);
          try {
            await toggleUserStatusMutation.mutateAsync(userId);
          } finally {
            setUpdatingUserId(null);
            setConfirmDialog({
              open: false,
              type: "",
              userId: "",
              userLabel: "",
              action: null,
            });
          }
        },
      });
    },
    [usersData, toggleUserStatusMutation]
  );

  const handleDeleteUser = useCallback(
    async (userId) => {
      const user = usersData?.data?.find((u) => u.id === userId);
      if (!user) return;

      setConfirmDialog({
        open: true,
        type: "delete",
        userId,
        userLabel: `${user.firstName} ${user.lastName}`,
        action: async () => {
          setUpdatingUserId(userId);
          try {
            await deleteUserMutation.mutateAsync(userId);
          } finally {
            setUpdatingUserId(null);
            setConfirmDialog({
              open: false,
              type: "",
              userId: "",
              userLabel: "",
              action: null,
            });
          }
        },
      });
    },
    [usersData, deleteUserMutation]
  );

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    setRoleFilter("all");
    setStatusFilter("all");
    setSortField("");
    setSortDirection("asc");
  };

  const activeFilters = [];
  if (roleFilter !== "all")
    activeFilters.push({ label: `Role: ${roleFilter}`, key: "role" });
  if (statusFilter !== "all")
    activeFilters.push({ label: `Status: ${statusFilter}`, key: "status" });
  if (debouncedSearch)
    activeFilters.push({ label: `Search: ${debouncedSearch}`, key: "search" });

  const removeFilter = (key) => {
    switch (key) {
      case "role":
        setRoleFilter("all");
        break;
      case "status":
        setStatusFilter("all");
        break;
      case "search":
        setSearchQuery("");
        break;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Users</h1>
            <p className="text-gray-600">
              Manage user accounts and permissions
            </p>
          </div>
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="space-y-0 pb-2">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-20 mb-2" />
                  <div className="h-8 bg-gray-200 rounded w-12" />
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* Table Skeleton */}
        <Card>
          <CardHeader>
            <div className="animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-32 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-48" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <UserRowSkeleton key={i} />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalUsers = usersData?.pagination?.totalItems || 0;
  const activeUsers =
    usersData?.data?.filter((user) => user.isActive).length || 0;
  const adminUsers =
    usersData?.data?.filter((user) => user.role === "admin").length || 0;
  const sellerUsers =
    usersData?.data?.filter((user) => user.role === "seller").length || 0;

  const getSortIcon = (field) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4" />;
    return sortDirection === "asc" ? (
      <SortAsc className="h-4 w-4" />
    ) : (
      <SortDesc className="h-4 w-4" />
    );
  };

  return (
    <TooltipProvider>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Users</h1>
            <p className="text-gray-600">
              Manage user accounts and permissions
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                Registered accounts
              </p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Users
              </CardTitle>
              <UserCheck className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {activeUsers}
              </div>
              <p className="text-xs text-muted-foreground">Currently active</p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Administrators
              </CardTitle>
              <Crown className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {adminUsers}
              </div>
              <p className="text-xs text-muted-foreground">Admin accounts</p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sellers</CardTitle>
              <Shield className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {sellerUsers}
              </div>
              <p className="text-xs text-muted-foreground">Seller accounts</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Card className="shadow-sm">
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                  Manage user accounts, roles, and permissions
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={viewMode === "table" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode("table")}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Table View</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={viewMode === "grid" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode("grid")}
                    >
                      <Grid className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Card View</TooltipContent>
                </Tooltip>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Search and Filters */}
            <div className="space-y-4">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-10"
                  />
                  {searchQuery && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                      onClick={() => setSearchQuery("")}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                  {debouncedSearch !== searchQuery && (
                    <Loader2 className="absolute right-8 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-gray-400" />
                  )}
                </div>

                <Button
                  variant="outline"
                  onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                  className="flex items-center gap-2 lg:w-auto w-full justify-center"
                >
                  <Filter className="h-4 w-4" />
                  Filters
                  {isFiltersOpen ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </div>

              {/* Collapsible Filters */}
              {isFiltersOpen && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg border">
                  <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="seller">Seller</SelectItem>
                      <SelectItem value="user">User</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    value={pageSize.toString()}
                    onValueChange={(value) => setPageSize(Number(value))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10 per page</SelectItem>
                      <SelectItem value="25">25 per page</SelectItem>
                      <SelectItem value="50">50 per page</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Active Filters */}
              {activeFilters.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm text-gray-500">Active filters:</span>
                  {activeFilters.map((filter) => (
                    <FilterPill
                      key={filter.key}
                      label={filter.label}
                      onRemove={() => removeFilter(filter.key)}
                    />
                  ))}
                  <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                    Clear all
                  </Button>
                </div>
              )}

              {/* Results Count */}
              <div className="text-sm text-gray-600">
                Showing {usersData?.data?.length || 0} of {totalUsers} users
              </div>
            </div>

            {/* Content */}
            {!usersData?.data?.length ? (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No users found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your search or filter criteria.
                </p>
              </div>
            ) : viewMode === "table" ? (
              <div className="rounded-md border mt-6">
                <Table>
                  <TableHeader className="sticky top-0 bg-white">
                    <TableRow>
                      <TableHead>
                        <Button
                          variant="ghost"
                          onClick={() => handleSort("name")}
                          className="h-auto p-0 font-semibold"
                        >
                          User {getSortIcon("name")}
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button
                          variant="ghost"
                          onClick={() => handleSort("email")}
                          className="h-auto p-0 font-semibold"
                        >
                          Email {getSortIcon("email")}
                        </Button>
                      </TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>
                        <Button
                          variant="ghost"
                          onClick={() => handleSort("createdAt")}
                          className="h-auto p-0 font-semibold"
                        >
                          Joined {getSortIcon("createdAt")}
                        </Button>
                      </TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {usersData?.data?.map((user, index) => (
                      <TableRow
                        key={user.id}
                        className={
                          index % 2 === 0 ? "bg-gray-50/50" : "bg-white"
                        }
                      >
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage
                                src={user.avatar?.url || "/placeholder.svg"}
                              />
                              <AvatarFallback>
                                {user.firstName[0]}
                                {user.lastName[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">
                                {user.firstName} {user.lastName}
                              </div>
                              <div className="text-sm text-gray-500">
                                ID: {user?.id?.slice(-8)}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{user.email}</div>
                          <div className="mt-1">
                            {user.isEmailVerified ? (
                              <Badge
                                variant="outline"
                                className="bg-green-50 text-green-700 border-green-200"
                              >
                                Verified
                              </Badge>
                            ) : (
                              <Badge
                                variant="outline"
                                className="bg-yellow-50 text-yellow-700 border-yellow-200"
                              >
                                Unverified
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getRoleColor(user.role)}>
                            <div className="flex items-center space-x-1">
                              {getRoleIcon(user.role)}
                              <span className="capitalize">{user.role}</span>
                            </div>
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              user.isActive
                                ? "bg-green-100 text-green-800 border-green-200"
                                : "bg-red-100 text-red-800 border-red-200"
                            }
                          >
                            {user.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </div>
                          <div className="text-sm text-gray-500">
                            {new Date(user.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>View Details</TooltipContent>
                            </Tooltip>

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  className="h-8 w-8 p-0"
                                  disabled={updatingUserId === user.id}
                                >
                                  {updatingUserId === user.id ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <MoreHorizontal className="h-4 w-4" />
                                  )}
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleUpdateRole(user.id, "admin")
                                  }
                                  disabled={user.role === "admin"}
                                >
                                  <Crown className="mr-2 h-4 w-4 text-red-600" />
                                  Make Admin
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleUpdateRole(user.id, "seller")
                                  }
                                  disabled={user.role === "seller"}
                                >
                                  <Shield className="mr-2 h-4 w-4 text-blue-600" />
                                  Make Seller
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleUpdateRole(user.id, "user")
                                  }
                                  disabled={user.role === "user"}
                                >
                                  <Users className="mr-2 h-4 w-4 text-green-600" />
                                  Make User
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleToggleStatus(user.id)}
                                >
                                  {user.isActive ? (
                                    <>
                                      <UserX className="mr-2 h-4 w-4 text-orange-600" />
                                      Deactivate User
                                    </>
                                  ) : (
                                    <>
                                      <UserCheck className="mr-2 h-4 w-4 text-green-600" />
                                      Activate User
                                    </>
                                  )}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDeleteUser(user.id)}
                                  className="text-red-600 focus:text-red-600"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete User
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                {usersData?.data?.map((user) => (
                  <UserMobileCard
                    key={user.id}
                    user={user}
                    onUpdateRole={handleUpdateRole}
                    onToggleStatus={handleToggleStatus}
                    onDeleteUser={handleDeleteUser}
                    isUpdating={updatingUserId === user.id}
                  />
                ))}
              </div>
            )}

            {/* Enhanced Pagination */}
            {usersData?.pagination && usersData.pagination.totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 pt-6 border-t">
                <div className="text-sm text-muted-foreground">
                  Showing {(currentPage - 1) * pageSize + 1} to{" "}
                  {Math.min(
                    currentPage * pageSize,
                    usersData.pagination.totalItems
                  )}{" "}
                  of {usersData.pagination.totalItems} users
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                  >
                    First
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>

                  {/* Page Numbers */}
                  <div className="flex items-center space-x-1">
                    {Array.from(
                      { length: Math.min(5, usersData.pagination.totalPages) },
                      (_, i) => {
                        const pageNum =
                          currentPage <= 3
                            ? i + 1
                            : currentPage >= usersData.pagination.totalPages - 2
                            ? usersData.pagination.totalPages - 4 + i
                            : currentPage - 2 + i;

                        if (
                          pageNum < 1 ||
                          pageNum > usersData.pagination.totalPages
                        )
                          return null;

                        return (
                          <Button
                            key={pageNum}
                            variant={
                              pageNum === currentPage ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() => setCurrentPage(pageNum)}
                            className="w-8 h-8 p-0"
                          >
                            {pageNum}
                          </Button>
                        );
                      }
                    )}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage >= usersData.pagination.totalPages}
                  >
                    Next
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage(usersData.pagination.totalPages)
                    }
                    disabled={currentPage >= usersData.pagination.totalPages}
                  >
                    Last
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Confirmation Dialog */}
        <ConfirmDialog
          open={confirmDialog.open}
          onOpenChange={(open) =>
            setConfirmDialog((prev) => ({ ...prev, open }))
          }
          title={
            confirmDialog.type === "delete"
              ? "Delete User"
              : confirmDialog.type === "role"
              ? "Update User Role"
              : confirmDialog.type === "activate"
              ? "Activate User"
              : "Deactivate User"
          }
          description={
            confirmDialog.type === "delete"
              ? `Are you sure you want to delete ${confirmDialog.userLabel}? This action cannot be undone.`
              : confirmDialog.type === "role"
              ? `Are you sure you want to update the role for ${confirmDialog.userLabel}?`
              : confirmDialog.type === "activate"
              ? `Are you sure you want to activate ${confirmDialog.userLabel}?`
              : `Are you sure you want to deactivate ${confirmDialog.userLabel}? They will no longer be able to access their account.`
          }
          onConfirm={confirmDialog.action}
          isLoading={updatingUserId === confirmDialog.userId}
        />
      </div>
    </TooltipProvider>
  );
};
