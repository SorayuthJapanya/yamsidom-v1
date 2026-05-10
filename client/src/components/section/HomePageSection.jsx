import React from "react";
import InputImg from "../InputImg";
import AboutUsSection from "./AboutUsSection";
import { motion } from "framer-motion";

const HomePageSection = () => {
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[30rem] items-center w-full">
        {/* Text Content Section */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="w-full px-6 py-12 lg:px-12 lg:py-0 flex flex-col justify-center items-center lg:items-start gap-6"
        >
          <h1 className="text-4xl lg:text-5xl font-semibold tracking-tight text-gray-900 text-center lg:text-left">
            ระบบวิเคราะห์และจำแนกชิ้นมันพื้นบ้าน{" "}
            <span className="block md:inline text-blue-500 mt-4">
              ด้วยการประมวลผลภาพและปัญญาประดิษฐ์
            </span>
          </h1>
          <p className="text-xl lg:text-2xl font-medium text-gray-700 text-center lg:text-left max-w-lg">
            การประยุกต์ใช้การประมวลผลภาพร่วมกับ{" "}
            <span className="text-blue-500">
              การเรียนรู้ของเครื่องสำหรับการจำแนกวัตถุขั้นสูง
            </span>
          </p>
        </motion.div>

        {/* Image Input Section */}
        <div className="flex items-center justify-center h-full p-8 lg:p-12 ">
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full max-w-md h-full flex flex-col justify-center items-center"
          >
            <InputImg />
          </motion.div>
        </div>
      </div>

      {/* About Us Section */}
      <AboutUsSection />

      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true }}
        className="w-full flex justify-center my-10"
      >
        <InputImg />
      </motion.div>
    </>
  );
};

export default HomePageSection;
