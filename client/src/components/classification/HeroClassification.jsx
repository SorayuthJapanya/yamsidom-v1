import React from "react";
import InputImg from "../InputImg";
import { motion } from "framer-motion";

const HeroClassification = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[40rem] ">
      {/* Text Content Section */}
      <motion.div className="w-full px-6 py-12 lg:px-12 lg:py-0 flex flex-col items-center lg:items-start">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl lg:text-5xl font-bold tracking-tight text-gray-900 text-center lg:text-left"
        >
          อัปโหลดรูปภาพของคุณ{" "}
          <span className="block md:inline mt-3 px-8 py-2 rounded-full font-normal text-white bg-gradient-to-r from-blue-400 to-blue-700">
            สำหรับการจำแนก
          </span>
        </motion.h1>
      </motion.div>

      {/* Image Input Section */}
      <div className="flex items-center justify-center w-full p-8 lg:p-12">
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full max-w-md flex flex-col items-center mt-2 md:mt-10"
        >
          <InputImg />
        </motion.div>
      </div>
    </div>
  );
};

export default HeroClassification;
