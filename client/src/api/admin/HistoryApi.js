import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../../lib/axios";
import toast from "react-hot-toast";

export const useGetAllHistoryData = () => {
  return useQuery({
    queryKey: ["getAllHostory"],
    queryFn: async () => {
      const res = await axiosInstance.get("/history/get-history");
      return res.data;
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to get histories");
    },
  });
};

export const useGetAllUserHistoryData = () => {
  return useQuery({
    queryKey: ["getAllUserHistoryData"],
    queryFn: async () => {
      const res = await axiosInstance.get("/history/data-history");
      return res.data;
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to get histories");
    },
  });
};

export const useGetHistoryStat = ({ selectedRange }) => {
  return useQuery({
    queryKey: ["historiesStat", selectedRange],
    queryFn: async () => {
      const res = await axiosInstance("/history/stat", {
        params: {
          range: selectedRange,
        },
      });
      return res.data;
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to get species");
    },
  });
};

export const useGetAllClassification = ({
  selectedUser,
  filterSpecies,
  currentPage,
}) => {
  return useQuery({
    queryKey: [
      "getAllClassifier",
      { name: selectedUser, species: filterSpecies.toString(), currentPage },
    ],
    queryFn: async () => {
      const res = await axiosInstance.get("/history/get-history", {
        params: {
          name: selectedUser,
          species: filterSpecies.toString(),
          page: currentPage,
        },
      });
      return res.data;
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to get histories");
    },
  });
};

export const useGetFilterSpecies = () => {
  return useQuery({
    queryKey: ["getAllFilter"],
    queryFn: async () => {
      const res = await axiosInstance.get("/species/all");
      return res.data;
    },
    onError: (error) => {
      console.log(error);
      toast.error(error.response?.data?.message);
    },
  });
};
