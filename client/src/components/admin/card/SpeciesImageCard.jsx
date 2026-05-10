import {
  useAddNewImage,
  useDeleteImage,
  useGetImageByFolderName,
} from "@/api/ImagesApi";
import {
  ArrowLeft,
  EllipsisVertical,
  Eye,
  Loader2,
  Trash2,
  X,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  motion,
  useScroll,
  useMotionValueEvent,
  AnimatePresence,
} from "framer-motion";
import Swal from "sweetalert2";
import toast from "react-hot-toast";

const SpeciesImageCard = () => {
  const { id } = useParams();
  const [image, setImage] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [showLoader, setShowLoader] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(null);
  const menuRef = useRef();

  const LIMIT = 20;
  const [limit, setLimit] = useState(LIMIT);

  const naviagte = useNavigate();
  const { scrollYProgress } = useScroll();

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (latest > 0.9) {
      handleUpdateLimit();
    }
  });

  function handleUpdateLimit() {
    if (limit <= image.length) setLimit((prev) => (prev += LIMIT));
  }

  const { data: getGalleryImage, isLoading } = useGetImageByFolderName({
    folder_name: id,
    limit,
  });

  const { mutate: deleteImage } = useDeleteImage();
  const { mutate: addImages, isPending } = useAddNewImage();

  const handleOpenPreview = (image) => {
    setPreviewImage(image);
  };

  const handleClosePreview = () => {
    setPreviewImage(null);
  };

  const handleDeleteImage = async (image) => {
    const result = await Swal.fire({
      title: "คุณแน่ใจหรือไม่?",
      text: "คุณต้องการลบรูปภาพนี้นี้หรือไม่?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "ใช่, ฉันต้องการ!",
      cancelButtonText: "ยกเลิก",
    });
    if (result.isConfirmed) {
      const filename = image.split("/").pop();
      await deleteImage({ folderName: id, fileName: filename });
    }
  };

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);

    if (files.length >= 100) {
      return toast.error("กรุณาอัปโหลดไฟล์ภาพไม่เกิน 100 ไฟล์");
    }

    if (files.length > 0) {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("images", file);
      });

      addImages({ folderName: id, formData });
    }
  };

  const handleMenuClickOutside = (e) => {
    if (e.defaultPrevented) return;

    setTimeout(() => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMenuOpen(null);
      }
    });
  };

  useEffect(() => {
    if (getGalleryImage?.images?.length > 0) {
      setImage(getGalleryImage.images);
    }
  }, [getGalleryImage]);

  useEffect(() => {
    if (isLoading) {
      setShowLoader(true);
    } else {
      const timer = setTimeout(() => {
        setShowLoader(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  useEffect(() => {
    if (isMenuOpen !== null) {
      document.addEventListener("mousedown", handleMenuClickOutside);
    } else {
      document.removeEventListener("mousedown", handleMenuClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleMenuClickOutside);
    };
  });

  if (isPending) {
    return (
      <div className="flex flex-col gap-2 items-center justify-center py-6">
        <Loader2 className="size-8 animate-spin text-gray-500" />
        <p className="text-gray-500">กำลังอัปโหลดภาพ</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="text-xs md:text-sm font-medium text-gray-500">
          ทั้งหมด {getGalleryImage?.total} รูปภาพ
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => naviagte(-1)}
            className="w-max text-xs md:text-sm flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-md text-white bg-gray-500 hover:bg-gray-600 transition-all duration-300 ease-in-out hover:-translate-y-1 cursor-pointer"
          >
            <ArrowLeft className="size-4 md:size-5" />
            <p className="text-xs md:text-sm">กลับ</p>
          </button>
          <label
            htmlFor="images"
            className="w-max text-xs md:text-sm px-3 py-1.5 sm:px-4 sm:py-2 text-white bg-blue-500 hover:bg-blue-700 rounded-md transition-all ease-in-out hover:-translate-y-1 duration-300 cursor-pointer"
          >
            เพิ่มรูปภาพ
            <input
              type="file"
              name="images"
              id="images"
              hidden
              multiple
              accept="image/*"
              onChange={handleImageChange}
            />
          </label>
        </div>
      </div>
      {image.length === 0 ? (
        <div className="flex items-center justify-center py-6">
          <p className="text-gray-500 ">โฟลเดอร์นี้ไม่มีข้อมูลภาพ</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {image?.map((url, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="relative w-full h-full group overflow-hidden rounded hover:scale-105 transition-transform duration-300 shadow-md"
              >
                {/* รูปภาพ */}
                <img
                  src={`${import.meta.env.VITE_SERVER_URL}/${url}`}
                  alt={`img-${index}`}
                  className="w-full h-full rounded cursor-pointer group-hover:scale-105 transition-transform duration-300"
                />

                {/* Backdrop + Icons */}
                <div
                  className="absolute inset-0 bg-black/30 bg-opacity-60 hidden lg:flex items-center justify-center gap-2
                        opacity-0 lg:group-hover:opacity-100 transition-all duration-300 group-hover:scale-105 cursor-pointer"
                >
                  {/* See Icon */}
                  <button
                    onClick={() => {
                      handleOpenPreview(
                        `${import.meta.env.VITE_SERVER_URL}/${url}`
                      );
                    }}
                    className="p-2 bg-blue-100 border border-blue-400 rounded-full shadow hover:bg-blue-200 duration-300 cursor-pointer transiton-all transform hover:scale-115"
                  >
                    <Eye className="text-gray-700 size-4 md:size-5" />
                  </button>
                  {/* Delete Icon */}
                  <button
                    onClick={() => handleDeleteImage(url)}
                    className="p-2 bg-red-100 border border-red-400 rounded-full shadow hover:bg-red-200 duration-300 cursor-pointer transiton-all transform hover:scale-115"
                  >
                    <Trash2 className="text-gray-700 size-4 md:size-5" />
                  </button>
                </div>

                {/* Mobile Display */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMenuOpen(index);
                  }}
                  className="absolute lg:hidden right-1 top-1 p-1 rounded-full bg-gray-50 active:bg-gray-100 border border-gray-600"
                >
                  <EllipsisVertical className="size-5 text-gray-600" />
                </button>
                <AnimatePresence>
                  {isMenuOpen === index && (
                    <motion.div
                      ref={menuRef}
                      initial={{ scale: 0.8, opacity: 0, y: -20 }}
                      animate={{ scale: 1, opacity: 1, y: 0 }}
                      exit={{ scale: 0.8, opacity: 0, y: -20 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-10 right-4 bg-white p-1.5 rounded-lg border border-gray-400 min-w-20 text-gray-600"
                    >
                      <div className="flex flex-col items-start justify-center gap-4 text-xs">
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenPreview(
                              `${import.meta.env.VITE_SERVER_URL}/${url}`
                            );
                          }}
                          className="w-full flex items-center justify-between gap-2"
                        >
                          <Eye className="size-4" />
                          ดูรูปภาพ
                        </div>
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteImage(url);
                          }}
                          className="w-full flex items-center justify-between gap-2"
                        >
                          <Trash2 className="size-4" />
                          ลบรูปภาพ
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
          {showLoader && (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="size-8 animate-spin text-gray-500" />
            </div>
          )}
        </>
      )}

      {previewImage && (
        <div
          className="fixed inset-0 bg-black/75 flex items-center justify-center z-100"
          onClick={handleClosePreview}
        >
          <div className="relative p-6" onClick={(e) => e.stopPropagation()}>
            <img
              src={previewImage}
              alt="Preview"
              className="max-w-full max-h-80 rounded-lg"
            />
            <button
              onClick={handleClosePreview}
              className="absolute top-2 right-2 text-white bg-gray-500 rounded-full p-1.5 hover:bg-gray-700 cursor-pointer transition-all duration-200"
            >
              <X />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpeciesImageCard;
