//@ts-nocheck

import type React from "react";
import { useState } from "react";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  MoreHorizontal,
  Eye,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
} from "lucide-react";
import { useOrders } from "@/queries/hooks/order/useOrders";
import { useUpdateOrderStatus } from "@/queries/hooks/order/useOrderMutations";

export const OrdersManagement: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [orderDetailOpen, setOrderDetailOpen] = useState(false);

  const { data: ordersData, isLoading } = useOrders({
    page: currentPage,
    limit: 10,
    search: searchQuery || undefined,
    status: statusFilter !== "all" ? statusFilter : undefined,
  });

  const updateOrderStatusMutation = useUpdateOrderStatus();

  const handleViewOrder = (order: any) => {
    setSelectedOrder(order);
    setOrderDetailOpen(true);
  };

  const handleUpdateStatus = async (orderId: string, status: string) => {
    try {
      await updateOrderStatusMutation.mutateAsync({ id: orderId, status });
    } catch (error) {
      // Error handled by mutation
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "processing":
        return "bg-purple-100 text-purple-800";
      case "shipped":
        return "bg-indigo-100 text-indigo-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "refunded":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "confirmed":
        return <CheckCircle className="h-4 w-4" />;
      case "processing":
        return <Package className="h-4 w-4" />;
      case "shipped":
        return <Truck className="h-4 w-4" />;
      case "delivered":
        return <CheckCircle className="h-4 w-4" />;
      case "cancelled":
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
            <p className="text-gray-600">
              Manage customer orders and fulfillment
            </p>
          </div>
        </div>
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  const totalRevenue =
    ordersData?.data?.reduce((sum, order) => sum + order.pricing.total, 0) || 0;
  const pendingOrders =
    ordersData?.data?.filter((order) => order.status === "pending").length || 0;
  const processingOrders =
    ordersData?.data?.filter((order) => order.status === "processing").length ||
    0;
  const completedOrders =
    ordersData?.data?.filter((order) => order.status === "delivered").length ||
    0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-600">
            Manage customer orders and fulfillment
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">From all orders</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Orders
            </CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingOrders}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting confirmation
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Processing</CardTitle>
            <Package className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{processingOrders}</div>
            <p className="text-xs text-muted-foreground">Being prepared</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedOrders}</div>
            <p className="text-xs text-muted-foreground">
              Successfully delivered
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Order Management</CardTitle>
          <CardDescription>
            Track and manage all customer orders
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ordersData?.data?.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell>
                      <div className="font-medium">{order.orderNumber}</div>
                      <div className="text-sm text-gray-500">
                        #{order._id.slice(-8)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">
                        {order.user.firstName} {order.user.lastName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.user.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">
                          {order.items.length} items
                        </Badge>
                        <span className="text-sm text-gray-500">
                          {order.items.reduce(
                            (sum, item) => sum + item.quantity,
                            0
                          )}{" "}
                          qty
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">${order.pricing.total}</div>
                      <div className="text-sm text-gray-500">
                        {order.payment.method}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(order.status)}>
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(order.status)}
                          <span>{order.status}</span>
                        </div>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleViewOrder(order)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleUpdateStatus(order._id, "confirmed")
                            }
                          >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Confirm Order
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleUpdateStatus(order._id, "processing")
                            }
                          >
                            <Package className="mr-2 h-4 w-4" />
                            Mark Processing
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleUpdateStatus(order._id, "shipped")
                            }
                          >
                            <Truck className="mr-2 h-4 w-4" />
                            Mark Shipped
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {ordersData?.pagination && (
            <div className="flex items-center justify-between space-x-2 py-4">
              <div className="text-sm text-muted-foreground">
                Showing {(currentPage - 1) * 10 + 1} to{" "}
                {Math.min(currentPage * 10, ordersData.pagination.totalItems)}{" "}
                of {ordersData.pagination.totalItems} orders
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage >= ordersData.pagination.totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Order Detail Modal */}
      <Dialog open={orderDetailOpen} onOpenChange={setOrderDetailOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Order Details - {selectedOrder?.orderNumber}
            </DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              {/* Order Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Customer Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <span className="font-medium">Name: </span>
                      {selectedOrder.user.firstName}{" "}
                      {selectedOrder.user.lastName}
                    </div>
                    <div>
                      <span className="font-medium">Email: </span>
                      {selectedOrder.user.email}
                    </div>
                    <div>
                      <span className="font-medium">Phone: </span>
                      {selectedOrder.shippingAddress.phone || "N/A"}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>${selectedOrder.pricing.subtotal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax:</span>
                      <span>${selectedOrder.pricing.tax}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping:</span>
                      <span>${selectedOrder.pricing.shipping}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg border-t pt-2">
                      <span>Total:</span>
                      <span>${selectedOrder.pricing.total}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Shipping Address */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Shipping Address</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    <div>
                      {selectedOrder.shippingAddress.firstName}{" "}
                      {selectedOrder.shippingAddress.lastName}
                    </div>
                    <div>{selectedOrder.shippingAddress.address1}</div>
                    {selectedOrder.shippingAddress.address2 && (
                      <div>{selectedOrder.shippingAddress.address2}</div>
                    )}
                    <div>
                      {selectedOrder.shippingAddress.city},{" "}
                      {selectedOrder.shippingAddress.state}{" "}
                      {selectedOrder.shippingAddress.postalCode}
                    </div>
                    <div>{selectedOrder.shippingAddress.country}</div>
                  </div>
                </CardContent>
              </Card>

              {/* Order Items */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Order Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {selectedOrder.items.map((item: any, index: number) => (
                      <div
                        key={index}
                        className="flex items-center space-x-4 p-4 border rounded-lg"
                      >
                        <img
                          src={
                            item.product.images[0]?.url ||
                            "/placeholder.svg?height=60&width=60"
                          }
                          alt={item.name}
                          className="w-15 h-15 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-gray-500">
                            SKU: {item.sku}
                          </div>
                          {item.size && (
                            <div className="text-sm text-gray-500">
                              Size: {item.size}
                            </div>
                          )}
                          {item.color && (
                            <div className="text-sm text-gray-500">
                              Color: {item.color}
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="font-medium">
                            ${item.price} × {item.quantity}
                          </div>
                          <div className="text-sm text-gray-500">
                            Subtotal: ${item.subtotal}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
