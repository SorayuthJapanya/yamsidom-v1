import React from "react";
import { useState } from "react";
import {
  useDeleteHisory,
  useUpdateHistory,
  useUpdateValidate,
} from "../../api/ClassificationApi";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { openLocationPicker } from "../../lib/locationPicker";
import {
  ChevronDown,
  ChevronUp,
  Edit,
  Loader2,
  MapPin,
  Trash2,
} from "lucide-react";
import { motion } from "framer-motion";
import { useEffect } from "react";
import StatusBadge from "../StatusBadge";

const HistoryClassificationCard = ({ historiesData, refetchHistory }) => {
  const [isDeleted, setIsDeleted] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isValidateOpen, setIsValidateOpen] = useState(null);

  const validateData = [
    { value: "POOR", data: "แย่" },
    { value: "FAIR", data: "พอใช้" },
    { value: "GOOD", data: "ดี" },
    { value: "EXCELLECT", data: "ดีเยี่ยม" },
  ];

  const deleteHistory = useDeleteHisory({ setIsDeleted, refetchHistory });

  const updateHistory = useUpdateHistory({
    setIsUpdating,
    refetchHistory,
  });

  const { mutate: updateValidation, isPending: isUpdateValidationUpdate } =
    useUpdateValidate();

  const parseExifDate = (exifString) => {
    if (
      !exifString ||
      typeof exifString !== "string" ||
      !exifString.includes(" ")
    ) {
      return null;
    }

    try {
      const [datePart, timePart] = exifString.split(" ");
      const [year, month, day] = datePart.split(":");
      const [hours, minutes, seconds] = timePart.split(":");

      return new Date(year, month - 1, day, hours, minutes, seconds);
    } catch (error) {
      console.error("Invalid EXIF date format:", exifString, error);
      return null;
    }
  };

  const handleDeleteHistory = async (historyId) => {
    const result = await Swal.fire({
      title: "คุณแน่ใจหรือไม่?",
      text: "คุณต้องการลบประวัติของคุณหรือไม่?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "ใช่, ฉันต้องการ!",
      cancelButtonText: "ยกเลิก",
    });
    if (result.isConfirmed) {
      try {
        setIsDeleted(historyId);
        await deleteHistory.mutateAsync({ historyId: historyId });
      } catch (error) {
        toast.error(error?.response?.data?.message || "ลบประวัติล้มเหลว");
      } finally {
        setIsDeleted(null);
        refetchHistory();
      }
    }
  };

  const handleUpdateHistory = async (
    historyId,
    currentLatitude,
    currentLongitude
  ) => {
    try {
      const location = await openLocationPicker(
        currentLatitude,
        currentLongitude
      );
      if (location) {
        updateHistory.mutate({
          historyId: historyId,
          latitude: location.latitude,
          longitude: location.longitude,
        });
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "อัปเดต GPS ล้มเหลว");
    }
  };

  const handleUpdateValidate = async ({ historyId, validate }) => {
    if (!validate) return toast.error("กรุณาเลือกข้อมูลประเมินความถูก");
    updateValidation({ historyId, validate });
  };

  useEffect(() => {
    if (isUpdating) {
      setTimeout(() => {
        setIsUpdating(false);
      }, 2000);
    }
  });

  return (
    <div className="space-y-6">
      {historiesData.map((history, index) => (
        <div key={`${history.date}-${index}`} className="mt-8">
          <div className="w-full mx-auto mb-4 ">
            <p className="text-xl font-bold text-blue-600">{history.date}</p>
          </div>

          {history.data.map((historyData) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              key={historyData._id}
              className="group w-full mx-auto bg-white shadow-xl hover:shadow-2xl duration-300 rounded-lg p-6 flex flex-col relative mb-8"
            >
              {isDeleted === historyData._id && (
                <div className="absolute inset-0 bg-white flex items-center justify-center z-100">
                  <Loader2 className="animate-spin size-8" />
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Image Section */}
                <div className="flex justify-center lg:justify-center">
                  <img
                    src={`${import.meta.env.VITE_SERVER_URL}/uploads/${
                      historyData.imageUrl
                    }`}
                    alt={historyData.bestFirstLayer}
                    className="w-95 h-95 object-cover rounded-xl shadow-md hover:scale-102 duration-300"
                  />
                </div>

                {/* Info Section */}
                <div className="flex flex-col gap-4 w-full">
                  {/* First Layer */}
                  <div className="group bg-blue-100 border border-blue-300 hover:bg-blue-200 hover:shadow-md duration-200 px-4 py-3 rounded-xl shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div className="border-b border-b-gray-500 md:border-b-0 md:border-r md:border-r-gray-500">
                        <div className="text-gray-600 group-hover:text-gray-700 text-sm">
                          ผลลัพธ์ของการจัดวิเคราะห์ถึงคุณลักษณะสายพันธุ์
                        </div>
                        <div className="text-blue-600 text-lg md:text-xl font-bold mt-1">
                          {historyData.bestFirstLayer
                            ? historyData.bestFirstLayer
                            : "ไม่มีข้อมูล"}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-600 group-hover:text-gray-700 text-sm">
                          ผลการจำแนกสายพันธุ์ที่ดีที่สุด
                        </div>
                        <div className="text-blue-600 text-lg md:text-xl font-bold mt-1">
                          {historyData.bestSecondLayer
                            ? historyData.bestSecondLayer
                            : "ไม่มีข้อมูล"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Second Layer */}
                  {historyData.secondLayer &&
                  historyData.secondLayer.length > 0 ? (
                    <>
                      <div className="bg-gray-100 border border-gray-300 hover:bg-gray-200 hover:shadow-md duration-200 px-4 py-3 rounded-xl shadow-sm">
                        <p className="text-gray-600 text-sm pb-2 border-b border-gray-500">
                          ผลการจำแนกสายพันธุ์ 5 อันดับแรก
                        </p>
                        <div className="flex flex-col gap-2 mt-2">
                          {historyData.secondLayer
                            .slice(0, 5)
                            .map((specie, index) => (
                              <div
                                key={index}
                                className={`flex items-center gap-2 ${
                                  specie.probability === 0 ? "hidden" : "flex"
                                }`}
                              >
                                <span className="text-blue-600 font-bold text-sm">
                                  {index + 1}.
                                </span>
                                <span className="text-slate-700 text-sm">
                                  {specie.class === "other"
                                    ? "อื่นๆ"
                                    : specie.class}
                                  <span className="ml-2 text-slate-500">
                                    {specie.probability} %
                                  </span>
                                </span>
                              </div>
                            ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center justify-center">
                      <p className="px-4 py-2 bg-blue-400 border border-blue-300 text-white rounded-full text-sm">
                        ไม่มีข้อมูลการจำแนกสายพันธุ์จากกลุ่ม
                      </p>
                    </div>
                  )}

                  {/* Date Info */}
                  <p className="text-sm text-slate-500 mt-2">
                    📅{" "}
                    {historyData.datetime_taken
                      ? "เวลาที่ถ่ายภาพ "
                      : "เวลาที่ทำการจำแนกสายพันธุ์ "}
                    {parseExifDate(historyData.datetime_taken)?.toLocaleString(
                      "th-TH",
                      {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    ) ||
                      new Date(historyData.createdAt).toLocaleString("th-TH", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-center lg:justify-end mt-4 text-sm pl-4">
                <div className="flex gap-2">
                  {/* Validate */}
                  {historyData.validate && (
                    <StatusBadge status={historyData.validate} />
                  )}
                  {/* Dropdown Validate */}
                  <div
                    onClick={() =>
                      setIsValidateOpen(
                        isValidateOpen === historyData._id
                          ? null
                          : historyData._id
                      )
                    }
                    className="gruop relative px-3 py-1.5 bg-white shadow-sm rounded-lg flex items-center justify-between gap-2 hover:bg-gray-100 cursor-pointer border border-gray-300 duration-300"
                  >
                    {isUpdateValidationUpdate ? (
                      <div className="flex items-center justify-center">
                        <Loader2 className="size-4 animate-spin" />
                      </div>
                    ) : (
                      <>
                        <p className="text-gray-800">ประเมินความถูกต้อง</p>
                        {isValidateOpen === historyData._id ? (
                          <ChevronUp className="text-gray-600 size-5" />
                        ) : (
                          <ChevronDown className="text-gray-600 size-5" />
                        )}
                      </>
                    )}
                    {/* Validate Value */}
                    <div
                      className={`absolute z-10 top-full right-0 rounded-lg p-3 mt-1 bg-white min-w-40 shadow-md origin-top duration-300 ${
                        isValidateOpen === historyData._id
                          ? "scale-y-100"
                          : "scale-y-0"
                      }`}
                    >
                      <div className="space-y-2">
                        {validateData.map((item, index) => (
                          <p
                            key={index}
                            onClick={() => {
                              handleUpdateValidate({
                                historyId: historyData._id,
                                validate: item.value,
                              });
                            }}
                            className="text-gray-800 py-2 hover:bg-gray-100 px-2 duration-300"
                          >
                            {item.data}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                  {/* update gps */}
                  <button
                    onClick={() => {
                      handleUpdateHistory(
                        historyData._id,
                        historyData.latitude,
                        historyData.longitude
                      );
                    }}
                    className="flex items-center gap-2 px-3 py-1.5 text-white bg-blue-500 rounded-lg hover:bg-blue-600 cursor-pointer duration-300 transition-all ease-in-out hover:-translate-y-0.5"
                  >
                    <Edit className="size-4" /> ระบุพิกัด GPS
                  </button>
                  {/* <button
                    onClick={() => {
                      handleOpenMap(
                        historyData.latitude,
                        historyData.longitude
                      );
                    }}
                    className="flex items-center gap-2 px-3 py-1.5 text-white bg-green-500 rounded-lg hover:bg-green-600 cursor-pointer duration-300 transition-all ease-in-out hover:-translate-y-0.5"
                  >
                    <MapPin className="size-4" /> ดูพิกัด GPS
                  </button> */}

                  <button
                    onClick={() => handleDeleteHistory(historyData._id)}
                    className="flex items-center gap-2 px-3 py-1.5 text-white bg-gray-400 rounded-lg hover:bg-gray-500 cursor-pointer duration-300 transition-all ease-in-out hover:-translate-y-0.5"
                  >
                    <Trash2 className="size-4" /> ลบประวัติ
                  </button>
                </div>
              </div>

              {/* Map Section */}
              {/* {historyData.latitude && historyData.longitude && (
                <div className="w-full h-85 mt-4 z-1">
                  <MapConponent
                    key={`${historyData.latitude}-${historyData.longitude}`}
                    latitude={historyData.latitude}
                    longitude={historyData.longitude}
                  />
                </div>
              )} */}
            </motion.div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default HistoryClassificationCard;
