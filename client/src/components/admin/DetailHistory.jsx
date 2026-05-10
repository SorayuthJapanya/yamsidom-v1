import { MapPin, X } from "lucide-react";

const DetailHistory = ({
  isOpenInfo,
  selectedClassifier,
  setIsOpenInfo,
  setSelectedClassifier,
}) => {
  const parseExifDate = (exifString) => {
    if (!exifString || typeof exifString !== "string") {
      return null;
    }

    // ถ้า string มี format EXIF จริง ๆ แบบ "YYYY:MM:DD HH:MM:SS"
    if (exifString.includes(" ")) {
      const [datePart, timePart] = exifString.split(" ");
      if (datePart.includes(":")) {
        try {
          const [year, month, day] = datePart.split(":");
          const [hours, minutes, seconds] = timePart.split(":");
          return new Date(year, month - 1, day, hours, minutes, seconds);
        } catch (error) {
          console.error("Invalid EXIF date format:", exifString, error);
          return null;
        }
      }
    }

    // ถ้าไม่ใช่ format EXIF ก็ลองแปลงเป็น Date ปกติ
    const parsedDate = new Date(exifString);
    return isNaN(parsedDate) ? null : parsedDate;
  };

  const handleOpenMap = (latitude, longitude) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    window.open(url, "_blank");
  };

  return (
    <>
      {isOpenInfo && selectedClassifier && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-100 p-4">
          {/* Main Card */}
          <div className="bg-white rounded-lg shadow-lg w-full max-w-sm sm:max-w-2xl md:max-w-6xl max-h-[80vh] overflow-y-auto flex flex-col">
            {/* Header Section */}
            <div className="sticky top-0 bg-white z-10 p-6 border-b flex justify-between items-center">
              <h2 className="text-lg md:text-xl font-bold text-blue-700">
                รายละเอียดการจำแนก
              </h2>
              <button
                onClick={() => {
                  setIsOpenInfo(false);
                  setSelectedClassifier(null);
                }}
                className="p-1.5 bg-gray-200 hover:bg-gray-300 rounded-full transition-colors duration-200 cursor-pointer"
                aria-label="Close"
              >
                <X className="size-4 sm:size-5 text-gray-600" />
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column - Image Preview */}
                <div className="space-y-4">
                  <div className="overflow-hidden">
                    <img
                      src={`${import.meta.env.VITE_SERVER_URL}/uploads/${
                        selectedClassifier.imageUrl
                      }`}
                      alt={selectedClassifier.bestSecondLayer}
                      className="w-full h-auto max-h-[200px] sm:max-h-[400px] object-contain"
                    />
                  </div>

                  {/* Image Metadata */}
                  <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                    <h3 className="font-medium text-sm sm:text-base text-gray-800">
                      ข้อมูลภาพ
                    </h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-gray-500 text-sm">ชื่อ</p>
                        <p className="text-base">
                          {selectedClassifier.userName}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">เวลาที่ถ่ายภาพ</p>
                        <p className="text-base">
                          <span>
                            {(() => {
                              const exifDate = parseExifDate(
                                selectedClassifier.datetime_taken
                              );
                              const createdDate = selectedClassifier.createdAt
                                ? new Date(selectedClassifier.createdAt)
                                : null;
                              const dateToShow = exifDate ?? createdDate;
                              return dateToShow
                                ? dateToShow.toLocaleString("th-TH", {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })
                                : "-";
                            })()}
                          </span>
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">เวลาในการจำแนก</p>
                        <p className="text-base">
                          {selectedClassifier.process_time > 1000
                            ? `${(
                                selectedClassifier.process_time / 1000
                              ).toFixed(2)} วินาที`
                            : `${selectedClassifier.process_time} มิลลิวินาที`}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Location (Conditional) */}
                  {selectedClassifier.latitude &&
                    selectedClassifier.longitude && (
                      <div className="bg-gray-50 rounded-lg overflow-hidden">
                        <h3 className="font-medium text-sm sm:text-base p-4 bg-gray-50">
                          สถานที่
                        </h3>
                        <div className="p-4 flex justify-between items-center text-sm">
                          <div>
                            <p className="text-gray-600">
                              ละติจูด: {selectedClassifier.latitude}
                            </p>
                            <p className="text-gray-600">
                              ลองจิจูก: {selectedClassifier.longitude}
                            </p>
                          </div>
                          <button
                            onClick={() =>
                              handleOpenMap(
                                selectedClassifier.latitude,
                                selectedClassifier.longitude
                              )
                            }
                            className="flex items-center gap-2 bg-blue-50 text-blue-600 hover:bg-blue-100 px-4 py-2 rounded-lg transition-all duraiton-200 cursor-pointer "
                          >
                            <MapPin className="w-5 h-5" />
                            Google Maps
                          </button>
                        </div>
                      </div>
                    )}
                </div>

                {/* Middle Column - Prediction Results */}
                <div className="space-y-6">
                  {/* Best Prediction Card */}
                  <div className="bg-blue-50 p-5 rounded-lg border border-indigo-100">
                    <h3 className="font-medium text-sm sm:text-base text-blue-700 mb-3">
                      ผลการจำแนกสายพันธุ์จากลักษณะใบ
                    </h3>
                    <div className="flex items-center justify-between text-sm sm:text-base">
                      <div>
                        <p className="text-xl font-bold text-blue-700">
                          {selectedClassifier.bestFirstLayer}
                        </p>
                      </div>
                    </div>
                  </div>
                  {/* Right Column - Filter Prediction Results */}
                  <div className="space-y-6">
                    {/* Best Prediction Card */}
                    <div className="bg-indigo-50 p-5 rounded-lg border border-indigo-100">
                      <h3 className="font-medium text-sm sm:text-base text-blue-700 mb-3">
                        ผลการจำแนกสายพันธุ์ที่ดีที่สุด
                      </h3>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xl font-bold text-indigo-700">
                            {selectedClassifier.bestSecondLayer}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* All Predictions */}
                    <div className="bg-white rounded-lg overflow-hidden">
                      <h3 className="font-medium text-sm sm:text-base text-blue-700 p-4 bg-gray-50">
                        ผลการจำแนกสายพันธุ์ทั้งหมด
                      </h3>
                      <div className="text-sm sm:text-base">
                        {selectedClassifier.secondLayer.map(
                          (prediction, idx) => (
                            <div
                              key={idx}
                              className={`flex justify-between items-center p-3 ${
                                idx < 3 ? "bg-blue-50" : "bg-gray-50"
                              }`}
                            >
                              <div className="flex items-center">
                                <span className="font-medium mr-2 text-blue-600">
                                  {idx + 1}.
                                </span>
                                <span>{prediction.class}</span>
                                <span>{prediction.probability}</span> %
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DetailHistory;
