import React, { useEffect, useState } from "react";
import LocalNameSearch from "../../components/search/LocalNameSearch";
import { useGetAllSpecies } from "../../api/SpeciesApi";
import Title from "../../components/Title";
import { motion } from "framer-motion";
import SpeciesCard from "@/components/species/SpeciesCard";

const SpeciesPage = () => {
  const [speciesData, setSpeciesData] = useState([]);
  const [selectedLocalName, setSelectedLocalName] = useState("");

  const role = localStorage.getItem("userRole");

  // Fetch species data
  const {
    data: allSpecies,
    isLoading,
    error,
  } = useGetAllSpecies({
    selectedLocalName: selectedLocalName,
    role: role,
  });

  useEffect(() => {
    if (allSpecies) {
      setSpeciesData(allSpecies.species);
    }
  }, [allSpecies]);

  const handleRefreshPage = () => {
    setSelectedLocalName("");
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-6 space-y-2"
      >
        <Title
          title="สายพันธุ์มันพื้นบ้าน"
          subTitle="ค้นพบและเรียนรู้เกี่ยวกับพันธุ์พืชหลากหลายชนิดจากภูมิปัญญาท้องถิ่น"
        />
      </motion.header>

      {/* Content */}
      <div className="max-w-7xl mx-auto mt-10">
        {isLoading ? (
          <p className="text-center text-gray-600">กำลังโหลด...</p>
        ) : error ? (
          <p className="text-center text-red-500">
            {error.message || "An error occurred"}
          </p>
        ) : speciesData.length === 0 ? (
          <p className="text-center text-gray-600">ไม่สายพันธุ์มันพื้นบ้าน</p>
        ) : (
          <>
            <motion.div className="flex items-center justify-between mb-6">
              <div className="text-gray-500 text-xs md:text-sm w-full">
                สายพันธุ์ทั้งหมด {speciesData.length} สายพันธุ์
              </div>
              {/* Search Bar */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="w-80 md:w-96 flex justify-end items-center gap-2 sm:gap-4"
              >
                <LocalNameSearch
                  onLocalNameSelected={(localName) => {
                    setSelectedLocalName(localName);
                  }}
                />
                <button
                  onClick={handleRefreshPage}
                  className="w-max px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200 ease-in-out hover:-translate-y-0.5 cursor-pointer text-xs sm:text-sm"
                >
                  รีเซ็ท
                </button>
              </motion.div>
            </motion.div>

            <SpeciesCard speciesData={speciesData} />
          </>
        )}
      </div>
    </div>
  );
};

export default SpeciesPage;
