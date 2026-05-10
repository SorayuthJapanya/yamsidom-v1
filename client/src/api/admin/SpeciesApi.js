import { useMutation, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../../lib/axios";
import toast from "react-hot-toast";

export const useGetAllSpeciesData = ({
  selectedLocalName,
  currentPage,
  role,
}) => {
  return useQuery({
    queryKey: ["getAllSpecies", { selectedLocalName, currentPage, role }],
    queryFn: async () => {
      const res = await axiosInstance.get("/species/allbyquery", {
        params: {
          local_Name: selectedLocalName,
          page: currentPage,
          role: role,
        },
      });
      return res.data;
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to get species");
    },
  });
};

export const useDeleteSpecies = ({ refetchSpeciesData }) => {
  return useMutation({
    mutationFn: async (speciesId) =>
      await axiosInstance.delete(`/species/${speciesId}`),
    onSuccess: () => {
      toast.success("ลบสายพันธุ้นี้เสร็จสิ้น");
      if (refetchSpeciesData) refetchSpeciesData();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete species");
    },
  });
};

export const useGetOneSpecies = ({ speciesId }) => {
  return useQuery({
    queryKey: ["getOneSpecies"],
    queryFn: async () => {
      const res = await axiosInstance.get(`/species/${speciesId}`);
      return res.data;
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Failed to get species data"
      );
    },
  });
};

export const useAddSpecie = ({ setFormData, setImage, navigate }) => {
  return useMutation({
    mutationFn: async (data) => {
      const formData = new FormData();
      formData.append("image", data.image);
      formData.append("leafId", data.leafId);
      formData.append("commonName", data.commonName);
      formData.append("localName", data.localName);
      formData.append("scientificName", data.scientificName);
      formData.append("familyName", data.familyName);
      formData.append("description", data.description);
      formData.append("propagation", data.propagation);
      formData.append("plantingseason", data.plantingseason);
      formData.append("harvestingseason", data.harvestingseason);
      formData.append("utilization", data.utilization);
      formData.append("status", data.status);
      formData.append("surveysite", data.surveysite);

      return await axiosInstance.post("/species/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    onSuccess: () => {
      toast.success("เพิ่มข้อมูลสายพันธุ์เสร็จสิ้น");
      setFormData([]);
      setImage(null);
      navigate("/admin/manage-species");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "failed to add species");
    },
  });
};

export const useEditSpecies = ({
  setFormData,
  setImage,
  navigate,
  speciesId,
}) => {
  return useMutation({
    mutationFn: async (data) => {
      const formData = new FormData();
      formData.append("image", data.image);
      formData.append("leafId", data.leafId);
      formData.append("commonName", data.commonName);
      formData.append("localName", data.localName);
      formData.append("scientificName", data.scientificName);
      formData.append("familyName", data.familyName);
      formData.append("description", data.description);
      formData.append("propagation", data.propagation);
      formData.append("plantingseason", data.plantingseason);
      formData.append("harvestingseason", data.harvestingseason);
      formData.append("utilization", data.utilization);
      formData.append("status", data.status);
      formData.append("surveysite", data.surveysite);

      return await axiosInstance.put(`/species/${speciesId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    onSuccess: () => {
      toast.success("แก้ไขข้อมูลสายพันธุ์เสร็จสิ้น");
      setFormData([]);
      setImage(null);
      navigate(-1);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "failed to edit species");
    },
  });
};
