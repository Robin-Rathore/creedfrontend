//@ts-nocheck
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/queries/utils/api";
import { queryKeys } from "@/queries/utils/queryKeys";
import { toast } from "react-hot-toast";

interface OrdersParams {
  page?: number;
  limit?: number;
  status?: string;
}

// Get user orders
export const useUserOrders = (params: OrdersParams = {}) => {
  return useQuery({
    queryKey: queryKeys.user.orders(params),
    queryFn: async () => {
      const response = await api.get("/user/orders", { params });
      return response.data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Get single order
export const useUserOrder = (orderId: string) => {
  return useQuery({
    queryKey: queryKeys.user.order(orderId),
    queryFn: async () => {
      const response = await api.get(`/user/orders/${orderId}`);
      return response.data;
    },
    enabled: !!orderId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Cancel order
export const useCancelOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderId: string) => {
      const response = await api.put(`/user/orders/${orderId}/cancel`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.user.orders() });
      toast.success("Order cancelled successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to cancel order");
    },
  });
};

// Request return
export const useRequestReturn = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      orderId,
      reason,
    }: {
      orderId: string;
      reason: string;
    }) => {
      const response = await api.post(`/user/orders/${orderId}/return`, {
        reason,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.user.orders() });
      toast.success("Return request submitted successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to request return");
    },
  });
};
