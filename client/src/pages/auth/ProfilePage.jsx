import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Camera, Edit } from "lucide-react";
import { useGetUserById, useUpdateProfile } from "../../api/AuthApi";

const ProfilePage = () => {
  const { id } = useParams();
  const [userData, setUserData] = useState([]);
  const [selectedProfile, setSelectdProfile] = useState(null);
  const [existingProfile, setExistingProfile] = useState("");
  const fileInputRef = useRef(null);

  const navigate = useNavigate();

  const {
    data: user,
    isLoading: userLoading,
    refetch: refetchUser,
  } = useGetUserById({ userId: id });

  const { mutate: updateProfile, isLoading: isUpdatingProfile } =
    useUpdateProfile({ userId: id, refetchUser });

  const handleImageUpload = (e) => {
    const profile = e.target.files[0];
    if (!profile) return;
    setSelectdProfile(profile);
    updateProfile(profile);
  };

  useEffect(() => {
    if (user) {
      setUserData(user);
    }
  }, [user]);

  useEffect(() => {
    if (userData) {
      setExistingProfile(userData.profilePic);
    }
  }, [userData]);

  const profileData = [
    { label: "ชื่อ-สกุล", value: userData?.name || "-", icon: "👤" },
    { label: "อีเมล", value: userData?.email || "-", icon: "✉️" },
    { label: "ตำแหน่งงาน", value: userData?.position || "-", icon: "💼" },
    { label: "แผนก", value: userData?.department || "-", icon: "👥" },
    { label: "หน่วยงาน", value: userData?.organization || "-", icon: "🏢" },
    {
      label: "ที่อยู่สำนักงาน",
      value: userData?.work_address || "-",
      icon: "📍",
    },
    {
      label: "เบอร์โทรศัพท์",
      value: userData?.phone_number || "-",
      icon: "📱",
    },
  ];

  if (userLoading) {
    return (
      <div className="w-full min-h-160 flex items-center justify-center text-red-500">
        ดึงข้อมูลผู้ใช้ล้มเหลว
      </div>
    );
  }

  return (
    <div className="w-full min-h-160 bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-3xl mx-auto p-4 py-8">
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
          {/* Top Navigation */}
          <div className="flex justify-between items-center mb-8">
            <button
              onClick={() => history.back()}
              className="inline-flex items-center gap-2 px-4 py-2 text-gray-600 bg-gray-200 hover:bg-gray-300 rounded-lg transition duration-200 cursor-pointer"
            >
              <ArrowLeft className="size-5" />
              กลับ
            </button>
            <button
              onClick={() => navigate(`/edit-profile/${userData._id}`)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition duration-200 shadow-md hover:shadow-lg cursor-pointer"
            >
              <Edit className="size-5"/>
              แก้ไขข้อมูล
            </button>
          </div>

          {/* Profile Header */}
          <div className="relative mb-12">
            {/* Background Header */}
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-r from-blue-600 to-blue-400 rounded-t-2xl"></div>

            {/* Profile Picture & Upload Section */}
            <div className="relative flex flex-col items-center pt-16">
              <div className="relative group">
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
                </div>
                <label
                  htmlFor="avatar-upload"
                  className={`
                    absolute bottom-2 right-2
                    bg-blue-600 hover:bg-blue-700
                    p-2 rounded-full cursor-pointer 
                    shadow-md hover:shadow-lg
                    transition-all duration-200
                    ${
                      isUpdatingProfile
                        ? "animate-pulse pointer-events-none"
                        : ""
                    }
                  `}
                >
                  <Camera className="size-5 text-white" />
                  <input
                    type="file"
                    id="avatar-upload"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUpdatingProfile}
                  />
                </label>
              </div>
              <div className="text-center mt-4">
                <h1 className="text-2xl font-bold text-gray-800">
                  {userData?.name || "ไม่ระบุชื่อ"}
                </h1>
                <p className="text-gray-500">
                  {userData?.email || "ไม่ระบุอีเมล"}
                </p>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                {isUpdatingProfile
                  ? "กำลังอัปโหลด..."
                  : "คลิกที่ไอคอนกล้องเพื่ออัปเดตรูปภาพ"}
              </p>
            </div>
          </div>

          {/* Profile Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            {profileData.slice(2).map((item, index) => (
              <div
                key={index}
                className="flex items-start space-x-4 p-6 bg-white rounded-xl border border-gray-100 hover:border-blue-200 transition-all duration-200 hover:shadow-md shadow-sm"
              >
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-50 text-blue-600">
                    <span className="text-2xl">{item.icon}</span>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-400 mb-1">
                    {item.label}
                  </h3>
                  <p
                    className={`text-gray-800 font-medium ${
                      item.value === "-" ? "text-gray-400 italic" : ""
                    }`}
                  >
                    {item.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
