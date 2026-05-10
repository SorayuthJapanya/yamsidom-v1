import { motion } from "framer-motion";
import UploadImageForm from "../upload/UploadImageForm";

const EditPreviewImageCard = ({
  index,
  image,
  formRef,
  images,
  setImages,
  formData,
  setFormData,
  setCompletedCount,
  setTotalCount,
  isClassificationLoading,
  setIsClassificationLoadingAll,
}) => {
  const cardVariants = () => ({
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay: 0.3 },
  });

  if (isClassificationLoading === index) {
    return (
      <motion.div
        {...cardVariants}
        viewport={{ once: true }}
        key={index}
        className="w-full lg:max-w-5xl mx-auto px-8 py-12 my-4 rounded-xl shadow-[0px_0px_30px_-20px_rgba(0,_0,_0,_0.8)] relative"
      >
        <div className="w-full h-60 flex items-center justify-center">
          <Loader className="size-5 animate-spin duration-200" />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      viewport={{ once: true }}
      className="w-full mx-auto px-8 py-10 sm:py-6 rounded-xl shadow-[0px_0px_30px_-20px_rgba(0,_0,_0,_0.8)] relative"
    >
      <UploadImageForm
        image={image}
        index={index}
        ref={formRef}
        images={images}
        setImages={setImages}
        formData={formData}
        setFormData={setFormData}
        setTotalCount={setTotalCount}
        setCompletedCount={setCompletedCount}
        setIsClassificationLoadingAll={setIsClassificationLoadingAll}
      />
    </motion.div>
  );
};

export default EditPreviewImageCard;
