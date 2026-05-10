import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";

export const useGetFolderName = ({ selectedFolder }) => {
  return useQuery({
    queryKey: ["getAllFolder", selectedFolder],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get("/gallery/folder-speceis", {
          params: {
            folderName: selectedFolder || "",
          },
        });
        return res.data;
      } catch (error) {
        toast.error(error?.response?.data?.message || "ดึงโฟลเดอร์ไม่สำเร็จ");
      }
    },
  });
};

export const useGetImageByFolderName = ({ folder_name, limit }) => {
  return useQuery({
    queryKey: ["getImageByFolderName", { folder_name, limit }],
    enabled: !!folder_name,
    queryFn: async () => {
      try {
        const res = await axiosInstance.get(`/gallery/species`, {
          params: { folder: folder_name, limit },
        });
        const { data, total } = res.data;

        const images = data.map(
          (fileName) => `uploads/gallery/${folder_name}/${fileName}`
        );

        return {
          images,
          total,
        };
      } catch (error) {
        toast.error(error?.response?.data?.message || "ดึงรูปไม่สำเร็จ");
      }
    },
  });
};

export const useAddNewFolder = ({ setIsNewFolderOpen }) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (folderName) => {
      const res = await axiosInstance.post(
        "/gallery/create-folder",
        folderName
      );
      return res.data;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["getAllFolder"] });
      toast.success(response?.data?.message || "สร้างโฟลเดอร์สำเร็จแล้ว");
      setIsNewFolderOpen(false);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "สร้างโฟลเดอร์ล้มเหลว");
    },
  });
};

export const useAddNewImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ folderName, formData }) => {
      const res = await axiosInstance.post(
        `/gallery/add-images?folderName=${folderName}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      return res.data;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["getImageByFolderName"] });
      queryClient.invalidateQueries({ queryKey: ["getAllFolder"] });
      toast.success(response?.message || "เพิ่มรูปภาพเสร็จสิ้น");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "เพิ่มรูปภาพล้มเหลว");
    },
  });
};

export const useDeleteFolder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ folderName }) => {
      const res = await axiosInstance.delete("/gallery/delete-folder", {
        data: { folderName },
      });
      return res.data;
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["getAllFolder"] });
      toast.success(res?.data?.message || "ลบโฟลเดอร์สำเร็จ");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "ลบโฟลเดอร์ไม่สำเร็จ");
    },
  });
};

export const useDeleteImage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ folderName, fileName }) => {
      const res = await axiosInstance.delete("/gallery/delete-image", {
        data: { folderName, fileName },
      });
      return res.data;
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["getImageByFolderName"] });
      toast.success(res?.data?.message || "ลบรูปภาพสำเร็จ");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "ไม่พบรูปภาพที่ท่านทำรายการ");
    },
  });
};
