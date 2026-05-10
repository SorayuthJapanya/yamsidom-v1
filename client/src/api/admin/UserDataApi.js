import { useMutation, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../../lib/axios";
import toast from "react-hot-toast";

export const useGetAllUserData = () => {
  return useQuery({
    queryKey: ["getAllUsers"],
    queryFn: async () => {
      const res = await axiosInstance.get("/auth/allclient");
      return res.data;
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to get users");
    },
  });
};

export const useSelectUser = ({ selectedUser, currentPage }) => {
  return useQuery({
    queryKey: ["getAllAdmin", { name: selectedUser, currentPage }],
    queryFn: async () => {
      const res = await axiosInstance.get("/auth/allclient", {
        params: {
          name: selectedUser,
          page: currentPage,
        },
      });
      return res.data;
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to fetch admins data"
      );
    },
  });
};

export const useDeleteUser = ({ refetchSelectUser }) => {
  return useMutation({
    mutationFn: async ({ userId }) => {
      return await axiosInstance.delete(`/auth/delete-user/${userId}`);
    },
    onSuccess: (response) => {
      toast.success(response.data.message);
      if (refetchSelectUser) refetchSelectUser();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete user.");
    },
  });
};

