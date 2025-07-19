import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "react-hot-toast"
import { apiClient, createFormData } from "../../utils/api"
import { queryKeys } from "../../utils/queryKeys"
import type { Review, ReviewStats, CreateReviewRequest, ReviewsQuery } from "../../types/review"

export const useProductReviews = (productId: string, params?: ReviewsQuery) => {
  return useQuery({
    queryKey: queryKeys.products.reviews(productId, params),
    queryFn: (): Promise<{
      success: boolean
      count: number
      pagination: any
      data: Review[]
    }> => apiClient.get(`/products/${productId}/reviews`, params),
    enabled: !!productId,
  })
}

export const useProductReviewStats = (productId: string) => {
  return useQuery({
    queryKey: queryKeys.products.reviewStats(productId),
    queryFn: (): Promise<{ success: boolean; data: ReviewStats }> =>
      apiClient.get(`/products/${productId}/reviews/stats`),
    select: (data) => data.data,
    enabled: !!productId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

export const useCreateProductReview = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      productId,
      ...data
    }: CreateReviewRequest & { productId: string }): Promise<{ success: boolean; message: string; data: Review }> => {
      const formData = createFormData(data)
      return apiClient.post(`/products/${productId}/reviews`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
    },
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.reviews(variables.productId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.products.reviewStats(variables.productId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.products.detail(variables.productId) })
      toast.success(response.message)
    },
  })
}
