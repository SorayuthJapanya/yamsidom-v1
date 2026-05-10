import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetUserById, useUpdateUser } from "../../api/AuthApi";
import { ArrowLeft, Camera, Save } from "lucide-react";

const UpdateUserForm = () => {
  const { id } = useParams();
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [existingProfile, setExistingProfile] = useState("");
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    position: "",
    department: "",
    organization: "",
    work_address: "",
    phone_number: "",
    profilePic: "",
  });

  const { data: user, isLoading: userLoading } = useGetUserById({ userId: id });

  const { mutate: updateUserInfo, isLoading: isUpdatingInfo } = useUpdateUser({
    userId: id,
    navigate,
  });

  const handleImageUpload = (e) => {
    const profile = e.target.files[0];
    if (!profile) return;
    setSelectedProfile(profile);
    setFormData((prev) => ({
      ...prev,
      profilePic: profile,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "profilePic" ? files[0] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateUserInfo(formData);
  };

  useEffect(() => {
    if (user) {
      setFormData({
        name: user?.name || "",
        email: user?.email || "",
        position: user?.position || "",
        department: user?.department || "",
        organization: user?.organization || "",
        work_address: user?.work_address || "",
        phone_number: user?.phone_number || "",
      });
      setExistingProfile(user?.profilePic || "");
    }
  }, [user]);

  if (userLoading) {
    return (
      <div className="w-full min-h-160 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
      <header className="flex justify-between items-center mb-8">
        <button
          onClick={() => history.back()}
          className="hiddem md:inline-flex items-center gap-2 py-2 px-4 text-gray-600 bg-gray-200 hover:bg-gray-300 rounded-lg transition duration-200 cursor-pointer"
        >
          <ArrowLeft className="size-5" />
          กลับ
        </button>
        {/* Header and Navigation */}
        <div className="flex justify-center items-center">
          <h1 className="text-2xl md:text-3xl font-semibold text-blue-700">
            แก้ไขข้อมูลส่วนตัว
          </h1>
        </div>
      </header>
      <div className="relative mb-12">
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-r from-blue-600 to-blue-400 rounded-t-2xl"></div>
        <form
          onSubmit={handleSubmit}
          className="relative flex flex-col justify-center items-center pt-16"
        >
          {/* Profile Picture Section */}
          <div className="relative group flex flex-col justify-center items-center gap-4">
            <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white">
              <img
                src={
                  selectedProfile
                    ? URL.createObjectURL(selectedProfile)
                    : existingProfile
                    ? `${
                        import.meta.env.VITE_SERVER_URL
                      }/uploads/${existingProfile}`
                    : "/avatar.png"
                }
                alt="Profile"
                className="w-full h-full object-cover"
              />
              <label
                htmlFor="avatar-upload"
                className={`absolute bottom-9 right-9 bg-blue-600 hover:bg-blue-700 p-2 rounded-full cursor-pointer shadow-md hover:shadow-lgtransition-all duration-200 ${
                  isUpdatingInfo ? "animate-pulse pointer-events-none" : ""
                }`}
              >
                <Camera className="size-5 text-white" />
                <input
                  type="file"
                  id="avatar-upload"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingInfo}
                />
              </label>
            </div>
            <p className="text-sm text-gray-600">
              {isUpdatingInfo
                ? "กำลังอัปโหลด..."
                : "คลิกที่ไอคอนกล้องเพื่ออัปเดตรูปภาพ"}
            </p>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-1">
              <label
                htmlFor="name"
                className="text-sm font-medium text-gray-700"
              >
                ชื่อ-สกุล
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 outline-none"
                required
              />
            </div>

            <div className="space-y-1">
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-700"
              >
                อีเมล
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 outline-none cursor-not-allowed bg-blue-50"
                required
                disabled
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label
                  htmlFor="position"
                  className="text-sm font-medium text-gray-700"
                >
                  ตำแหน่ง
                </label>
                <input
                  type="text"
                  id="position"
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="department"
                  className="text-sm font-medium text-gray-700"
                >
                  แผนก
                </label>
                <input
                  type="text"
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label
                htmlFor="organization"
                className="text-sm font-medium text-gray-700"
              >
                หน่วยงาน
              </label>
              <input
                type="text"
                id="organization"
                name="organization"
                value={formData.organization}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 outline-none"
              />
            </div>

            <div className="space-y-1">
              <label
                htmlFor="work_address"
                className="text-sm font-medium text-gray-700"
              >
                ที่อยู่สำนักงาน
              </label>
              <textarea
                id="work_address"
                name="work_address"
                value={formData.work_address}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 outline-none"
              />
            </div>

            <div className="space-y-1">
              <label
                htmlFor="phone_number"
                className="text-sm font-medium text-gray-700"
              >
                เบอร์โทรศัพท์
              </label>
              <input
                type="tel"
                id="phone_number"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleInputChange}
                placeholder="ตย.081-234-5678, 0812345678"
                maxLength={12}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isUpdatingInfo}
              className="flex items-center justify-center gap-2 px-4 py-3 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-all duration-200 disabled:bg-blue-400"
            >
              <Save className="size-5" />
              {isUpdatingInfo ? "กำลังบันทึก..." : "บันทึกการเปลี่ยนแปลง"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateUserForm;
