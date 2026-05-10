import React, { useEffect, useState } from "react";
import { useGetSpeciesById } from "../api/SpeciesApi";
import { X } from "lucide-react";

const ViewInfoSpecie = ({ specie_id, setIsInfoOpen }) => {
  const [species, setSpecies] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const {
    data: SpecieData,
    isLoading,
    error,
  } = useGetSpeciesById({ specie_id: specie_id });

  const handleClickImage = (imageUrl) => {
    setPreviewImage(imageUrl);
  };

  const handleClosePreview = () => {
    setPreviewImage(null);
  };

  useEffect(() => {
    if (SpecieData) {
      setSpecies(SpecieData);
    }
  }, [SpecieData]);

  if (isLoading) {
    return <p>กำลังโหลด...</p>;
  }

  if (error) {
    return <p className="text-red-500">การดึงข้อมูลสายพันธุ์ล้มเหลว</p>;
  }

  if (!species) {
    return <p>ไม่พบข้อมูลของสายพันธุ์นี้</p>;
  }

  return (
    <div onClick={() => setIsInfoOpen(false)} className="fixed inset-0 bg-black/40 flex justify-center items-center z-100 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-sm sm:max-w-2xl md:max-w-lg max-h-[80vh] overflow-y-auto ">
        <div className="flex flex-col relative w-full">
          <div className="flex justify-end w-full sticky z-20 top-0 pt-4 pr-4 bg-white">
            <div
              onClick={() => setIsInfoOpen(false)}
              className="w-max p-1 md:p-1.5 bg-gray-400 text-white rounded-full hover:bg-gray-500 duration-300 cursor-pointer transition-all ease-in-out hover:-translate-y-1"
            >
              <X />
            </div>
          </div>

          <div className="mt-2 px-6">
            {/* Image Section */}
            <div className="flex flex-col items-center justify-center">
              <div
                onClick={() =>
                  handleClickImage(
                    species.imageUrl
                      ? `${import.meta.env.VITE_SERVER_URL}/uploads/species/${
                          species.imageUrl
                        }`
                      : "/leaf.png"
                  )
                }
                className="w-70 h-full mb-4 relative px-4 transition duration-200"
              >
                <img
                  src={
                    species.imageUrl
                      ? `${import.meta.env.VITE_SERVER_URL}/uploads/species/${
                          species.imageUrl
                        }`
                      : "/leaf.png"
                  }
                  alt={species.scientificName}
                  className="w-full h-full object-repeat object-cover object-center rounded-md mb-4 hover:cursor-pointer"
                />
              </div>
              <h1 className="text-xl md:text-2xl font-medium">
                {species.commonName}
              </h1>
            </div>

            <div className="space-y-6 my-4">
              {/* Basic Information Card */}
              {(species.localName ||
                species.scientificName ||
                species.familyName) && (
                <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                  <h2 className="text-base md:text-lg font-semibold text-gray-700 mb-4 border-b pb-2">
                    ข้อมูลพื้นฐาน
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {species.localName && (
                      <div className="flex flex-col">
                        <span className="text-xs md:text-sm text-gray-500">
                          ชื่อท้องถิ่น
                        </span>
                        <span className="text-base md:text-lg">
                          {species.localName || "-"}
                        </span>
                      </div>
                    )}
                    {species.scientificName && (
                      <div className="flex flex-col">
                        <span className="text-xs md:text-sm text-gray-500">
                          ชื่อวิทยาศาสตร์
                        </span>
                        <span className="text-base md:text-lg">
                          {species.scientificName || "-"}
                        </span>
                      </div>
                    )}
                    {species.familyName && (
                      <div className="flex flex-col">
                        <span className="text-xs md:text-sm text-gray-500">
                          วงศ์
                        </span>
                        <span className="text-base md:text-lg">
                          {species.familyName || "-"}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Botanical Characteristics Card */}
              {species.description && (
                <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                  <h2 className="text-sm md:text-base font-semibold text-gray-700 mb-4 border-b pb-2">
                    ลักษณะทางพฤกษศาสตร์
                  </h2>
                  <p className="text-gray-700 whitespace-pre-line text-base">
                    {species.description || "ไม่มีข้อมูล"}
                  </p>
                </div>
              )}

              {/* Propagation Card */}
              {species.propagation && (
                <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                  <h2 className="text-sm md:text-base font-semibold text-gray-700 mb-4 border-b pb-2">
                    การขยายพันธุ์
                  </h2>
                  <p className="text-gray-700 whitespace-pre-line text-base md:text-lg">
                    {species.propagation || "ไม่มีข้อมูล"}
                  </p>
                </div>
              )}

              {/* Seasons Card */}
              {(species.plantingseason || species.harvestingseason) && (
                <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                  <h2 className="text-sm md:text-base font-semibold text-gray-700 mb-4 border-b pb-2">
                    ฤดูกาลปลูกและเก็บเกี่ยว
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {species.plantingseason && (
                      <div className="flex flex-col">
                        <span className="text-xs md:text-sm text-gray-500">
                          ปลูกช่วง
                        </span>
                        <span className="text-base md:text-lg">
                          {species.plantingseason || "ไม่มีข้อมูล"}
                        </span>
                      </div>
                    )}
                    {species.harvestingseason && (
                      <div className="flex flex-col">
                        <span className="text-xs md:text-sm text-gray-500">
                          เก็บเกี่ยวช่วง
                        </span>
                        <span className="text-base md:text-lg">
                          {species.harvestingseason || "ไม่มีข้อมูล"}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Utilization Card */}
              {species.utilization && (
                <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                  <h2 className="text-sm md:text-base font-semibold text-gray-700 mb-4 border-b pb-2">
                    การใช้ประโยชน์
                  </h2>
                  <p className="text-gray-700 whitespace-pre-line text-base md:text-lg">
                    {species.utilization || "ไม่มีข้อมูล"}
                  </p>
                </div>
              )}

              {/* Market and Status Card */}
              {species.status && (
                <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                  <h2 className="text-sm md:text-base font-semibold text-gray-700 mb-4 border-b pb-2">
                    สถานภาพ
                  </h2>
                  <p className="text-gray-700 whitespace-pre-line text-base md:text-lg">
                    {species.status || "ไม่มีข้อมูล"}
                  </p>
                </div>
              )}

              {/* Survey Sites Card */}
              {species.surveysite && (
                <div className="bg-gray-50 p-4 rounded-lg shadow-sm mb-3">
                  <h2 className="text-sm md:text-base font-semibold text-gray-700 mb-4 border-b pb-2">
                    แหล่งที่สำรวจ
                  </h2>
                  <p className="text-gray-700 whitespace-pre-line text-base md:text-lg">
                    {species.surveysite || "ไม่มีข้อมูล"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Image Preview Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 bg-black/75 flex items-center justify-center z-100"
          onClick={handleClosePreview}
        >
          <div className="relative p-6" onClick={(e) => e.stopPropagation()}>
            <img
              src={previewImage}
              alt="Preview"
              className="max-w-full max-h-80 rounded-lg"
            />
            <button
              onClick={handleClosePreview}
              className="absolute top-2 right-2 text-white bg-gray-500 rounded-full p-1.5 hover:bg-gray-700 cursor-pointer transition-all duration-200"
            >
              <X />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewInfoSpecie;
