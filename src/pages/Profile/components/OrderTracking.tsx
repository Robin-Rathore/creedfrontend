//@ts-nocheck

import type React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, Truck, CheckCircle, Clock, Eye } from "lucide-react";
import { useUserOrders } from "@/queries/hooks/user";
import { Link } from "react-router-dom";

const getStatusIcon = (status: string) => {
  switch (status) {
    case "pending":
      return <Clock className="w-5 h-5 text-yellow-500" />;
    case "processing":
      return <Package className="w-5 h-5 text-blue-500" />;
    case "shipped":
      return <Truck className="w-5 h-5 text-purple-500" />;
    case "delivered":
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    default:
      return <Package className="w-5 h-5 text-gray-500" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "processing":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "shipped":
      return "bg-purple-100 text-purple-800 border-purple-200";
    case "delivered":
      return "bg-green-100 text-green-800 border-green-200";
    case "cancelled":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

export const OrderTracking: React.FC = () => {
  const { data: ordersData, isLoading } = useUserOrders({ limit: 5 });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-[var(--lightest)] to-white">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <Package className="w-5 h-5 text-[var(--medium)]" />
              Recent Orders
            </CardTitle>
            <Button variant="outline" asChild>
              <Link to="/orders">View All Orders</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-24 bg-gray-200 rounded-lg"></div>
                </div>
              ))}
            </div>
          ) : ordersData?.data?.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No orders yet
              </h3>
              <p className="text-gray-600 mb-4">
                Start shopping to see your orders here
              </p>
              <Button
                className="bg-[var(--medium)] hover:bg-[var(--dark)] text-white"
                asChild
              >
                <Link to="/products">Browse Products</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {ordersData?.data?.map((order, index) => (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="border border-gray-200 hover:border-[var(--medium)] transition-all duration-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(order.status)}
                          <div>
                            <p className="font-semibold text-gray-900">
                              Order #{order.orderNumber}
                            </p>
                            <p className="text-sm text-gray-600">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(order.status)}>
                            {order.status.charAt(0).toUpperCase() +
                              order.status.slice(1)}
                          </Badge>
                          <Button variant="ghost" size="sm" asChild>
                            <Link to={`/orders/${order._id}`}>
                              <Eye className="w-4 h-4" />
                            </Link>
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex -space-x-2">
                            {order.items.slice(0, 3).map((item, idx) => (
                              <img
                                key={idx}
                                src={
                                  item.product.images?.[0]?.url ||
                                  "/placeholder.svg?height=40&width=40"
                                }
                                alt={item.product.name}
                                className="w-10 h-10 rounded-full border-2 border-white object-cover"
                              />
                            ))}
                            {order.items.length > 3 && (
                              <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-600">
                                +{order.items.length - 3}
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">
                              {order.items.length} item
                              {order.items.length > 1 ? "s" : ""}
                            </p>
                            <p className="font-semibold text-gray-900">
                              ${order.totalAmount.toFixed(2)}
                            </p>
                          </div>
                        </div>

                        {order.trackingNumber && (
                          <div className="text-right">
                            <p className="text-xs text-gray-600">Tracking</p>
                            <p className="text-sm font-mono text-[var(--medium)]">
                              {order.trackingNumber}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Order Progress */}
                      {order.status !== "cancelled" && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                            <span>Order Progress</span>
                            <span>
                              {order.status === "delivered"
                                ? "100%"
                                : order.status === "shipped"
                                ? "75%"
                                : order.status === "processing"
                                ? "50%"
                                : "25%"}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-[var(--medium)] to-[var(--dark)] h-2 rounded-full transition-all duration-500"
                              style={{
                                width:
                                  order.status === "delivered"
                                    ? "100%"
                                    : order.status === "shipped"
                                    ? "75%"
                                    : order.status === "processing"
                                    ? "50%"
                                    : "25%",
                              }}
                            ></div>
                          </div>
                          <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>Placed</span>
                            <span>Processing</span>
                            <span>Shipped</span>
                            <span>Delivered</span>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};
