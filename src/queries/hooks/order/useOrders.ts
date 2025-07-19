//@ts-nocheck
import { useQuery } from "@tanstack/react-query"
import { apiClient } from "../../utils/api"
import { queryKeys } from "../../utils/queryKeys"
import type { Order, OrdersQuery } from "../../types/order"

export const useOrders = (params?: OrdersQuery) => {
  return useQuery({
    queryKey: queryKeys.orders.all(params),
    queryFn: (): Promise<{
      success: boolean
      count: number
      pagination: any
      data: Order[]
    }> => apiClient.get("/orders", params),
    keepPreviousData: true,
  })
}

export const useOrder = (id: string) => {
  return useQuery({
    queryKey: queryKeys.orders.detail(id),
    queryFn: (): Promise<{ success: boolean; data: Order }> => apiClient.get(`/orders/${id}`),
    select: (data) => data.data,
    enabled: !!id,
  })
}

export const useOrderStats = (period?: string) => {
  return useQuery({
    queryKey: queryKeys.orders.stats(period),
    queryFn: (): Promise<{ success: boolean; data: any }> => apiClient.get("/orders/stats", { period }),
    select: (data) => data.data,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
