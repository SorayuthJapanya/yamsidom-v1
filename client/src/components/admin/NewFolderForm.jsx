import { useAddNewFolder } from "@/api/ImagesApi";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const NewFolderForm = ({
  isNewFolderOpen,
  setIsNewFolderOpen,
  newFolderRef,
}) => {
  const [folderName, setfolderName] = useState("");

  const { mutate: addNewFolder } = useAddNewFolder({ setIsNewFolderOpen });

  const handleSubmitNewFolder = (e) => {
    e.preventDefault();
    addNewFolder({ folderName });
  };
  return (
    <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-100 p-4">
      <AnimatePresence>
        {isNewFolderOpen && (
          <motion.form
            ref={newFolderRef}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.3 }}
            onSubmit={handleSubmitNewFolder}
            className="bg-white p-4 border border-blue-700 rounded-xl flex flex-col gap-4 shadow-lg"
          >
            <p className="text-xl font-normal text-gray-800">โฟลเดอร์ใหม่</p>
            <div className="w-72 md:w-80">
              <input
                type="text"
                placeholder="โฟลเดอร์ไม่มีชื่อ"
                onChange={(e) => setfolderName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 outline-none"
              />
            </div>
            <p className="p-3 text-sm text-blue-800 bg-blue-50 border border-blue-100 rounded-lg">
              หมายเหตุ: ชื่อโฟลเดอร์ต้องตรงกับชื่อสายพันธุ์ที่อยู่ในระบบ
            </p>
            <div className="flex items-center gap-2 justify-end">
              <button
                onClick={() => setIsNewFolderOpen(false)}
                className="px-3 py-2 rounded-full hover:bg-blue-50 text-blue-600 font-medium text-sm md:text-base cursor-pointer"
              >
                ยกเลิก
              </button>
              <button className="px-3 py-2 rounded-full hover:bg-blue-50 text-blue-600 font-medium text-sm md:text-base cursor-pointer">
                สร้าง
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NewFolderForm;
