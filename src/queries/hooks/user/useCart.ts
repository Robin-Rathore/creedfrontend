//@ts-nocheck
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useAtom } from "jotai"
import { toast } from "react-hot-toast"
import { apiClient } from "../../utils/api"
import { queryKeys } from "../../utils/queryKeys"
import { addToCartAtom, clearCartAtom } from "../../store/cart"
import type { Cart, AddToCartRequest, UpdateCartItemRequest } from "../../types/user"

export const useCart = () => {
  return useQuery({
    queryKey: queryKeys.users.cart,
    queryFn: (): Promise<{ success: boolean; data: Cart }> => apiClient.get("/users/cart"),
    select: (data) => data.data,
  })
}

export const useAddToCart = () => {
  const queryClient = useQueryClient()
  const [, addToCartLocal] = useAtom(addToCartAtom)

  return useMutation({
    mutationFn: (data: AddToCartRequest): Promise<{ success: boolean; message: string; data: any }> =>
      apiClient.post("/users/cart", data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.cart })
      toast.success(response.message)
    },
    // Optimistic update
    onMutate: async (newItem) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.users.cart })

      const previousCart = queryClient.getQueryData(queryKeys.users.cart)

      // Optimistically update local state
      // Note: You'd need to fetch product details for complete optimistic update

      return { previousCart }
    },
    onError: (err, newItem, context) => {
      queryClient.setQueryData(queryKeys.users.cart, context?.previousCart)
    },
  })
}

export const useUpdateCartItem = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      itemId,
      ...data
    }: UpdateCartItemRequest & { itemId: string }): Promise<{ success: boolean; message: string; data: any }> =>
      apiClient.put(`/users/cart/${itemId}`, data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.cart })
      toast.success(response.message)
    },
  })
}

export const useRemoveFromCart = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (itemId: string): Promise<{ success: boolean; message: string }> =>
      apiClient.delete(`/users/cart/${itemId}`),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.cart })
      toast.success(response.message)
    },
  })
}

export const useClearCart = () => {
  const queryClient = useQueryClient()
  const [, clearCartLocal] = useAtom(clearCartAtom)

  return useMutation({
    mutationFn: (): Promise<{ success: boolean; message: string }> => apiClient.delete("/users/cart"),
    onSuccess: (response) => {
      clearCartLocal()
      queryClient.invalidateQueries({ queryKey: queryKeys.users.cart })
      toast.success(response.message)
    },
  })
}
