//@ts-nocheck
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/queries/utils/api";
import { queryKeys } from "@/queries/utils/queryKeys";
import { toast } from "react-hot-toast";

// Get user addresses
export const useAddresses = () => {
  return useQuery({
    queryKey: queryKeys.user.addresses(),
    queryFn: async () => {
      const response = await api.get("/user/addresses");
      return response.data.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Create address
export const useCreateAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (addressData: any) => {
      const response = await api.post("/user/addresses", addressData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.user.addresses() });
      toast.success("Address added successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to add address");
    },
  });
};

// Update address
export const useUpdateAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...addressData }: any) => {
      const response = await api.put(`/user/addresses/${id}`, addressData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.user.addresses() });
      toast.success("Address updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update address");
    },
  });
};

// Delete address
export const useDeleteAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (addressId: string) => {
      const response = await api.delete(`/user/addresses/${addressId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.user.addresses() });
      toast.success("Address deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete address");
    },
  });
};
