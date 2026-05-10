import {
  useAddNewImage,
  useDeleteFolder,
  useGetFolderName,
} from "@/api/ImagesApi";
import FolderNameSearch from "@/components/search/FolderNameSearch";
import {
  EllipsisVertical,
  Folder,
  Loader2,
  Trash2,
  UploadCloud,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import NewFolderForm from "../NewFolderForm";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const FolderCard = () => {
  const [folderName, setfolderName] = useState([]);
  const [folderCount, setfolderCount] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [selectedFolder, setSelectedFolder] = useState("");
  const [isSearch, setIsSearch] = useState(false);
  const [isNewFolderOpen, setIsNewFolderOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(null);
  const newFolderRef = useRef();
  const menuRef = useRef();

  const navigate = useNavigate();

  const { data: getFolderName } = useGetFolderName({ selectedFolder });
  const { mutate: deleteFolder } = useDeleteFolder({ setIsNewFolderOpen });
  const { mutate: addImages, isPending } = useAddNewImage();

  const handleReset = () => {
    setInputValue("");
    setSelectedFolder("");
    setIsSearch(false);
  };

  const handleImagesChange = async (event, index, folderName) => {
    const files = Array.from(event.target.files);

    if (files.length >= 100) {
      setIsMenuOpen(null);
      return toast.error("กรุณาอัปโหลดไฟล์ภาพไม่เกิน 100 ไฟล์");
    }

    if (files.length > 0) {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("images", file);
      });
      try {
        addImages({ folderName, formData });
        setIsMenuOpen(null);
      } catch (error) {
        setIsMenuOpen(null);
        toast.error(
          error?.response?.data?.message || "เกิดข้อผิดพลาดในการอัปโหลดไฟล์"
        );
      }
    }
  };

  const handleDeleteFolder = async (folderName) => {
    const result = await Swal.fire({
      title: "คุณแน่ใจหรือไม่?",
      text: "คุณต้องการลบโฟลเดอร์นี้หรือไม่?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "ใช่, ฉันต้องการ!",
      cancelButtonText: "ยกเลิก",
    });
    if (result.isConfirmed) {
      await deleteFolder({ folderName });
    }
  };

  const handleClickFolder = (folderName) => {
    navigate(`/admin/manage-gallery/${folderName}`);
  };

  const handleNewFolderClickOutside = (event) => {
    if (event.defaultPrevented) return;

    setTimeout(() => {
      if (
        newFolderRef.current &&
        !newFolderRef.current.contains(event.target)
      ) {
        setIsNewFolderOpen(false);
      }
    }, 300);
  };

  const handleMenuClickOutside = (event) => {
    if (event.defaultPrevented) return;

    setTimeout(() => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(null);
      }
    }, 300);
  };

  useEffect(() => {
    if (getFolderName) {
      setfolderName(getFolderName.folders);
      setfolderCount(getFolderName.folderCount);
    }
  }, [getFolderName]);

  useEffect(() => {
    if (isNewFolderOpen) {
      document.addEventListener("mousedown", handleNewFolderClickOutside);
    } else {
      document.removeEventListener("mousedown", handleNewFolderClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleNewFolderClickOutside);
    };
  }, [isNewFolderOpen]);

  useEffect(() => {
    if (isMenuOpen !== null) {
      document.addEventListener("mousedown", handleMenuClickOutside);
    } else {
      document.removeEventListener("mousedown", handleMenuClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleMenuClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-gray-500 text-xs md:text-sm">
          ทั้งหมด {folderCount} โฟลเดอร์
        </p>
        <div className="flex items-center gap-2">
          <FolderNameSearch
            onLocalNameSelected={(folderName) => {
              setSelectedFolder(folderName);
              setIsSearch(true);
            }}
            inputValue={inputValue}
            setInputValue={setInputValue}
          />
          {isSearch && (
            <button
              onClick={handleReset}
              className="w-max text-xs md:text-sm px-3 py-1.5 md:px-4 md:py-2 text-white bg-gray-400 hover:bg-gray-500 rounded-md cursor-pointer transition-all ease-in-out hover:-translate-y-1 duration-300"
            >
              รีเซ็ท
            </button>
          )}
          <button
            onClick={() => setIsNewFolderOpen(true)}
            className="w-max text-xs md:text-sm px-3 py-1.5 sm:px-4 sm:py-2 text-white bg-blue-500 hover:bg-blue-700 rounded-md cursor-pointer transition-all ease-in-out hover:-translate-y-1 duration-300"
          >
            เพิ่มโฟลเดอร์
          </button>
        </div>
      </div>
      {isPending ? (
        <div className="flex flex-col gap-2 items-center justify-center py-6">
          <Loader2 className="size-8 animate-spin text-gray-500" />
          <p className="text-gray-500">กำลังอัปโหลดภาพ</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 xl:gird-cols-5 gap-4">
          {folderName.map((item, index) => (
            <div
              key={index}
              onClick={() => handleClickFolder(item.name)}
              className="w-full pt-4 bg-white border border-gray-200 rounded-xl shadow-md hover:scale-105 transition-all transform cursor-pointer duration-300"
            >
              <div className="w-full flex flex-col items-start justify-center px-4">
                <div className="relative w-full flex items-center justify-between mb-6">
                  <Folder className="text-blue-400 fill-blue-300 size-8" />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsMenuOpen(index);
                    }}
                    className="p-1.5 rounded-full hover:bg-gray-200 duration-300 cursor-pointer"
                  >
                    <EllipsisVertical className="text-gray-400 size-5" />
                  </button>
                  <AnimatePresence>
                    {isMenuOpen === index && (
                      <motion.div
                        ref={menuRef}
                        initial={{ scale: 0.8, opacity: 0, y: -20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.8, opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-8 right-3 bg-white border rounded-sm shadow-md py-2 min-w-20"
                      >
                        <label
                          onClick={(e) => e.stopPropagation()}
                          htmlFor="images"
                          className="flex items-center justify-between gap-2 w-full px-2 hover:bg-gray-100 duration-300"
                        >
                          <UploadCloud className="text-gray-600 size-4" />
                          <p className="text-xs sm:text-sm cursor-pointer px-2 py-1 rounded text-gray-600">
                            เพิ่มรูปภาพ
                          </p>
                          <input
                            type="file"
                            name="images"
                            id="images"
                            hidden
                            multiple
                            accept="image/*"
                            onChange={(e) => {
                              handleImagesChange(e, index, item.name);
                            }}
                          />
                        </label>
                        <div
                          onClick={(e) => {
                            e.stopPropagation(), handleDeleteFolder(item.name);
                          }}
                          className="flex items-center justify-between gap-2 w-full px-2 hover:bg-gray-100 duration-300"
                        >
                          <Trash2 className="text-gray-600 size-4" />
                          <p className="text-xs sm:text-sm cursor-pointer px-2 py-1 rounded text-gray-600">
                            ลบโฟลเดอร์
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <p className="text-sm md:text-base text-blue-600 font-bold">
                  {item.name}
                </p>
                <p className="text-xs md:text-sm text-gray-500">
                  {item.fileCount} รูป
                </p>
              </div>
              <div className="flex items-center gap-2 mt-4 bg-gray-100 w-full p-4 rounded-b-xl">
                <p className="text-gray-500 text-xs md:text-sm">
                  {item.sizeMB}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {isNewFolderOpen && (
        <NewFolderForm
          isNewFolderOpen={isNewFolderOpen}
          setIsNewFolderOpen={setIsNewFolderOpen}
          newFolderRef={newFolderRef}
        />
      )}
    </div>
  );
};

export default FolderCard;
