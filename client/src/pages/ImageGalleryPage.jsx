import { motion } from "framer-motion";
import Title from "../components/Title";
import { useParams } from "react-router-dom";
import ImageGallery from "../components/ImageGallery";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";

const ImageGalleryPage = () => {
  const { id } = useParams();
  const [imagesLength, setImagesLength] = useState(0);
  const localName = id;

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <motion.header
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-6 space-y-2"
      >
        <Title
          title={`คลังรูปภาพ ${localName}`}
          subTitle="รวมภาพพันธุ์พืชพื้นบ้านเพื่อการเรียนรู้และจำแนก"
        />

        <div className="flex flex-col gap-4 max-w-6xl mx-auto mt-10">
          <motion.div className="flex justify-between items-center px-8">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xs md:text-sm font-medium text-gray-500"
            >
              ทั้งหมด {imagesLength} รูปภาพ
            </motion.h1>
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              onClick={() => history.back()}
              className="flex items-center gap-2 px-4 py-2 bg-gray-500 hover:bg-gray-600 duration-200 text-xs sm:text-sm text-white rounded-md cursor-pointer transition-all transform ease-in-out hover:-translate-y-1"
            >
              <ArrowLeft className="size-5" /> กลับ
            </motion.button>
          </motion.div>
          <ImageGallery folder_name={id} setImagesLength={setImagesLength}/>
        </div>
      </motion.header>
    </div>
  );
};

export default ImageGalleryPage;
