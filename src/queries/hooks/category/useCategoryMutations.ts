import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "react-hot-toast"
import { apiClient, createFormData } from "../../utils/api"
import { queryKeys } from "../../utils/queryKeys"
import type { CreateCategoryRequest, Category } from "../../types/category"

export const useCreateCategory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateCategoryRequest): Promise<{ success: boolean; message: string; data: Category }> => {
      const formData = createFormData(data)
      return apiClient.post("/categories", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all() })
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.tree })
      toast.success(response.message)
    },
  })
}

export const useUpdateCategory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      ...data
    }: CreateCategoryRequest & { id: string }): Promise<{ success: boolean; message: string; data: Category }> => {
      const formData = createFormData(data)
      return apiClient.put(`/categories/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
    },
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all() })
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.tree })
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.detail(variables.id) })
      toast.success(response.message)
    },
  })
}

export const useDeleteCategory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string): Promise<{ success: boolean; message: string }> => apiClient.delete(`/categories/${id}`),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all() })
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.tree })
      toast.success(response.message)
    },
  })
}

export const useUpdateCategoryProductCount = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string): Promise<{ success: boolean; message: string; data: any }> =>
      apiClient.put(`/categories/${id}/update-count`),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all() })
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.detail(variables) })
      toast.success(response.message)
    },
  })
}
