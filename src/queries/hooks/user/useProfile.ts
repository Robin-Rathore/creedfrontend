//@ts-nocheck
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/queries/utils/api";
import { queryKeys } from "@/queries/utils/queryKeys";
import { toast } from "react-hot-toast";

// Get user profile
export const useProfile = () => {
  return useQuery({
    queryKey: queryKeys.user.profile(),
    queryFn: async () => {
      const response = await api.get("/user/profile");
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Update user profile
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profileData: any) => {
      const response = await api.put("/user/profile", profileData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.user.profile() });
      toast.success("Profile updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update profile");
    },
  });
};

// Upload avatar
export const useUploadAvatar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("avatar", file);

      const response = await api.post("/user/avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.user.profile() });
      toast.success("Avatar updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to upload avatar");
    },
  });
};
