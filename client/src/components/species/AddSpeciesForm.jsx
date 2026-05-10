import React, { useState } from "react";
import toast from "react-hot-toast";
import { Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAddSpecie } from "../../api/admin/SpeciesApi";

const AddSpeciesForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    commonName: "",
    localName: "",
    scientificName: "",
    familyName: "",
    description: "",
    propagation: "",
    plantingseason: "",
    harvestingseason: "",
    utilization: "",
    status: "",
    surveysite: "",
  });

  const [image, setImage] = useState(null);

  const { mutate: addSpecies, isLoading } = useAddSpecie({
    setFormData,
    setImage,
    navigate,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!image) {
      toast.error("กรุณาอัปโหลดภาพใบไม้");
      return;
    }

    addSpecies({ ...formData, image });
  };

  return (
    <div className="w-full max-w-4xl ">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-6 text-gray-700 text-sm"
      >
        {/* Image Upload Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full">
          <label
            htmlFor="leaf-image"
            className="bg-gray-200 rounded-md cursor-pointer outline-dashed outline-2 outline-gray-400 hover:outline-blue-500 focus-within:outline-blue-500 transition-colors"
          >
            <img
              src={image ? URL.createObjectURL(image) : "/leaf.png"}
              alt="Preview"
              className="size-36 object-cover rounded-md"
            />
            <input
              type="file"
              name="leaf-image"
              id="leaf-image"
              accept="image/*"
              hidden
              onChange={handleImageChange}
            />
          </label>

          <div className="flex items-center gap-2">
            {isLoading && <Loader className="w-5 h-5 animate-spin" />}
            <p className="text-sm text-zinc-600">อัปโหลดภาพใบไม้ของคุณ</p>
          </div>
        </div>

        {/* Info Form Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            {/* Common Name */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                ชื่อสามัญ <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="commonName"
                value={formData.commonName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Local Name */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                ชื่อท้องถิ่น <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="localName"
                value={formData.localName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Scientific Name */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                ชื่อวิทยาศาสตร์ <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="scientificName"
                value={formData.scientificName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Family Name */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                ชื่อวงศ์ <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="familyName"
                value={formData.familyName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {/* Propagation */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                การขยายพันธุ์
              </label>
              <input
                type="text"
                name="propagation"
                value={formData.propagation}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Planting Season */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                ฤดูกาลปลูก
              </label>
              <input
                type="text"
                name="plantingseason"
                value={formData.plantingseason}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Harvesting Season */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                ฤดูกาลเก็บเกี่ยว
              </label>
              <input
                type="text"
                name="harvestingseason"
                value={formData.harvestingseason}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                สถานภาพ
              </label>
              <input
                type="text"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Full Width Fields */}
        <div className="space-y-4">
          {/* Description */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              ลักษณะทั่วไป <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              แหล่งที่สำรวจ
            </label>
            <textarea
              name="surveysite"
              value={formData.surveysite}
              onChange={handleInputChange}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
            />
          </div>

          {/* Utilization */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              การใช้ประโยชน์
            </label>
            <textarea
              name="utilization"
              value={formData.utilization}
              onChange={handleInputChange}
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-start pt-4">
          <button
            type="submit"
            className=" cursor-pointer bg-blue-500 text-white px-8 py-3 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ease-in-out hover:shadow-lg"
            disabled={isLoading}
          >
            {isLoading ? "กำลังเพิ่มข้อมูล..." : "เพิ่มข้อมูลสายพันธุ์ใหม่"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddSpeciesForm;
