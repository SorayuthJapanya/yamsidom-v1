import React from "react";
import PredictedFilter from "../filter/Predictedfilter";
import { X } from "lucide-react";
import toast from "react-hot-toast";

const FilterHistory = ({
  selectedHistories,
  showFilterSidebar,
  setShowFilterSidebar,
  allFilter,
  filterSpecies,
  setFilterSpecies,
  showSelctedSideBar,
  setshowSelectedSideBar,
  setHistorySelectedAction,
  showSelectedData,
  setSelectedHistories,
  setShowSelectedData,
  refetchClassifire,
}) => {
  const handleExportPDF = () => {
    if (selectedHistories.length === 0) {
      return toast.error("กรุณาเลือกข้อมูลที่ท่านจะส่งออก");
    }

    localStorage.setItem("historySelected", JSON.stringify(selectedHistories));
    window.open("/preview-report", "_blank");
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-col space-y-4 w-60 shrink-0">
        {showFilterSidebar && (
          <div className="bg-white shadow-md rounded-lg p-6 ">
            <div className="flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg text-blue-700 font-semibold">
                  กรองสายพันธุ์
                </h2>
                <button
                  onClick={() => setShowFilterSidebar(false)}
                  className="text-white p-1.5 rounded-full bg-gray-400 cursor-pointer hover:bg-gray-500 duration-200"
                >
                  <X className="size-5" />
                </button>
              </div>
              <div className="overflow-y-auto max-h-[40vh] ">
                <PredictedFilter
                  predicted={allFilter}
                  filterPredicted={filterSpecies}
                  setFilterPredicted={setFilterSpecies}
                />
              </div>
              <div className="flex justify-start items-center mt-4">
                <button
                  onClick={() => {
                    setFilterSpecies([]);
                    if (refetchClassifire) refetchClassifire;
                  }}
                  className="text-sm py-1 px-4 bg-gray-400 hover:bg-gray-500 text-white rounded-md cursor-pointer transition-all duration-200 font-normal"
                >
                  ล้าง
                </button>
              </div>
            </div>
          </div>
        )}

        {showSelctedSideBar && (
          <div className="bg-white shadow-md rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg text-blue-700 font-semibold">
                สายพันธุ์ที่เลือก
              </h2>
              <button
                onClick={() => {
                  setshowSelectedSideBar(false);
                  setHistorySelectedAction(false);
                }}
                className="text-white p-1.5 rounded-full bg-gray-400 cursor-pointer hover:bg-gray-500 duration-200"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="space-y-2 mb-4 max-h-[300px] overflow-y-auto">
              {showSelectedData.length > 0 ? (
                showSelectedData.map((item, index) => (
                  <div
                    key={item._id || index}
                    className="bg-blue-50 p-2 rounded-md border border-blue-300"
                  >
                    <p className="text-sm text-gray-700 font-medium">
                      {index + 1}.{" "}
                      {item.bestSecondLayer
                        ? item.bestSecondLayer
                        : item.secondLayer[0].class}
                    </p>
                    <p className="text-xs text-gray-600">
                      ชื่อ: {item.userName}
                    </p>
                    <p className="text-xs text-gray-600">
                      ความมั่นใจ:{" "}
                      {item.confidenceScore
                        ? item.confidenceScore
                        : item.secondLayer[0].probability
                        ? item.secondLayer[0].probability
                        : "ไม่มีข้อมูล"}
                      %
                    </p>
                    <p className="text-xs text-gray-600">
                      วันที่:{" "}
                      {new Date(item.createdAt).toLocaleDateString("th-TH", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">ยังไม่มีรายการที่เลือก</p>
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleExportPDF}
                className="text-sm px-4 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-sm cursor-pointer transition-all duration-200"
              >
                ส่งออก PDF
              </button>
              <button
                onClick={() => {
                  setSelectedHistories([]);
                  setShowSelectedData([]);
                }}
                className="text-sm py-1 px-4 bg-gray-400 hover:bg-gray-500 text-white rounded-md cursor-pointer transition-all duration-200 font-normal"
              >
                ล้าง
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Filter Sidebar - Slide from Top */}
      <div
        className={`
      sm:hidden fixed top-0 left-0 right-0 z-110 
      transform transition-transform duration-300 ease-in-out
      ${showFilterSidebar ? "translate-y-0" : "-translate-y-full"}
    `}
      >
        <div className="bg-white w-full max-w-[240px] ml-auto shadow-lg mt-4 mr-4 rounded-lg p-4 max-h-[90vh] ">
          <div className="flex justify-between items-center mb-4 sticky top-0 bg-white pb-2 border-b">
            <h2 className="text-sm text-blue-700 font-semibold">
              กรองสายพันธุ์
            </h2>
            <button
              onClick={() => setShowFilterSidebar(false)}
              className="text-gray-800 px-2 py-1 rounded-full bg-gray-200 cursor-pointer hover:bg-gray-300 text-sm"
            >
              ✕
            </button>
          </div>
          <div className="text-xs overflow-y-auto max-h-[40vh]">
            <PredictedFilter
              predicted={allFilter}
              filterPredicted={filterSpecies}
              setFilterPredicted={setFilterSpecies}
            />
          </div>
          <button
            onClick={() => {
              setFilterSpecies([]);
              if (refetchClassifire) refetchClassifire;
            }}
            className="mt-2 w-full text-sm px-3 py-1 bg-gray-300 hover:bg-gray-400 text-black rounded-sm cursor-pointer transition-all duration-200"
          >
            ล้าง
          </button>
        </div>
      </div>

      {/* Mobile Selected Sidebar - Slide from Top */}
      <div
        className={`
      sm:hidden fixed top-0 left-0 right-0 z-110
      transform transition-transform duration-300 ease-in-out overflow-y-auto 
      ${showSelctedSideBar ? "translate-y-0" : "-translate-y-full"}
    `}
      >
        <div className="bg-white w-full max-w-3xs ml-auto shadow-lg mx-4 mt-4 rounded-lg p-4 max-h-[60vh] overflow-hidden flex flex-col">
          <div className="flex justify-between items-center mb-4 flex-shrink-0 pb-2 border-b">
            <h2 className="text-sm text-blue-700 font-semibold">
              สายพันธุ์ที่เลือก
            </h2>
            <button
              onClick={() => {
                setshowSelectedSideBar(false);
                setHistorySelectedAction(false);
              }}
              className="text-gray-800 px-2 py-1 rounded-full bg-gray-200 cursor-pointer hover:bg-gray-300 text-sm"
            >
              ✕
            </button>
          </div>

          <div className="space-y-2 mb-4 overflow-y-auto flex-1">
            {showSelectedData.length > 0 ? (
              showSelectedData.map((item, index) => (
                <div
                  key={item._id || index}
                  className="bg-blue-50 p-3 rounded-md border border-blue-300"
                >
                  <p className="text-sm text-gray-700 font-medium mb-1">
                    {index + 1}.{" "}
                    {item.bestSecondLayer
                      ? item.bestSecondLayer
                      : item.secondLayer[0].class}
                  </p>
                  <p className="text-xs text-gray-600 mb-1">
                    ชื่อ: {item.userName}
                  </p>
                  <p className="text-xs text-gray-600 mb-1">
                    ความมั่นใจ:{" "}
                    {item.confidenceScore
                      ? item.confidenceScore
                      : item.secondLayer[0].probability
                      ? item.secondLayer[0].probability
                      : "ไม่มีข้อมูล"}
                    %
                  </p>
                  <p className="text-xs text-gray-600">
                    วันที่:{" "}
                    {new Date(item.createdAt).toLocaleDateString("th-TH", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-8">
                ยังไม่มีรายการที่เลือก
              </p>
            )}
          </div>

          <div className="flex gap-2 flex-shrink-0 pt-2 border-t">
            <button
              onClick={handleExportPDF}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white rounded-md cursor-pointer transition-all duration-200 text-xs font-normal"
            >
              ส่งออก PDF
            </button>
            <button
              onClick={() => {
                setSelectedHistories([]);
                setShowSelectedData([]);
              }}
              className="flex-1 py-3 bg-gray-300 hover:bg-gray-400 text-black rounded-md cursor-pointer transition-all duration-200 text-xs font-normal"
            >
              ล้าง
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterHistory;
