// src/components/ImageGallery.jsx
import React, { useEffect, useState } from "react";
import { useGetImageByFolderName } from "../api/ImagesApi";
import { Loader2, X } from "lucide-react";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";

const ImageGallery = ({ folder_name, setImagesLength }) => {
  const [imageData, setImageData] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [showLoader, setShowLoader] = useState(false);

  const LIMIT = 20;
  const [limit, setLimit] = useState(LIMIT);

  const { scrollYProgress } = useScroll();

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (latest > 0.9) {
      handleUpdateLimit();
    }
  });

  function handleUpdateLimit() {
    if (limit <= imageData.length) setLimit((prev) => (prev += LIMIT));
  }

  const {
    data: imageUrls,
    isLoading,
    isError,
  } = useGetImageByFolderName({
    folder_name: folder_name,
    limit,
  });

  const handleClickkImage = (imageUrl) => {
    setPreviewImage(imageUrl);
  };

  const handleClosePreview = () => {
    setPreviewImage(null);
  };

  useEffect(() => {
    if (imageUrls?.images?.length > 0) {
      setImageData(imageUrls.images);
      setImagesLength(imageUrls.total);
    }
  }, [imageUrls, setImagesLength]);

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

  return (
    <div className="max-w-6xl mx-auto py-6 px-8">
      {isError || imageData.length === 0 ? (
        <div className="w-full flex items-center justify-center text-gray-500 font-medium">
          โฟลเดอร์นี้ไม่มีข้อมูลภาพ
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {imageData?.map((url, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                onClick={() => {
                  handleClickkImage(
                    `${import.meta.env.VITE_SERVER_URL}/${url}`
                  );
                }}
                className="w-full h-full relative"
              >
                <img
                  src={`${import.meta.env.VITE_SERVER_URL}/${url}`}
                  alt={`img-${index}`}
                  className="w-full h-full rounded cursor-pointer hover:scale-105 transition-transform duration-300"
                />
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

export default ImageGallery;
