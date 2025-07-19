import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "react-hot-toast"
import { apiClient, createFormData } from "../../utils/api"
import { queryKeys } from "../../utils/queryKeys"
import type { CreateProductRequest, Product } from "../../types/product"

export const useCreateProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateProductRequest): Promise<{ success: boolean; message: string; data: Product }> => {
      const formData = createFormData(data)
      return apiClient.post("/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all() })
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all() })
      toast.success(response.message)
    },
  })
}

export const useUpdateProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      ...data
    }: CreateProductRequest & { id: string }): Promise<{ success: boolean; message: string; data: Product }> => {
      const formData = createFormData(data)
      return apiClient.put(`/products/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
    },
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all() })
      queryClient.invalidateQueries({ queryKey: queryKeys.products.detail(variables.id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all() })
      toast.success(response.message)
    },
  })
}

export const useDeleteProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string): Promise<{ success: boolean; message: string }> => apiClient.delete(`/products/${id}`),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all() })
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all() })
      toast.success(response.message)
    },
  })
}
