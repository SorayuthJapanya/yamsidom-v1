import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useAuthUser = () => {
  return useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get("/auth/me");
        return res.data;
      } catch (error) {
        if (error.response && error.response.status === 401) return null;
        toast.error(error.response?.data?.message || "Something went wrong");
        return null;
      }
    },
  });
};

export const useLogoutUser = ({ navigate }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => axiosInstance.post("/auth/logout"),
    onMutate: async () => {
      queryClient.setQueriesData(["authUser"], null);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      toast.success("ออกจากระบบเสร็จสิ้น");
      localStorage.removeItem("userRole");
      navigate("/login");
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

export const useLoginUser = ({ navigate }) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (userData) =>
      await axiosInstance.post("/auth/login", userData),
    onSuccess: (response) => {
      const { role } = response.data.user;

      localStorage.setItem("userRole", role);

      queryClient.invalidateQueries({ queryKey: ["authUser"] });

      toast.success("เข้าสู่ระบบเสร็จสิ้น");
      navigate("/classification");
    },
    onError: (error) => {
      toast.error(error.response.data.message || "Something went wrong!!");
    },
  });
};

export const useSignupUser = ({ navigate }) => {
  return useMutation({
    mutationFn: async (data) => {
      const res = await axiosInstance.post("/auth/signup", data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("สร้างบัญชีเสร็จสิ้น");
      navigate("/login");
    },
    onError: (err) =>
      toast.error(err.response.data.message || "มีบางอย่างผิดพลาด!!"),
  });
};

export const useAdminAddUser = () => {
  return useMutation({
    mutationFn: async (data) => {
      const res = await axiosInstance.post("/auth/signup", data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("สร้างบัญชีเสร็จสิ้น");
      window.history.back();
    },
    onError: (err) =>
      toast.error(err.response.data.message || "มีบางอย่างผิดพลาด!!"),
  });
};

export const useGetUserById = ({ userId }) => {
  return useQuery({
    queryKey: ["getSelectedUser", userId],
    queryFn: async () => {
      const res = await axiosInstance.get(`/auth/get-user/${userId}`);
      return res.data;
    },
  });
};

export const useUpdateProfile = ({ userId, refetchUser }) => {
  return useMutation({
    mutationFn: async (updateData) => {
      const formData = new FormData();
      if (updateData) formData.append("image", updateData);

      return await axiosInstance.put(
        `/auth/update-profile/${userId}`,
        formData
      );
    },
    onSuccess: () => {
      toast.success("Profile updated succesfully");
      if (refetchUser) refetchUser;
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Update profile failed ");
    },
  });
};

export const useUpdateUser = ({ userId, navigate }) => {
  return useMutation({
    mutationFn: async (formData) => {
      const form = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (key === "profilePic" && value instanceof File) {
          form.append("image", value);
        } else {
          form.append(key, value);
        }
      });

      return await axiosInstance.put(`/auth/update-user/${userId}`, form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
    onSuccess: () => {
      toast.success("อัปเดตข้อมูลส่วนตัวเสร็จสิ้น");
      navigate(-1);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "อัปเดตล้มเหลว");
    },
  });
};
