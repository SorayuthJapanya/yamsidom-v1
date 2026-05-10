import { useAuthUser } from "@/api/AuthApi";
import EditPreviewImageCard from "@/components/classification/EditPreviewImageCard";
import { useUpload } from "@/context/UploadContext";
import React, { useCallback, useRef, useState } from "react";
import { motion } from "framer-motion";
import LoadingScreen from "@/components/LoadingScreen";

const EditPreviewPage = () => {
  const { images, setImages } = useUpload();
  const [isClassificationLoadingAll, setIsClassificationLoadingAll] =
    useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const formRef = useRef([]);

  const { data: authUser } = useAuthUser();

  const [formData, setFormData] = useState(
    images.map(() => ({
      userId: authUser._id,
      userName: authUser.name,
      isCropped: false,
    }))
  );

  const handleClickSubmitAll = useCallback(async () => {
    for (const form of formRef.current || []) {
      if (form && form.handleSubmitAllForm) {
        await form.handleSubmitAllForm();
      }
    }
  }, []);

  const headerVariants = {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8 },
  };

  const buttonVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay: 0.2 },
  };

  if (images.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-160">
        ไม่มีรูปภาพที่ท่านเลือก
      </div>
    );
  }

  if (isClassificationLoadingAll) {
    return (
      <LoadingScreen completedCount={completedCount} totalCount={totalCount} />
    );
  }

  return (
    <div className="lg:max-w-[1280px] px-4 w-full mx-auto min-h-[40rem] mb-20 flex flex-col">
      <motion.div
        className="text-center my-8 mt-10 px-8 sm:px-0 "
        {...headerVariants}
      >
        <h1 className="text-4xl font-semibold text-primary">
          เลือกคุณลักษณะ
          <span className="block sm:inline text-blue-500">
            ของใบมันพื้นบ้าน
          </span>
        </h1>
      </motion.div>

      <motion.div
        className="w-full lg:max-w-5xl mx-auto flex items-center justify-between mb-2 sm:mt-4"
        {...buttonVariants}
      >
        <div className="w-50 sm:w-max text-xs md:text-sm text-gray-500 flex flex-col gap-2">
          <p>* {images.length} / 30 ภาพ (จำกัดการอัปโหลดต่อครั้ง)</p>
          <p>
            * ภาพที่อัปโหลดจะถูกลบโดยอัตโนมัติภายใน 10 นาที
            เพื่อรักษาประสิทธิภาพของระบบ
          </p>
        </div>
        <button
          type="button"
          onClick={handleClickSubmitAll}
          className="w-max px-4 py-3 md:px-6 md:py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 active:bg-blue-900 transform hover:-translate-y-0.5 duration-200 cursor-pointer"
        >
          อัปโหลดทั้งหมด
        </button>
      </motion.div>

      <div
        className={`w-full  mx-auto  ${
          images.length === 1
            ? "flex items-center justify-center max-w-lg"
            : "grid grid-cols-1 md:grid-cols-2 max-w-5xl"
        } gap-4 md:gap-8 mt-4 md:mt-6`}
      >
        {images.map((image, index) => (
          <EditPreviewImageCard
            key={index}
            index={index}
            image={image}
            formRef={(el) => (formRef.current[index] = el)}
            images={images}
            setImages={setImages}
            formData={formData}
            setFormData={setFormData}
            setTotalCount={setTotalCount}
            setCompletedCount={setCompletedCount}
            setIsClassificationLoadingAll={setIsClassificationLoadingAll}
          />
        ))}
      </div>
    </div>
  );
};

export default EditPreviewPage;
