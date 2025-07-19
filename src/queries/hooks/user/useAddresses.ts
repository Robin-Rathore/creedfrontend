//@ts-nocheck
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "react-hot-toast"
import { apiClient } from "../../utils/api"
import { queryKeys } from "../../utils/queryKeys"
import type { Address, AddAddressRequest, UpdateAddressRequest } from "../../types/user"

export const useAddresses = () => {
  return useQuery({
    queryKey: queryKeys.users.addresses,
    queryFn: (): Promise<{ success: boolean; count: number; data: Address[] }> => apiClient.get("/users/addresses"),
    select: (data) => data.data,
  })
}

export const useAddAddress = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: AddAddressRequest): Promise<{ success: boolean; message: string; data: Address }> =>
      apiClient.post("/users/addresses", data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.addresses })
      toast.success(response.message)
    },
  })
}

export const useUpdateAddress = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      ...data
    }: UpdateAddressRequest & { id: string }): Promise<{ success: boolean; message: string; data: Address }> =>
      apiClient.put(`/users/addresses/${id}`, data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.addresses })
      toast.success(response.message)
    },
  })
}

export const useDeleteAddress = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string): Promise<{ success: boolean; message: string }> =>
      apiClient.delete(`/users/addresses/${id}`),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.addresses })
      toast.success(response.message)
    },
  })
}
