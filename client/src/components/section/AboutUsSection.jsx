import React from "react";
import rmutlLogo from "../../assets/rmutl_logo.png";
import plantLogo from "../../assets/plant_logo.png";
import engineerLogo from "/engineer_logo.png";
import buisnessLogo from "../../assets/buisness_logo.png"
import scienceLogo from "../../assets/science_logo.png"
import { motion } from "framer-motion";

const AboutUsSection = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="w-full min-h-screen flex flex-col items-center bg-gray-50 py-10 gap-20"
    >
      {/* Section 1: RMUTL Info */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 items-center gap-8 px-6">
        {/* Left: RMUTL Logo */}
        <motion.div className="order-2 lg:order-1 flex justify-center items-center">
          <motion.img
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            src={rmutlLogo}
            alt="RMUTL Logo"
            className="w-32 h-auto md:w-36 lg:w-48"
          />
        </motion.div>
        {/* Right: RMUTL Info */}
        <motion.div className="order-1 md:order-2 text-gray-700 text-base lg:text-lg leading-relaxed">
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-3xl lg:text-4xl font-semibold text-gray-800 mb-6"
          >
            มหาวิทยาลัยเทคโนโลยีราชมงคลล้านนา
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            มหาวิทยาลัยเทคโนโลยีราชมงคลล้านนา (RMUTL)
            เป็นสถาบันอุดมศึกษาที่ตั้งอยู่ในเขตภาคเหนือตอนบน
            สถาปนามาจากวิทยาลัยเทคโนโลยีและอาชีวศึกษา
            ทางมหาวิทยาลัยมุ่งผลิตบัณฑิตนักปฏิบัติ
            ให้มีความเชี่ยวชาญทางด้านวิชาชีพ
            ใช้วิทยาศาสตร์และเทคโนโลยีเป็นพื้นฐาน พัฒนาห้องปฏิบัติการพื้นฐาน
            และศูนย์ความเชี่ยวชาญเฉพาะทางด้านวิชาชีพ และการบูรณาการ
            การจัดการเรียนการสอนกับการปฏิบัติงานจริง
          </motion.p>
        </motion.div>
      </div>

      {/* Section 2: Plant Conservation Project */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 items-center gap-8 px-6 lg:px-20 mt-10">
        {/* Left: Project Info */}
        <motion.div className="order-1 text-gray-700 text-base lg:text-lg leading-relaxed">
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, dela: 0.2 }}
            viewport={{ once: true }}
            className="text-3xl lg:text-4xl font-semibold text-green-700 mb-6"
          >
            โครงการอนุรักษ์พันธุกรรมพืชอันเนื่องมาจากพระราชดำริ
            สมเด็จพระเทพรัตนราชสุดาฯ
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            โครงการอนุรักษ์พันธุกรรมพืชอันเนื่องมาจากพระราชดำริ
            สมเด็จพระเทพรัตนราชสุดาฯ สยามบรมราชกุมารี (อพ.สธ.)
            เป็นโครงการที่จัดตั้งขึ้นเมื่อปี พ.ศ. 2536
            โดยมีวัตถุประสงค์เพื่อสร้างความเข้าใจ
            และทำให้ตระหนักถึงความสำคัญของทรัพยากรต่าง ๆ ที่มีอยู่ในประเทศไทย
            ก่อให้เกิดกิจกรรมเพื่อให้มีการร่วมคิด
            ร่วมปฏิบัติที่นำผลประโยชน์มาถึงประชาชนชาวไทย
            ตลอดจนให้มีการจัดทำระบบข้อมูลทรัพยากร
            ให้แพร่หลายสามารถสื่อถึงกันได้ทั่วประเทศ
          </motion.p>
        </motion.div>
        {/* Right: Plant Logo */}
        <motion.div className="order-2 flex justify-center items-center">
          <motion.img
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            src={plantLogo}
            alt="Plant Conservation Logo"
            className="w-42 h-auto md:w-36 lg:w-48"
          />
        </motion.div>
      </div>

      {/* Section 3: About the Project */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 items-center gap-8 px-6 lg:px-20 mt-10">
        {/* Left: Project Images */}
        <motion.div className="order-2 lg:order-1 flex justify-center items-center ">
          <motion.img
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            src={engineerLogo}
            alt="ENGINEER Logo"
            className="w-24 h-auto md:w-32 lg:w-40"
          />
          <motion.img
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            src={buisnessLogo}
            alt="ENGINEER Logo"
            className="w-24 h-auto md:w-32 lg:w-40"
          />
          <motion.img
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            src={scienceLogo}
            alt="ENGINEER Logo"
            className="w-24 h-auto md:w-32 lg:w-40"
          />
        </motion.div>
        {/* Right: Project Info */}
        <motion.div className="order-1 md:order-2 text-gray-700 text-base lg:text-lg leading-relaxed">
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-3xl lg:text-4xl font-semibold text-blue-600 mb-6"
          >
            ระบบวิเคราะห์และจำแนกชิ้นมันพื้นบ้าน
            ด้วยการประมวลผลภาพและปัญญาประดิษฐ์
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            โครงงานนี้มีวัตถุประสงค์เพื่อพัฒนาระบบจำแนกพันธุ์ใบมันพื้นบ้านในภาคเหนือของประเทศไทย
            โดยใช้เทคนิคการประมวลผลภาพร่วมกับการเรียนรู้ของเครื่องและการเรียนรู้เชิงลึก
            ระบบสามารถวิเคราะห์ลักษณะของใบเพื่อจำแนกพันธุ์ได้อย่างแม่นยำและรวดเร็ว
            ลดการพึ่งพาผู้เชี่ยวชาญ
            และเพิ่มประสิทธิภาพในการเลือกใช้พันธุ์พืชที่เหมาะสม
            ส่งเสริมการอนุรักษ์พันธุ์พื้นเมืองและความยั่งยืนทางการเกษตร
          </motion.p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AboutUsSection;
