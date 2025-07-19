import { useQuery } from "@tanstack/react-query"
import { apiClient } from "../../utils/api"
import { queryKeys } from "../../utils/queryKeys"
import type { SalesAnalytics, InventoryAnalytics } from "../../types/admin"

export const useSalesAnalytics = (period?: string) => {
  return useQuery({
    queryKey: queryKeys.admin.salesAnalytics(period),
    queryFn: (): Promise<{ success: boolean; data: SalesAnalytics }> =>
      apiClient.get("/admin/analytics/sales", { period }),
    select: (data) => data.data,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

export const useInventoryAnalytics = () => {
  return useQuery({
    queryKey: queryKeys.admin.inventoryAnalytics,
    queryFn: (): Promise<{ success: boolean; data: InventoryAnalytics }> => apiClient.get("/admin/analytics/inventory"),
    select: (data) => data.data,
    staleTime: 15 * 60 * 1000, // 15 minutes
  })
}
