import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

// Get History By ID
export const useAuthHistory = ({ userId, page, date }) => {
  return useQuery({
    queryKey: ["authHistory", userId, page, date],
    queryFn: async () => {
      const res = await axiosInstance.get(`/history/get-history/${userId}`, {
        params: { page, date },
      });
      return res.data;
    },
    onSuccess: (data) => {
      if (
        !data.result ||
        (Array.isArray(data.result) && data.result.length === 0)
      ) {
        toast.error("ไม่พบประวัติการจำแนกในวันที่นี้");
      } else {
        toast.success("พบประวัติการจำแนกในวันที่นี้");
      }
    },
    onError: (error) => {
      toast.error(error?.message || "เกิดข้อผิดพลาดในการดึงข้อมูล");
    },
  });
};

// Delete History Classification
export const useDeleteHisory = ({ refetchHistory }) => {
  return useMutation({
    mutationFn: async ({ historyId }) => {
      await axiosInstance.delete(`history/delete-history/${historyId}`);
    },
    onSuccess: async () => {
      toast.success("ลบประวัติการจำแนกเสร็จสิ้น");
      if (refetchHistory) await refetchHistory();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete history.");
      return null;
    },
  });
};

export const useUpdateHistory = ({ setIsUpdating, refetchHistory }) => {
  return useMutation({
    mutationFn: async ({ historyId, latitude, longitude }) => {
      setIsUpdating(true);
      const res = await axiosInstance.put(
        `/history/update-history/${historyId}`,
        { latitude, longitude }
      );
      return res.data;
    },
    onSuccess: async (response) => {
      if (refetchHistory) await refetchHistory();
      toast.success(response?.data?.message || "อัปเดต GPS เสร็จสิ้น");
    },
    onError: (error) => {
      setIsUpdating(false);
      toast.error(error.response?.data?.message || "อัปเดต GPS ล้มเหลว");
    },
  });
};

export const useUpdateValidate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ historyId, validate }) => {
      const res = await axiosInstance.put(
        `/history/update-validate/${historyId}`,
        { validate }
      );
      return res.data;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: ["authHistory"],
      });
      toast.success(
        response?.data?.message || "การประเมินความถูกต้องเสร็จสิ้น"
      );
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "การประเมินความถูกต้องล้มเหลว"
      );
    },
  });
};

// Delete all history
export const useDeleteAllHistory = () => {
  return useMutation({
    mutationFn: async ({ userId }) => {
      await axiosInstance.delete(`history/delete-all-history/${userId}`);
    },
    onSuccess: async () => {
      toast.success("ลบประวิติทั้งหมดของคุณแล้ว");
      window.location.reload();
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Failed to update history."
      );
    },
  });
};
