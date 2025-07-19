//@ts-nocheck
import { useQuery } from "@tanstack/react-query"
import { apiClient } from "../../utils/api"
import { queryKeys } from "../../utils/queryKeys"
import type { Order, OrdersQuery } from "../../types/order"

export const useUserOrders = (params?: OrdersQuery) => {
  return useQuery({
    queryKey: queryKeys.users.orders(params),
    queryFn: (): Promise<{
      success: boolean
      count: number
      pagination: any
      data: Order[]
    }> => apiClient.get("/users/orders", params),
  })
}

export const useUserOrder = (orderId: string) => {
  return useQuery({
    queryKey: queryKeys.users.order(orderId),
    queryFn: (): Promise<{ success: boolean; data: Order }> => apiClient.get(`/users/orders/${orderId}`),
    select: (data) => data.data,
    enabled: !!orderId,
  })
}
