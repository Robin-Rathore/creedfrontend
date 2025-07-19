import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "react-hot-toast"
import { apiClient } from "../../utils/api"
import { queryKeys } from "../../utils/queryKeys"
import type { CreateOrderRequest, Order } from "../../types/order"

export const useCreateOrder = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateOrderRequest): Promise<{ success: boolean; message: string; data: Order }> =>
      apiClient.post("/orders", data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all() })
      queryClient.invalidateQueries({ queryKey: queryKeys.users.orders() })
      queryClient.invalidateQueries({ queryKey: queryKeys.users.cart })
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all() }) // Update stock
      toast.success(response.message)
    },
  })
}

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      status,
      note,
    }: { id: string; status: string; note?: string }): Promise<{ success: boolean; message: string; data: Order }> =>
      apiClient.put(`/orders/${id}/status`, { status, note }),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all() })
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.detail(variables.id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.users.orders() })
      toast.success(response.message)
    },
  })
}

export const useUpdatePaymentStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      status,
      transactionId,
      paymentIntentId,
    }: {
      id: string
      status: string
      transactionId?: string
      paymentIntentId?: string
    }): Promise<{ success: boolean; message: string; data: Order }> =>
      apiClient.put(`/orders/${id}/payment`, { status, transactionId, paymentIntentId }),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all() })
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.detail(variables.id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.users.orders() })
      toast.success(response.message)
    },
  })
}

export const useAddTrackingInfo = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      trackingNumber,
      carrier,
      estimatedDelivery,
    }: {
      id: string
      trackingNumber: string
      carrier: string
      estimatedDelivery?: string
    }): Promise<{ success: boolean; message: string; data: Order }> =>
      apiClient.put(`/orders/${id}/tracking`, { trackingNumber, carrier, estimatedDelivery }),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all() })
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.detail(variables.id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.users.orders() })
      toast.success(response.message)
    },
  })
}

export const useCancelOrder = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      reason,
    }: { id: string; reason: string }): Promise<{ success: boolean; message: string; data: Order }> =>
      apiClient.put(`/orders/${id}/cancel`, { reason }),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all() })
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.detail(variables.id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.users.orders() })
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all() }) // Update stock
      toast.success(response.message)
    },
  })
}
