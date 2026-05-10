import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Pagination from "../../components/Pagination";
import LocalNameSearch from "../../components/search/LocalNameSearch";
import { useGetAllSpeciesData } from "../../api/admin/SpeciesApi";
import Title from "../../components/admin/Title";
import TableSpecies from "../../components/admin/table/TableSpecies";

const ManageSpeciesPage = () => {
  const [speciesData, setSpeciesData] = useState([]);
  const [speciesPages, setSpeciesPages] = useState(1);
  const [selectedLocalName, setSelectedLocalName] = useState("");
  const [isSearch, setIsSearch] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const role = localStorage.getItem("userRole");
  // Fetch species data
  const {
    data: SpeciesData,
    isLoading,
    error,
    refetch: refetchSpeciesData,
  } = useGetAllSpeciesData({
    selectedLocalName: selectedLocalName,
    currentPage: currentPage,
    role: role,
  });

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleResetSearch = () => {
    setSelectedLocalName("");
    setIsSearch(false);
    setCurrentPage(1); // รีเซ็ต page กลับไปหน้าแรก
  };

  useEffect(() => {
    if (SpeciesData) {
      setSpeciesData(SpeciesData.species);
      setSpeciesPages(SpeciesData);
    }
  }, [SpeciesData]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  return (
    <div className="min-h-screen px-6 py-4 sm:px-12 sm:py-8">
      <header className="flex flex-col justify-center items-start mb-4 md:mb-8">
        <Title
          title="ระบบจัดการข้อมูลสายพันธุ์"
          subTitle=" ดู แก้ไข และจัดการข้อมูลพันธุ์มันพื้นบ้านในระบบ"
        />
      </header>

      <div className="flex flex-col justify-center items-center w-full max-w-7xl mx-auto mt-6 mb-20">
        {isLoading ? (
          <p className="text-gray-600">กำลังโหลด...</p>
        ) : error ? (
          <p className="text-red-500">{error.message}</p>
        ) : speciesPages.length === 0 ? (
          <p className="text-gray-600">ไม่พบข้อมูลสายพันธุ์</p>
        ) : (
          <div className="w-full">
            <nav className="flex flex-col lg:flex-row items-start lg:items-center justify-end gap-2 mb-4">
              <div className="flex items-center gap-2 relative">
                <LocalNameSearch
                  onLocalNameSelected={(localName) => {
                    setSelectedLocalName(localName);
                    setIsSearch(true);
                  }}
                />
                {isSearch && (
                  <button
                    className="text-sm sm:text-base px-3 sm:px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 cursor-pointer active:bg-green-900 duration-200"
                    onClick={handleResetSearch}
                  >
                    รีเซ็ท
                  </button>
                )}
              </div>
              <Link to={"/admin/add-species"}>
                <button
                  type="button"
                  className="text-sm sm:text-base px-3 sm:px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 cursor-pointer duration-300 transitaion-all ease-in-out hover:-translate-y-1"
                >
                  เพิ่มสายพันธุ์ใหม่
                </button>
              </Link>
            </nav>
            <div className="bg-white border border-gray-200 rounded-lg px-6 py-4 w-full min-w-[1000px] mr-6">
              <div className="overflow-x-auto">
                <TableSpecies
                  speciesData={speciesData}
                  refetchSpeciesData={refetchSpeciesData}
                />
              </div>

              <footer>
                <div className="flex justify-between items-center mt-4">
                  <div>
                    <p className="text-gray-600">
                      แสดง{" "}
                      <span className="font-medium">
                        {speciesPages?.species?.length ?? 0}
                      </span>{" "}
                      ทั้งหมด{" "}
                      <span className="font-medium">
                        {speciesPages?.totalSpecies ?? 0}
                      </span>{" "}
                      รายการ
                    </p>
                  </div>
                  <Pagination
                    totalPages={speciesPages.totalPages}
                    currentPage={speciesPages.currentPage}
                    handlePageChange={handlePageChange}
                  />
                </div>
              </footer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageSpeciesPage;
