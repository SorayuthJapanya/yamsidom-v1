import { useAllClassification, useClassification } from "@/api/UploadApi";
import { useQueryClient } from "@tanstack/react-query";
import { Crop, Loader2, Trash2 } from "lucide-react";
import { forwardRef, useImperativeHandle, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import StartCropper from "../cropper/StartCropper";

const UploadImageForm = forwardRef(
  (
    {
      image,
      index,
      images,
      setImages,
      formData,
      setFormData,
      setTotalCount,
      setCompletedCount,
      setIsClassificationLoadingAll,
    },
    ref
  ) => {
    useImperativeHandle(ref, () => ({
      handleSubmitAllForm,
    }));

    const [isCropperOpen, setIsCropperOpen] = useState(false);
    const [isCropperLoading, setIsCropperLoading] = useState(false);

    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { mutate: classificationMutate, isPending: isClassificationPending } =
      useClassification({
        navigate,
        queryClient,
      });

    const { mutateAsync: allClassificationMutate } = useAllClassification({
      setCompletedCount,
    });

    const handleCropClick = (index) => {
      setIsCropperOpen(index);
      setIsCropperLoading(true);
    };

    const handleCropperClose = () => {
      setIsCropperOpen(null);
      setIsCropperLoading(false);
    };

    const handleSubmitHITL = async (index) => {
      if (!images[index]?.file) {
        toast.error("ไม่พบไฟล์รูปภาพ");
        return;
      }

      const result = await Swal.fire({
        title: "คุณแน่ใจหรือไม่?",
        text: "คุณต้องการส่งข้อมูลหรือไม่?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "ใช่, ส่งข้อมูล!",
        cancelButtonText: "ยกเลิก",
      });

      if (result.isConfirmed) {
        const payLoad = new FormData();
        payLoad.append("image", images[index].file);

        Object.entries(formData[index]).forEach(([key, value]) => {
          payLoad.append(key, value);
        });

        classificationMutate(payLoad, {
          onSuccess: () => {
            setImages((prev) => prev.filter((_, i) => i !== index));
            setFormData((prev) => prev.filter((_, i) => i !== index));
            navigate("/history");
          },
        });
      }
    };

    const handleSubmitAllForm = async () => {
      if (images.length === 0) {
        toast.error("ไม่พบไฟล์รูปภาพ");
        return;
      }

      if (images.length > 30) {
        toast.error("จำกัดการอัปโหลดต่อครั้ง 30 ภาพ");
        return;
      }

      const result = await Swal.fire({
        title: "คุณแน่ใจหรือไม่?",
        text: "คุณต้องการส่งข้อมูลทั้งหมดหรือไม่?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "ใช่, ส่งข้อมูล!",
        cancelButtonText: "ยกเลิก",
      });

      if (!result.isConfirmed) return;

      let successCount = 0;

      try {
        setTotalCount(images?.length);
        setCompletedCount(0);
        setIsClassificationLoadingAll(true);

        for (let i = 0; i < images.length; i++) {
          const payLoad = new FormData();
          payLoad.append("image", images[i].file);

          Object.entries(formData[i] || {}).forEach(([key, value]) => {
            payLoad.append(key, value || "No data");
          });

          await allClassificationMutate({
            data: payLoad,
            currentIndex: i,
            totalFiles: images.length,
          });
          successCount++;
        }

        toast.success(`อัปโหลดทั้งหมด ${successCount} รูปภาพเสร็จสิ้น`);
        setImages([]);
        setFormData([]);
        navigate("/history");
      } catch (error) {
        console.error("Upload process error:", error);
        toast.error("เกิดข้อผิดพลาดในระบบ");
      } finally {
        setIsClassificationLoadingAll(false);
      }
    };

    const handleDeleteForm = async (index) => {
      const result = await Swal.fire({
        title: "คุณแน่ใจหรือไม่?",
        text: "คุณต้องการลบข้อมูลหรือไม่?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "ใช่, ฉันต้องการ!",
        cancelButtonText: "ยกเลิก",
      });

      if (result.isConfirmed) {
        setImages(images.filter((_, i) => i !== index));
        setFormData(formData.filter((_, i) => i !== index));
      }
    };

    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleSubmitHITL(index);
        }}
        className="flex flex-col items-center justify-center w-full h-full"
      >
        <div className="flex flex-col items-center justify-center sm:gap-4">
          {isCropperLoading && isCropperOpen === index ? (
            <div className="flex items-center justify-center">
              <Loader2 className="size-5 animate-spin" />
            </div>
          ) : (
            <>
              {isClassificationPending ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="size-5 animate-spin" />
                </div>
              ) : (
                <div className="p-4 flex flex-col items-center justify-center gap-4">
                  <img
                    src={image.preview}
                    alt={`preview-${index}`}
                    className="w-80 h-80 rounded-xl object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="flex flex-col justify-center items-center gap-2 w-full">
                    <div className="flex flex-col items-center gap-2 px-4">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCropClick(index);
                        }}
                        className="text-blue-700 flex items-center transform hover:-translate-y-0.5 bg-blue-100 border border-blue-300 hover:bg-blue-200 duration-200  cursor-pointer px-3 py-2 rounded-xl shadow-xl"
                      >
                        <label className="flex flex-col items-center cursor-pointer w-max md:w-full text-sm">
                          <p className="flex items-center gap-1">
                            <Crop className="w-4 h-4 mr-1" /> ครอบตัดภาพ
                          </p>
                        </label>
                      </button>
                      <p className="text-sm text-blue-500 text-center mt-2">
                        หมายเหตุ:
                        กรุณาครอบตัดภาพเป็นสี่เหลี่ยมจัตุรัสเพื่อความแม่นยำในการทำนายสายพันธุ์
                      </p>
                    </div>

                    <div className="w-full h-full flex justify-center items-center gap-4 mt-2">
                      <button
                        type="submit"
                        className={`py-3 w-full rounded-full text-white font-medium text-md cursor-pointer transition-all duration-300 ${
                          isClassificationPending
                            ? "bg-blue-400 cursor-not-allowed"
                            : "bg-blue-500 hover:bg-blue-600 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                        }`}
                        disabled={isClassificationPending}
                      >
                        {isClassificationPending ? (
                          <div className="flex items-center justify-center">
                            <Loader2 className="size-5 animate-spin duration-200 mr-2" />
                            <span>กำลังประมวลผล...</span>
                          </div>
                        ) : (
                          "อัปโหลด"
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteForm(index)}
                        className="text-white bg-red-500 p-3 rounded-full cursor-pointer hover:bg-red-600 duration-200 transform hover:-translate-y-0.5 active:bg-red-800"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {isCropperOpen === index && (
            <StartCropper
              index={index}
              images={images}
              setImages={setImages}
              onClose={handleCropperClose}
              formData={formData}
              setFormData={setFormData}
            />
          )}
        </div>
      </form>
    );
  }
);

export default UploadImageForm;
