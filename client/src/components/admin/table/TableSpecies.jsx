import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import { useDeleteSpecies } from "../../../api/admin/SpeciesApi";
import Swal from "sweetalert2";
import { Edit, Eye, Trash2 } from "lucide-react";
import { useState } from "react";
import ViewInfoSpecie from "../../ViewInfoSpecie";

const TableSpecies = ({ speciesData, refetchSpeciesData }) => {
  const navigate = useNavigate();
  const deleteSpecies = useDeleteSpecies({ refetchSpeciesData });
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [specieId, setSpecieId] = useState("");

  const handleDelete = async (speciesId) => {
    const result = await Swal.fire({
      title: "คุณแน่ใจหรือไม่?",
      text: "คุณต้องการลบข้อมูลสายพันธุ์นี้หรือไม่?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ใช่, ลบเลย!",
      cancelButtonText: "ยกเลิก",
    });
    if (result.isConfirmed) {
      deleteSpecies.mutate(speciesId);
    }
  };

  const handleEdit = (speciesId) => {
    navigate(`/admin/edit-species/${speciesId}`);
  };

  const handleViewSpecies = (speciesId) => {
    setIsInfoOpen(true);
    setSpecieId(speciesId);
  };

  return (
    <table className="w-full text-xs sm:text-sm">
      <thead>
        <tr className="hover:bg-gray-100 border-b-2 font-medium text-gray-700 border-gray-300 text-center">
          <td className="px-4 py-2">รูปภาพ</td>
          <td className="px-4 py-2">ชื่อสามัญ</td>
          <td className="px-4 py-2">ชื่อท้องถิ่น</td>
          <td className="px-4 py-2">ชื่อวิทยาศาสตร์</td>
          <td className="px-4 py-2">วงศ์</td>
          <td className="px-4 py-2">วันที่เพิ่มสายพันธุ์</td>
          <td className="px-4 py-2">การดำเนินการ</td>
        </tr>
      </thead>
      <tbody className="text-center">
        {speciesData
          .map((species, index) => (
            <tr
              key={species._id}
              className={`hover:bg-gray-100 text-gray-600 ${
                index !== speciesData.length - 1
                  ? "border-b border-gray-300"
                  : ""
              }`}
            >
              <td className="px-4 py-4 flex items-center justify-center">
                {species.imageUrl ? (
                  <img
                    src={`${import.meta.env.VITE_SERVER_URL}/uploads/species/${
                      species.imageUrl
                    }`}
                    alt={species.commonName}
                    className="size-30 md:size-40 object-cover rounded-md"
                  />
                ) : (
                  <p>No Image</p>
                )}
              </td>
              <td className="px-4 py-4">{species.commonName}</td>
              <td className="px-4 py-4">{species.localName}</td>
              <td className="px-4 py-4">{species.scientificName}</td>
              <td className="px-4 py-4">{species.familyName}</td>
              <td className="px-4 py-4">
                {(() => {
                  const date = new Date(species.createdAt);
                  const thaiYear = date.getFullYear() + 543;
                  return `${format(date, "dd MMM", {
                    locale: th,
                  })} ${thaiYear}`;
                })()}
              </td>
              <td className="px-4 py-4">
                <div className="w-full h-full flex gap-2 items-center justify-center">
                  <button className="bg-blue-500 text-white p-1.5 rounded-full hover:bg-blue-700 cursor-pointer duration-300 transitaion-all ease-in-out hover:-translate-y-0.5">
                    <Eye
                      onClick={() => {
                        handleViewSpecies(species._id);
                      }}
                      className="size-4 sm:size-5"
                    />
                  </button>
                  <button className="bg-green-600 text-white p-1.5 rounded-full hover:bg-green-700 cursor-pointer duration-300 transitaion-all ease-in-out hover:-translate-y-0.5">
                    <Edit
                      onClick={() => handleEdit(species._id)}
                      className="size-4 sm:size-5"
                    />
                  </button>
                  <button
                    onClick={() => handleDelete(species._id)}
                    className="bg-red-500 text-white p-1.5 rounded-full hover:bg-red-700 cursor-pointer duration-300 transitaion-all ease-in-out hover:-translate-y-0.5"
                  >
                    <Trash2 className="size-4 sm:size-5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
      </tbody>
      {isInfoOpen && (
        <ViewInfoSpecie specie_id={specieId} setIsInfoOpen={setIsInfoOpen} />
      )}
    </table>
  );
};

export default TableSpecies;
