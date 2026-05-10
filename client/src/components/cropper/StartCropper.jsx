import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import CropperImage from "./CropperImage";

const StartCropper = ({
  index,
  images,
  setImages,
  onClose,
  formData,
  setFormData,
}) => {
  const [currentCropIndex, setCurrentCropIndex] = useState(null);
  const [cropImageSrc, setCropImageSrc] = useState("");
  const cropperRef = useRef();

  useEffect(() => {
    const image = images[index];
    if (!image?.preview) {
      toast.error("No image available for cropping");
      onClose();
      return;
    }

    const img = new Image();
    img.src = image.preview;

    img.onload = () => {
      const padding = 20;
      const canvas = document.createElement("canvas");
      canvas.width = img.width + padding * 2;
      canvas.height = img.height + padding * 2;

      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, padding, padding);

      const paddedDataUrl = canvas.toDataURL();
      setCropImageSrc(paddedDataUrl);
      setCurrentCropIndex(index);
    };

    img.onerror = () => {
      toast.error("Failed to load image");
      onClose();
    };
  }, [index, images, onClose]);

  return (
    <CropperImage
      currentCropIndex={currentCropIndex}
      cropImageSrc={cropImageSrc}
      cropperRef={cropperRef}
      setCurrentCropIndex={setCurrentCropIndex}
      images={images}
      setImages={setImages}
      onClose={onClose}
      formData={formData}
      setFormData={setFormData}
    />
  );
};

export default StartCropper;
