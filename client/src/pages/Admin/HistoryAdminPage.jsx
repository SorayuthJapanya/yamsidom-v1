import React, { useEffect, useRef, useState } from "react";
import UserSearch from "../../components/search/UserSearch";
import { Loader } from "lucide-react";
import {
  useGetAllClassification,
  useGetFilterSpecies,
} from "../../api/admin/HistoryApi";
import Title from "../../components/admin/Title";
import TableClassifiredHistory from "../../components/admin/table/TableClassifiredHistory";
import FilterHistory from "../../components/admin/FilterHistory";
import DetailHistory from "../../components/admin/DetailHistory";

const HistoryAdminPage = () => {
  const [allClassifier, setAllClassifier] = useState([]);
  const [Classifier, setClassifier] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [allFilter, setAllfilter] = useState([]);
  const [filterSpecies, setFilterSpecies] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedHistories, setSelectedHistories] = useState([]);
  const [showSelectedData, setShowSelectedData] = useState([]);
  const [historySelectedAction, setHistorySelectedAction] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilterSidebar, setShowFilterSidebar] = useState(false);
  const [showSelctedSideBar, setshowSelectedSideBar] = useState(false);
  const [isOpenInfo, setIsOpenInfo] = useState(false);
  const [selectedClassifier, setSelectedClassifier] = useState(null);

  const { data: getAllClassifier, refetch: refetchClassifire, isPending } =
    useGetAllClassification({
      selectedUser,
      filterSpecies,
      currentPage,
    });

  const { data: getFilterSpecies } = useGetFilterSpecies();

  const handleReset = () => {
    setFilterSpecies([]);
    setSelectedUser("");
    setSelectedHistories([]);
    setShowSelectedData([]);
    setShowFilterSidebar(false);
    setshowSelectedSideBar(false);
    setHistorySelectedAction(false);
  };

  useEffect(() => {
    if (getFilterSpecies) {
      setFilterData(getFilterSpecies.species);
    }
  }, [getFilterSpecies]);

  useEffect(() => {
    if (getAllClassifier?.histories) {
      setAllClassifier(getAllClassifier.histories);
      setClassifier(getAllClassifier);
    }

    if (filterData && filterData.length > 0) {
      const predictedValue = filterData.map((item) => item.localName);
      const uniquePredicted = [...new Set(predictedValue)];

      setAllfilter(uniquePredicted);
    }
  }, [getAllClassifier, filterData]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  return (
    <div className="min-h-screen px-6 py-4 sm:px-12 sm:py-8">
      <header className="flex flex-col justify-center items-start mb-4 md:mb-8">
        <Title
          title="ประวัติการจำแนก"
          subTitle="ดูข้อมูลการจำแนกพันธุ์ และส่งออกผลลัพธ์ในรูปแบบท PDF"
        />
      </header>

      <nav className="flex flex-col lg:flex-row items-start lg:items-center justify-end gap-2 mb-4 w-full">
        <UserSearch
          value={selectedUser}
          onUserSelected={(user) => {
            setSelectedUser(user);
          }}
        />

        <div className="flex gap-2 mt-2 sm:mt-0">
          <button
            onClick={() => {
              setShowFilterSidebar(!showFilterSidebar);
            }}
            className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 cursor-pointer duration-200 transition-all transform hover:-translate-y-1 font-normal text-sm sm:text-base"
          >
            ฟีลเตอร์
          </button>
          <button
            onClick={() => {
              setshowSelectedSideBar(!showSelctedSideBar);
              setHistorySelectedAction(!historySelectedAction);
            }}
            className="px-3 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 cursor-pointer duration-200 transition-all transform hover:-translate-y-1 font-normal text-sm sm:text-base"
          >
            ส่งออก
          </button>
          <button
            onClick={handleReset}
            className="px-3 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 cursor-pointer duration-200 transition-all transform hover:-translate-y-1 font-normal text-sm sm:text-base"
          >
            รีเซ็ท
          </button>
        </div>
      </nav>

      {/* container */}
      <div className="flex gap-4 w-full">
        {/* Left: Table Section */}
        <div className="bg-white border border-gray-200 rounded-lg px-6 py-4 md:w-full min-w-5xl">
          <TableClassifiredHistory
            allClassifier={allClassifier}
            setCurrentPage={setCurrentPage}
            selectedHistories={selectedHistories}
            setSelectedHistories={setSelectedHistories}
            setShowSelectedData={setShowSelectedData}
            setIsOpenInfo={setIsOpenInfo}
            setSelectedClassifier={setSelectedClassifier}
            Classifier={Classifier}
            historySelectedAction={historySelectedAction}
            isPending={isPending}
          />
        </div>

        {/* Right: Sidebar */}
        <div
          className={`${
            showFilterSidebar || showSelctedSideBar ? "block" : "hidden"
          }`}
        >
          <FilterHistory
            selectedHistories={selectedHistories}
            showFilterSidebar={showFilterSidebar}
            setShowFilterSidebar={setShowFilterSidebar}
            allFilter={allFilter}
            filterSpecies={filterSpecies}
            setFilterSpecies={setFilterSpecies}
            showSelctedSideBar={showSelctedSideBar}
            setshowSelectedSideBar={setshowSelectedSideBar}
            setHistorySelectedAction={setHistorySelectedAction}
            showSelectedData={showSelectedData}
            setSelectedHistories={setSelectedHistories}
            setShowSelectedData={setShowSelectedData}
            refetchClassifire={refetchClassifire}
          />
        </div>
      </div>

      <DetailHistory
        isOpenInfo={isOpenInfo}
        selectedClassifier={selectedClassifier}
        setIsOpenInfo={setIsOpenInfo}
        setSelectedClassifier={setSelectedClassifier}
      />
    </div>
  );
};

export default HistoryAdminPage;
