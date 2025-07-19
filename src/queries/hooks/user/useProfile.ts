//@ts-nocheck
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useAtom } from "jotai"
import { toast } from "react-hot-toast"
import { apiClient, createFormData } from "../../utils/api"
import { queryKeys } from "../../utils/queryKeys"
import { updateUserAtom } from "../../store/auth"
import type { User } from "../../types/auth"
import type { UpdateProfileRequest } from "../../types/user"

export const useProfile = () => {
  return useQuery({
    queryKey: queryKeys.users.profile,
    queryFn: (): Promise<{ success: boolean; data: User }> => apiClient.get("/users/profile"),
    select: (data) => data.data,
  })
}

export const useUpdateProfile = () => {
  const queryClient = useQueryClient()
  const [, updateUser] = useAtom(updateUserAtom)

  return useMutation({
    mutationFn: (data: UpdateProfileRequest): Promise<{ success: boolean; message: string; data: User }> =>
      apiClient.put("/users/profile", data),
    onSuccess: (response) => {
      updateUser(response.data)
      queryClient.invalidateQueries({ queryKey: queryKeys.users.profile })
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.user })
      toast.success(response.message)
    },
  })
}

export const useUploadAvatar = () => {
  const queryClient = useQueryClient()
  const [, updateUser] = useAtom(updateUserAtom)

  return useMutation({
    mutationFn: (file: File): Promise<{ success: boolean; message: string; data: { avatar: any } }> => {
      const formData = createFormData({ avatar: file })
      return apiClient.post("/users/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.profile })
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.user })
      toast.success(response.message)
    },
  })
}
