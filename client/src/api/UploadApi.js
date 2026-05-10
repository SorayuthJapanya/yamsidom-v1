import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useClassification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (classificationData) => {
      return await axiosInstance.post("/upload", classificationData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      toast.success(response?.data?.message || "ส่งข้อมูลเรียบร้อย");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Something went wrong!!");
    },
  });
};

// UploadApi.jsx
export const useAllClassification = ({ setCompletedCount }) => {
  return useMutation({
    mutationFn: async ({ data, currentIndex, totalFiles }) => {
      const response = await axiosInstance.post("/upload", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );

          const baseProgress = currentIndex;
          const currentFileProgress = percentCompleted / 100;
          const totalProgress = baseProgress + currentFileProgress;

          setCompletedCount(Math.min(totalFiles, Math.floor(totalProgress)));
        },
      });
      return response.data;
    },
    onSuccess: (_data, variables) => {
      setCompletedCount(variables.currentIndex + 1);
    },
    onError: (error) => {
      console.error("Error submitting forms:", error);
      toast.error(
        error.response?.data?.message || "เกิดข้อผิดพลาดในการส่งข้อมูล"
      );
    },
  });
};
