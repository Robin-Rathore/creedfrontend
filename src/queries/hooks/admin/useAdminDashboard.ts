import { useQuery } from "@tanstack/react-query"
import { apiClient } from "../../utils/api"
import { queryKeys } from "../../utils/queryKeys"
import type { DashboardStats } from "../../types/admin"

export const useAdminDashboard = () => {
  return useQuery({
    queryKey: queryKeys.admin.dashboard,
    queryFn: (): Promise<{ success: boolean; data: DashboardStats }> => apiClient.get("/admin/dashboard"),
    select: (data) => data.data,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  })
}
