import { Eye, Loader2, MapPin } from "lucide-react";
import Pagination from "../../Pagination";

const TableClassifiredHistory = ({
  allClassifier,
  selectedHistories,
  historySelectedAction,
  setShowSelectedData,
  setSelectedClassifier,
  setIsOpenInfo,
  setCurrentPage,
  Classifier,
  setSelectedHistories,
  isPending,
}) => {
  const handleOpenMap = (latitude, longitude) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    window.open(url, "_blank");
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleCheckBoxSelecedHistoryChange = (id) => {
    setSelectedHistories((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((item) => item !== id)
        : [...prevSelected, id]
    );
  };

  return (
    <div className="w-full">
      {/* Table */}
      {isPending ? (
        <div className="w-full flex items-center justify-center my-10">
          <Loader2 className="size-5 animate-spin" />
        </div>
      ) : (
        <>
          {!allClassifier || allClassifier.length === 0 ? (
            <div className="w-full flex items-center justify-center my-10">
              <p className="text-md text-red-500">ไม่พบประวัติการจำแนก</p>
            </div>
          ) : (
            <div className="w-full">
              <table className="w-full">
                <thead className="text-center">
                  <tr className="hover:bg-gray-100 border-b-2 font-medium text-gray-700 border-gray-300 text-xs sm:text-sm ">
                    <td
                      className={`px-4 py-2 ${
                        historySelectedAction ? "sm:hidden" : "hidden"
                      }`}
                    >
                      เลือก
                    </td>
                    <td className="px-4 py-2">ชื่อผู้ใช้</td>
                    <td className="px-4 py-2">รูป</td>
                    <td className="px-4 py-2">ผลการทำนาย</td>
                    <td className="px-4 py-2">ความมั่นใจ</td>
                    <td className="px-4 py-2">ผลการทำนาย 5 อันดับแรก</td>
                    <td className="px-4 py-2">เวลาที่ใช้ในการทำนาย</td>
                    <td className="px-4 py-2">เวลาที่ทำการจำแนก</td>
                    <td className="text-center px-4 py-2">การดำเนินการ</td>
                  </tr>
                </thead>
                <tbody className="text-center">
                  {allClassifier
                    .sort(
                      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                    )
                    .map((classifier, index) => {
                      const isSelected = selectedHistories.includes(
                        classifier._id
                      );

                      return (
                        <tr
                          key={classifier._id}
                          onClick={() => {
                            if (historySelectedAction) {
                              setShowSelectedData((prev) => {
                                return isSelected
                                  ? prev.filter(
                                      (item) => item._id !== classifier._id
                                    )
                                  : [...prev, classifier];
                              });
                              handleCheckBoxSelecedHistoryChange(
                                classifier._id
                              );
                            }
                          }}
                          className={`hover:bg-gray-100 text-gray-600 text-xs sm:text-sm ${
                            index !== allClassifier.length - 1
                              ? "border-b border-gray-300 "
                              : ""
                          }`}
                        >
                          <td
                            className={`px-4 py-24  ${
                              historySelectedAction
                                ? "block sm:hidden"
                                : "hidden"
                            }`}
                          >
                            <div className="flex justify-center items-center gap-2">
                              {historySelectedAction ? (
                                <div
                                  className="flex justify-center items-center gap-2"
                                  onClick={(e) => e.stopPropagation()} // ป้องกัน trigger แถว
                                >
                                  <input
                                    type="checkbox"
                                    name={`selected-${classifier._id}`}
                                    checked={isSelected}
                                    onChange={() => {
                                      setShowSelectedData((prev) => {
                                        return isSelected
                                          ? prev.filter(
                                              (item) =>
                                                item._id !== classifier._id
                                            )
                                          : [...prev, classifier];
                                      });
                                      handleCheckBoxSelecedHistoryChange(
                                        classifier._id
                                      );
                                    }}
                                    className="size-5 accent-blue-600 bg-blue-600 border-blue-600 text-white cursor-pointer"
                                  />
                                </div>
                              ) : null}
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            {classifier.userName}
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex justify-center items-center size-30 sm:size-40">
                              {classifier.imageUrl ? (
                                <img
                                  src={`${
                                    import.meta.env.VITE_SERVER_URL
                                  }/uploads/${classifier.imageUrl}`}
                                  alt={classifier.bestpredicted}
                                  className="w-full h-full object-cover rounded-md"
                                />
                              ) : (
                                <p>ไม่มีรูปภาพ</p>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            {classifier.bestSecondLayer
                              ? classifier.bestSecondLayer
                              : "ไม่มีข้อมูล"}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            {classifier.confidenceScore
                              ? `${classifier.confidenceScore}%`
                              : classifier.secondLayer?.[0]?.probability
                              ? `${classifier.secondLayer[0].probability}%`
                              : "ไม่มีข้อมูล"}
                          </td>

                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="pl-2">
                              {classifier.secondLayer.length > 0 ? (
                                classifier.secondLayer
                                  .sort((a, b) => b.probability - a.probability)
                                  .slice(0, 5)
                                  .map((item, idx) => (
                                    <div key={idx} className="mb-2 text-start">
                                      {item.class} ({item.probability}%)
                                    </div>
                                  ))
                              ) : (
                                <div className="flex items-center justify-center">
                                  <p className="text-sm">ไม่มีข้อมูล</p>
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            {classifier.process_time > 1000
                              ? `${(classifier.process_time / 1000).toFixed(
                                  2
                                )} วินาที`
                              : `${classifier.process_time} มิลลิวินาที`}
                          </td>
                          <td className="px-4 py-4">
                            <p>
                              {(() => {
                                const createdDate = classifier.createdAt
                                  ? new Date(classifier.createdAt)
                                  : null;
                                return createdDate
                                  ? createdDate.toLocaleString("th-TH", {
                                      day: "numeric",
                                      month: "long",
                                      year: "numeric",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })
                                  : "-";
                              })()}
                            </p>
                          </td>
                          <td className="px-4 py-4 text-center">
                            <div className="flex justify-center items-center gap-2">
                              {historySelectedAction ? (
                                <div
                                  className="flex justify-center items-center gap-2"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <input
                                    type="checkbox"
                                    name={`selected-${classifier._id}`}
                                    checked={isSelected}
                                    onChange={() => {
                                      setShowSelectedData((prev) => {
                                        return isSelected
                                          ? prev.filter(
                                              (item) =>
                                                item._id !== classifier._id
                                            )
                                          : [...prev, classifier];
                                      });
                                      handleCheckBoxSelecedHistoryChange(
                                        classifier._id
                                      );
                                    }}
                                    className="size-5 cursor-pointer hidden sm:block accent-blue-600 bg-blue-600 border-blue-600 text-white"
                                  />
                                </div>
                              ) : (
                                <>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedClassifier(classifier);
                                      setIsOpenInfo(true);
                                    }}
                                    className="bg-blue-500 text-white p-1.5 rounded-full hover:bg-blue-700 duration-200 cursor-pointer transition-all ease-in-out hover:-translate-y-1"
                                  >
                                    <Eye className="size-4 sm:size-5" />
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleOpenMap(
                                        classifier.latitude,
                                        classifier.longitude
                                      );
                                    }}
                                    className="bg-green-600 text-white p-1.5 rounded-full hover:bg-green-700 duration-200 cursor-pointer transition-all ease-in-out hover:-translate-y-1"
                                  >
                                    <MapPin className="size-4 sm:size-5" />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      <footer>
        <div className="flex justify-between items-center mt-4">
          <div>
            <p className="text-gray-600">
              แสดง <span className="font-medium">{allClassifier?.length}</span>{" "}
              out of{" "}
              <span className="font-medium">{Classifier?.totalHistories}</span>{" "}
              ทั้งหมด
            </p>
          </div>
          <div className="flex gap-2">
            <Pagination
              totalPages={Classifier?.totalPages}
              currentPage={Classifier?.page}
              handlePageChange={handlePageChange}
            />
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TableClassifiredHistory;
