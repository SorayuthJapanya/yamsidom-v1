import React from "react";
import toast from "react-hot-toast";
import CropperLib from "react-cropper";
import "cropperjs/dist/cropper.css";

const CropperImage = ({
  currentCropIndex,
  cropImageSrc,
  cropperRef,
  setCurrentCropIndex,
  images,
  setImages,
  onClose,
  formData,
  setFormData,
}) => {
  const applyCropping = async () => {
    if (currentCropIndex === null) return;

    try {
      const cropper = cropperRef.current?.cropper;
      if (!cropper) {
        toast.error("Cropper not initialized");
        return;
      }

      // ได้รูปที่ถูก crop เป็น Data URL
      const croppedCanvas = cropper.getCroppedCanvas({
        width: 300,
        height: 300,
        fillColor: "#fff",
      });

      // เพิ่มการตรวจสอบว่าได้ canvas มาแล้ว
      if (!croppedCanvas) {
        toast.error("Failed to get cropped canvas. Please try cropping again.");
        return;
      }

      const croppedBase64 = croppedCanvas.toDataURL();

      const res = await fetch(croppedBase64);
      const blob = await res.blob();
      const file = new File([blob], `cropped-${Date.now()}.png`, {
        type: "image/png",
      });

      const updatedImages = [...images];
      updatedImages[currentCropIndex] = {
        ...updatedImages[currentCropIndex],
        preview: croppedBase64,
        file: file,
      };
      setImages(updatedImages);

      const updatedFormData = [...formData];
      updatedFormData[currentCropIndex] = {
        ...updatedFormData[currentCropIndex],
        isCropped: true,
      };
      setFormData(updatedFormData);

      setCurrentCropIndex(null);
      toast.success("ครอปรูปเสร็จสิ้น");
      onClose();
    } catch (error) {
      console.error("Error applying crop:", error);
      toast.error("ครอปรูปล้มเหลว");
    }
  };

  if (currentCropIndex === null || !cropImageSrc) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black/80 flex items-center justify-center z-100">
      <div className="bg-white p-6 rounded-xl w-[90%] max-w-2xl">
        <CropperLib
          src={cropImageSrc}
          style={{ height: 400, width: "100%" }}
          aspectRatio={1}
          guides={true}
          ref={cropperRef}
          viewMode={0}
          dragMode="none"
          autoCropArea={0.7}
          background={false}
          responsive={true}
        />

        <div className="flex justify-end mt-4 gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 cursor-pointer transitaion-all ease-in-out transform hover:-translate-y-1 duration-300"
          >
            ยกเลิก
          </button>
          <button
            type="button"
            onClick={applyCropping}
            className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 cursor-pointer transitaion-all ease-in-out transform hover:-translate-y-1 duration-300"
          >
            ครอป
          </button>
        </div>
      </div>
    </div>
  );
};

export default CropperImage;
