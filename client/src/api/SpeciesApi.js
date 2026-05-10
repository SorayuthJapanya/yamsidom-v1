import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useGetAllSpecies = ({ selectedLocalName, leafId }) => {
  return useQuery({
    queryKey: ["getAllSpecies", selectedLocalName, leafId],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get("/species/allbyquery", {
          params: {
            local_Name: selectedLocalName,
            leafId: leafId,
          },
        });
        return res.data;
      } catch (error) {
        toast.error(error?.response?.data?.message);
      }
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to fetch species data"
      );
    },
  });
};

export const useGetSpeciesById = ({ specie_id }) => {
  return useQuery({
    queryKey: ["getSpecie", specie_id],
    queryFn: async () => {
      const res = await axiosInstance.get(`/species/${specie_id}`);
      return res.data;
    },
    onError: () => {
      toast.error("Failed to fetch species data");
    },
  });
};
