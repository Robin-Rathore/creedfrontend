//@ts-nocheck
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "react-hot-toast"
import { apiClient } from "../../utils/api"
import { queryKeys } from "../../utils/queryKeys"
import type { WishlistItem } from "../../types/user"

export const useWishlist = () => {
  return useQuery({
    queryKey: queryKeys.users.wishlist,
    queryFn: (): Promise<{ success: boolean; count: number; data: WishlistItem[] }> => apiClient.get("/users/wishlist"),
    select: (data) => data.data,
  })
}

export const useAddToWishlist = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (productId: string): Promise<{ success: boolean; message: string }> =>
      apiClient.post(`/users/wishlist/${productId}`),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.wishlist })
      toast.success(response.message)
    },
    // Optimistic update
    onMutate: async (productId) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.users.wishlist })

      const previousWishlist = queryClient.getQueryData(queryKeys.users.wishlist)

      return { previousWishlist }
    },
    onError: (err, productId, context) => {
      queryClient.setQueryData(queryKeys.users.wishlist, context?.previousWishlist)
    },
  })
}

export const useRemoveFromWishlist = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (productId: string): Promise<{ success: boolean; message: string }> =>
      apiClient.delete(`/users/wishlist/${productId}`),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.wishlist })
      toast.success(response.message)
    },
    // Optimistic update
    onMutate: async (productId) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.users.wishlist })

      const previousWishlist = queryClient.getQueryData<WishlistItem[]>(queryKeys.users.wishlist)

      if (previousWishlist) {
        queryClient.setQueryData(
          queryKeys.users.wishlist,
          previousWishlist.filter((item) => item._id !== productId),
        )
      }

      return { previousWishlist }
    },
    onError: (err, productId, context) => {
      queryClient.setQueryData(queryKeys.users.wishlist, context?.previousWishlist)
    },
  })
}
