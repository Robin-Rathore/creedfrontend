//@ts-nocheck
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Package,
  Filter,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Calendar,
  Eye,
  Download,
  MoreHorizontal,
  ChevronRight,
  ArrowLeft,
  User,
  CreditCard,
  ShoppingBag,
} from "lucide-react";

// Mock data - replace with your actual data
const mockOrders = [
  {
    _id: "ORD-2024001",
    orderNumber: "ORD-2024001",
    status: "delivered",
    total: 299.99,
    items: [
      {
        name: "Wireless Headphones",
        price: 199.99,
        quantity: 1,
        image: "/api/placeholder/80/80",
      },
      {
        name: "Phone Case",
        price: 29.99,
        quantity: 2,
        image: "/api/placeholder/80/80",
      },
    ],
    createdAt: "2024-01-15T10:30:00Z",
    deliveredAt: "2024-01-18T14:22:00Z",
    shippingAddress: "123 Main St, New York, NY 10001",
    trackingSteps: [
      { status: "order_placed", date: "2024-01-15T10:30:00Z", completed: true },
      { status: "processing", date: "2024-01-15T16:45:00Z", completed: true },
      { status: "shipped", date: "2024-01-16T09:15:00Z", completed: true },
      {
        status: "out_for_delivery",
        date: "2024-01-18T08:30:00Z",
        completed: true,
      },
      { status: "delivered", date: "2024-01-18T14:22:00Z", completed: true },
    ],
  },
  {
    _id: "ORD-2024002",
    orderNumber: "ORD-2024002",
    status: "shipped",
    total: 149.5,
    items: [
      {
        name: "Smart Watch",
        price: 149.5,
        quantity: 1,
        image: "/api/placeholder/80/80",
      },
    ],
    createdAt: "2024-01-20T14:15:00Z",
    shippingAddress: "456 Oak Ave, Los Angeles, CA 90210",
    trackingSteps: [
      { status: "order_placed", date: "2024-01-20T14:15:00Z", completed: true },
      { status: "processing", date: "2024-01-20T18:30:00Z", completed: true },
      { status: "shipped", date: "2024-01-21T11:00:00Z", completed: true },
      { status: "out_for_delivery", date: null, completed: false },
      { status: "delivered", date: null, completed: false },
    ],
  },
];

const statusConfig = {
  order_placed: {
    label: "Order Placed",
    icon: ShoppingBag,
    color: "bg-blue-500",
  },
  processing: { label: "Processing", icon: Package, color: "bg-yellow-500" },
  shipped: { label: "Shipped", icon: Truck, color: "bg-purple-500" },
  out_for_delivery: {
    label: "Out for Delivery",
    icon: MapPin,
    color: "bg-orange-500",
  },
  delivered: { label: "Delivered", icon: CheckCircle2, color: "bg-green-500" },
};

const OrderTimeline = ({ steps, currentStatus }) => {
  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-8">
        {steps.map((step, index) => {
          const config = statusConfig[step.status];
          const Icon = config.icon;
          const isCompleted = step.completed;
          const isActive = currentStatus === step.status;

          return (
            <React.Fragment key={step.status}>
              <div className="flex flex-col items-center relative z-10">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-all duration-300 ${
                    isCompleted
                      ? `${config.color} text-white shadow-lg`
                      : isActive
                      ? `${config.color} text-white animate-pulse shadow-lg`
                      : "bg-gray-200 text-gray-400"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </motion.div>

                <div className="text-center">
                  <p
                    className={`text-xs font-medium mb-1 ${
                      isCompleted || isActive
                        ? "text-gray-900"
                        : "text-gray-400"
                    }`}
                  >
                    {config.label}
                  </p>
                  {step.date && (
                    <p className="text-xs text-gray-500">
                      {new Date(step.date).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>

              {index < steps.length - 1 && (
                <div className="flex-1 mx-4 relative">
                  <div className="h-0.5 bg-gray-200 relative overflow-hidden">
                    <motion.div
                      initial={{ width: "0%" }}
                      animate={{ width: isCompleted ? "100%" : "0%" }}
                      transition={{ delay: index * 0.1 + 0.2, duration: 0.5 }}
                      className={`h-full ${config.color}`}
                    />
                  </div>

                  {currentStatus === step.status && (
                    <motion.div
                      animate={{ x: [0, 20, 0] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="absolute top-1/2 left-0 transform -translate-y-1/2"
                    >
                      <Truck className="w-4 h-4 text-blue-600" />
                    </motion.div>
                  )}
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

const OrderCard = ({ order, index }) => {
  const [expanded, setExpanded] = useState(false);

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      processing: "bg-blue-100 text-blue-800",
      shipped: "bg-purple-100 text-purple-800",
      out_for_delivery: "bg-orange-100 text-orange-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300"
    >
      {/* Order Header */}
      <div className="p-6 border-b border-gray-50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold">
              #{order.orderNumber.slice(-3)}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-lg">
                {order.orderNumber}
              </h3>
              <p className="text-sm text-gray-500">
                Placed on{" "}
                {new Date(order.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                order.status
              )}`}
            >
              {order.status.replace("_", " ").toUpperCase()}
            </span>
            <button
              onClick={() => setExpanded(!expanded)}
              className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <motion.div
                animate={{ rotate: expanded ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </motion.div>
            </button>
          </div>
        </div>

        {/* Order Items Preview */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {order.items.slice(0, 3).map((item, idx) => (
                <div
                  key={idx}
                  className="w-10 h-10 rounded-lg border-2 border-white overflow-hidden bg-gray-100"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
              {order.items.length > 3 && (
                <div className="w-10 h-10 rounded-lg border-2 border-white bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-600">
                  +{order.items.length - 3}
                </div>
              )}
            </div>
            <span className="text-sm text-gray-600">
              {order.items.length} item{order.items.length > 1 ? "s" : ""}
            </span>
          </div>

          <div className="text-right">
            <p className="font-bold text-lg text-gray-900">${order.total}</p>
            <p className="text-sm text-gray-500">Total</p>
          </div>
        </div>
      </div>

      {/* Expandable Content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-6 bg-gray-50/50">
              {/* Tracking Timeline */}
              <div className="mb-8">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Truck className="w-5 h-5 text-blue-600" />
                  Order Tracking
                </h4>
                <OrderTimeline
                  steps={order.trackingSteps}
                  currentStatus={order.status}
                />
              </div>

              {/* Order Details */}
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Package className="w-5 h-5 text-gray-600" />
                    Items Ordered
                  </h4>
                  <div className="space-y-3">
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 p-3 bg-white rounded-lg"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 text-sm">
                            {item.name}
                          </p>
                          <p className="text-gray-500 text-sm">
                            Qty: {item.quantity}
                          </p>
                        </div>
                        <p className="font-semibold text-gray-900">
                          ${item.price}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-gray-600" />
                    Delivery Address
                  </h4>
                  <div className="p-4 bg-white rounded-lg">
                    <p className="text-gray-700">{order.shippingAddress}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Eye className="w-4 h-4" />
                  Track Order
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                  <Download className="w-4 h-4" />
                  Download Invoice
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                  <MoreHorizontal className="w-4 h-4" />
                  More Actions
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export const Orders: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Using mock data for demo
  const orders = mockOrders;
  const totalOrders = orders.length;

  const orderStats = {
    total: totalOrders,
    pending: orders.filter((order) => order.status === "pending").length,
    processing: orders.filter((order) => order.status === "processing").length,
    delivered: orders.filter((order) => order.status === "delivered").length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                My Orders
              </h1>
              <p className="text-gray-600">Track and manage your purchases</p>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600 bg-white px-4 py-2 rounded-lg shadow-sm">
                <Calendar className="w-4 h-4" />
                <span>Last updated: {new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats */}
        {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl text-white">
            <div className="flex items-center justify-between mb-3">
              <Package className="w-8 h-8 opacity-80" />
              <span className="text-2xl font-bold">{orderStats.total}</span>
            </div>
            <p className="text-blue-100 text-sm">Total Orders</p>
          </div>

          <div className="bg-gradient-to-br from-yellow-500 to-orange-500 p-6 rounded-2xl text-white">
            <div className="flex items-center justify-between mb-3">
              <Clock className="w-8 h-8 opacity-80" />
              <span className="text-2xl font-bold">
                {orderStats.processing}
              </span>
            </div>
            <p className="text-yellow-100 text-sm">Processing</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-2xl text-white">
            <div className="flex items-center justify-between mb-3">
              <Truck className="w-8 h-8 opacity-80" />
              <span className="text-2xl font-bold">2</span>
            </div>
            <p className="text-purple-100 text-sm">In Transit</p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-2xl text-white">
            <div className="flex items-center justify-between mb-3">
              <CheckCircle2 className="w-8 h-8 opacity-80" />
              <span className="text-2xl font-bold">{orderStats.delivered}</span>
            </div>
            <p className="text-green-100 text-sm">Delivered</p>
          </div>
        </motion.div> */}

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by order number, product name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-gray-400" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="all">All Orders</option>
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Orders List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          {orders.length === 0 ? (
            <div className="text-center py-16">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No orders found
              </h3>
              <p className="text-gray-600 mb-6">
                Start shopping to see your orders here
              </p>
              <button className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors">
                Start Shopping
              </button>
            </div>
          ) : (
            orders.map((order, index) => (
              <OrderCard key={order._id} order={order} index={index} />
            ))
          )}
        </motion.div>
      </div>
    </div>
  );
};
