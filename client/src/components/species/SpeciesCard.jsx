import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ViewInfoSpecie from "../ViewInfoSpecie";
import { X } from "lucide-react";

const SpeciesCard = ({ speciesData }) => {
  const [previewImage, setPreviewImage] = useState(null);
  const [specieId, setSpecieId] = useState("");
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const navigate = useNavigate();

  const handleClickImage = (imageUrl) => {
    setPreviewImage(imageUrl);
  };
  const handleClosePreview = () => {
    setPreviewImage(null);
  };
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {speciesData.map((species, index) => (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.3 }}
          key={index}
          className="bg-white shadow-md rounded-lg p-4  hover:shadow-lg transition duration-200 "
        >
          <motion.div
            onClick={() =>
              handleClickImage(
                species.imageUrl
                  ? `${import.meta.env.VITE_SERVER_URL}/uploads/species/${
                      species.imageUrl
                    }`
                  : "/leaf.png"
              )
            }
            className="w-full h-56 mb-4 relative  hover:bg-black/10 transition duration-200 text-sm"
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
              className="w-full h-full object-repeat object-cover object-center rounded-md mb-4 hover:cursor-pointer hover:scale-105 transition-transform duration-300"
            />
          </motion.div>
          <h2 className="text-xs sm:text-sm font-normal text-gray-600">
            {species.scientificName}
          </h2>
          <p className="flex items-center gap-2 text-gray-800 text-base sm:text-lg font-medium">
            {species.localName}
            {species.role === "NEW" && (
              <span className="px-2 py-1 text-xs font-medium bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-full shadow-sm animate-pulse">
                NEW
              </span>
            )}
          </p>
          <button
            onClick={() => {
              setIsInfoOpen(true);
              setSpecieId(species._id);
            }}
            className="mt-4 text-xs sm:text-sm px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 duration-200 cursor-pointer transition-all ease-in-out hover:-translate-y-0.5"
          >
            ดูรายละเอียด
          </button>
          <button
            onClick={() => {
              navigate(`/species/${species.localName}`);
            }}
            className="ml-2 mt-4 text-xs sm:text-sm px-3 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 duration-200 cursor-pointer transition-all ease-in-out hover:-translate-y-0.5"
          >
            ดูรูปภาพ
          </button>
        </motion.div>
      ))}

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
              className="absolute top-2 right-2 text-white bg-gray-500 rounded-full p-1.5 hover:bg-gray-600 cursor-pointer transition-all duration-200"
            >
              <X />
            </button>
          </div>
        </div>
      )}

      {isInfoOpen && (
        <ViewInfoSpecie specie_id={specieId} setIsInfoOpen={setIsInfoOpen} />
      )}
    </div>
  );
};

export default SpeciesCard;
