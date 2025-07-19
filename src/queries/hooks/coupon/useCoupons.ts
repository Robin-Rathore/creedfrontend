//@ts-nocheck
import { useQuery, useMutation } from "@tanstack/react-query"
import { apiClient } from "../../utils/api"
import { queryKeys } from "../../utils/queryKeys"
import type { Coupon, ValidateCouponRequest, ValidateCouponResponse } from "../../types/coupon"

export const useCoupons = (params?: any) => {
  return useQuery({
    queryKey: queryKeys.coupons.all(params),
    queryFn: (): Promise<{
      success: boolean
      count: number
      pagination: any
      data: Coupon[]
    }> => apiClient.get("/coupons", params),
    keepPreviousData: true,
  })
}

export const useActiveCoupons = () => {
  return useQuery({
    queryKey: queryKeys.coupons.active,
    queryFn: (): Promise<{ success: boolean; count: number; data: Coupon[] }> => apiClient.get("/coupons/active"),
    select: (data) => data.data,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

export const useCoupon = (id: string) => {
  return useQuery({
    queryKey: queryKeys.coupons.detail(id),
    queryFn: (): Promise<{ success: boolean; data: Coupon }> => apiClient.get(`/coupons/${id}`),
    select: (data) => data.data,
    enabled: !!id,
  })
}

export const useCouponStats = (id: string) => {
  return useQuery({
    queryKey: queryKeys.coupons.stats(id),
    queryFn: (): Promise<{ success: boolean; data: any }> => apiClient.get(`/coupons/${id}/stats`),
    select: (data) => data.data,
    enabled: !!id,
  })
}

export const useValidateCoupon = () => {
  return useMutation({
    mutationFn: (data: ValidateCouponRequest): Promise<ValidateCouponResponse> =>
      apiClient.post("/coupons/validate", data),
  })
}
