import React, { useEffect, useState } from "react";

// import library
import { Loader2, Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import "leaflet/dist/leaflet.css";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

// import Api
import { useAuthHistory, useDeleteAllHistory } from "../api/ClassificationApi";
import Title from "../components/Title";
import HistoryClassificationCard from "../components/history/HistoryClassificationCard";
import { useAuthUser } from "../api/AuthApi";
import Pagination from "../components/Pagination";
import DatePicker from "../components/DatePicker";

const HistoryPage = () => {
  const [page, setPage] = useState(1);
  const [historiesData, setHistoriesData] = useState([]);
  const [newItemsCount, setNewItemsCount] = useState(0);
  const [selectedDate, setSelectedDate] = useState(null);

  const { data: authUser } = useAuthUser();

  const {
    data: authHistory,
    refetch: refetchHistory,
    isLoading: isHistoryLoading,
  } = useAuthHistory({
    userId: authUser?._id,
    page: page,
    date: selectedDate,
  });

  const { mutate: deleteAllHistory } = useDeleteAllHistory();

  const handleDeleteAllHistory = async () => {
    const result = await Swal.fire({
      title: "คุณแน่ใจหรือไม่?",
      text: "คุณต้องการลบประวัติของคุณทั้งหมดหรือไม่?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "ใช่, ฉันต้องการ!",
      cancelButtonText: "ยกเลิก",
    });

    if (result.isConfirmed) {
      try {
        await deleteAllHistory({ userId: authUser?._id });
      } catch (error) {
        toast.error(
          error?.response?.data?.message || "ลบประวัติทั้งหมดล้มเหลว"
        );
      }
    }
  };

  const handlePageChange = (page) => {
    setPage(page);
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  useEffect(() => {
    if (authHistory) {
      setHistoriesData(authHistory.result);
      const newItemsCount = authHistory.result.reduce(
        (total, group) => total + group.data.length,
        0
      );
      setNewItemsCount(newItemsCount);
    }
  }, [authHistory]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  if (!authUser) {
    return (
      <div className="flex items-center justify-center min-h-scree">
        <p>ไม่พบประวัติการจำแนกของคุณ</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <motion.header
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-8"
      >
        <Title
          title="ประวัติการจำแนก"
          subTitle="ดูประวัติการจำแนกพันธุ์มันพื้นบ้านของคุณ"
        />
      </motion.header>

      <div className="max-w-4xl mx-auto">
        <div className="w-full">
          <motion.div className="w-full flex justify-end items-center mb-6">
            <div className="flex items-center gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="relative max-w-xs"
              >
                <DatePicker
                  selectedDate={selectedDate}
                  setSelectedDate={setSelectedDate}
                  handleDateChange={handleDateChange}
                />
              </motion.div>

              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="w-max flex items-center gap-2 px-4 py-1.5 sm:py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition-all duration-200  text-sm md:text-base cursor-pointer"
                onClick={handleDeleteAllHistory}
              >
                <Trash2 className="w-4 h-4" />
                ลบประวัติทั้งหมด
              </motion.button>
            </div>
          </motion.div>

          <div className="w-full">
            {isHistoryLoading ? (
              <div className="w-full flex justify-center text-center text-gray-500">
                <Loader2 className="size-6 animate-spin" />
              </div>
            ) : authHistory === undefined ? (
              <div className="text-center text-gray-600">
                <p>ไม่พบประวัติการจำแนกในวันที่นี้</p>
              </div>
            ) : (
              <HistoryClassificationCard
                historiesData={historiesData}
                refetchHistory={refetchHistory}
              />
            )}
          </div>

          <footer className="mt-6 border-t pt-4">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2">
                <p className="text-gray-500 text-sm">
                  ทั้งหมด{" "}
                  <span className="font-medium text-gray-900">
                    {authHistory?.total ?? 0}
                  </span>{" "}
                  รายการ
                </p>
                <p className="text-gray-500 text-sm">
                  กำลังแสดง{" "}
                  <span className="font-medium text-gray-900">
                    {newItemsCount}
                  </span>{" "}
                  รายการ
                </p>
              </div>
              <Pagination
                totalPages={authHistory?.totalPages}
                currentPage={authHistory?.page}
                handlePageChange={handlePageChange}
              />
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;
