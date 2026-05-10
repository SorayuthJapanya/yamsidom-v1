import React, { useRef, useState } from "react";
import { useUpload } from "../context/UploadContext";
import { useNavigate } from "react-router-dom";
import {useAuthUser} from "../api/AuthApi"
import toast from "react-hot-toast";

const InputImg = () => {
  const fileInputRef = useRef();
  const [isDragging, setIsDragging] = useState(false);
  const [filesList, setFilesList] = useState([]);

  const { setImages } = useUpload();
  const navigate = useNavigate();

  const {data: authUser} = useAuthUser()

  const validTypes = ["image/jpg", "image/jpeg"];

  const addFilesToList = (newFiles) => {
    if (!authUser) {
      toast.error("กรุณาเข้าสู่ระบบก่อน");
      navigate("/login");
      return;
    }

    try {
      const filesArray = Array.from(newFiles);

      // filter before keepfile
      const existingNames = new Set(filesList.map((file) => file.name));
      const filteredFiles = filesArray.filter(
        (file) =>
          validTypes.includes(file.type) && !existingNames.has(file.name)
      );

      if (filteredFiles.length === 0) {
        toast.error("No valid new files to add");
        return;
      }

      // Generate preview URLs & keep file
      const newImageObjects = filteredFiles.map((file) => ({
        file: file,
        preview: URL.createObjectURL(file),
      }));

      setImages((prevImages) => [...prevImages, ...newImageObjects]);
      setFilesList((prevFiles) => [...prevFiles, ...filteredFiles]);

      navigate("/preview");
    } catch (error) {
      console.log("Error adding file", error);
      toast.error("Failed to add files");
    }
  };

  // Click input file hidden when click button
  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  // when choose file
  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    addFilesToList(newFiles);
  };

  // Dragging file
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  // Leave Dradding file
  const handleDragLeave = () => {
    setIsDragging(false);
  };

  // When drop file
  const handleDropFile = (e) => {
    e.preventDefault();
    setIsDragging(false);
    addFilesToList(e.dataTransfer.files);
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDropFile}
      className={`size-70 md:size-80  ${
        isDragging ? "bg-blue-100 border-2 border-blue-400" : "bg-white/20"
      } flex flex-col justify-center items-center rounded-4xl shadow-[0px_0px_59px_-16px_rgba(0,_0,_0,_0.8)]`}
    >
      <div className="w-full h-full flex justify-center flex-col items-center">
        <button
          type="button"
          onClick={handleButtonClick}
          className="text-center px-14 py-3 md:px-20 hover:bg-blue-700 active:bg-blue-900 cursor-pointer duration-200 bg-blue-500 text-white rounded-full font-semibold transition-all ease-in-out hover:-translate-y-1"
        >
          อัปโหลดรูปภาพ
        </button>
        <p className="text-sm mt-2 text-gray-500">
          หรือวางไฟล์ใดๆ ก็ได้ jpg, jpeg เท่านั้น
        </p>
      </div>
      <input
        type="file"
        name="imges"
        id="images"
        multiple
        accept="image/jpg, image/jpeg"
        onChange={handleFileChange}
        ref={fileInputRef}
        className="hidden"
      />
    </div>
  );
};

export default InputImg;
