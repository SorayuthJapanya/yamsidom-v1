import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetUserById } from "../../api/AuthApi";
import { ArrowLeft, Edit } from "lucide-react";
import Title from "../../components/admin/Title";

const ViewProfileUserPage = () => {
  const { id } = useParams();
  const [userData, setUserData] = useState([]);
  const navigate = useNavigate();

  const { data: user, isLoading: userLoading } = useGetUserById({ userId: id });

  useEffect(() => {
    if (user) {
      setUserData(user);
    }
  }, [user]);

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
    <div className="w-full min-h-160 bg-gradient-to-br">
      <div className="max-w-3xl mx-auto p-4 py-8">
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
          {/* Menu */}
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={() => history.back()}
              className="inline-flex items-center gap-2 px-4 py-2 text-gray-600 bg-gray-200 hover:bg-gray-300 rounded-lg transition duration-200 cursor-pointer"
            >
              <ArrowLeft className="size-5" />
              กลับ
            </button>
            <button
              onClick={() => navigate(`/admin/edit-user/${userData._id}`)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition duration-200 shadow-md hover:shadow-lg cursor-pointer"
            >
              <Edit className="size-5" />
              แก้ไขข้อมูล
            </button>
          </div>
          {/* Header */}
          <div className="text-center mb-8">
            <Title
              title="ดูข้อมูลโปรไฟล์"
              subTitle="ตรวจสอบและแก้ไขรายละเอียดที่จำเป็น"
            />
          </div>

          <div className="relative mb-12">
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-r from-blue-600 to-blue-400 rounded-t-2xl"></div>

            {/* Avatar Upload Section */}
            <div className="relative flex flex-col items-center pt-16">
              <div className="relative flex flex-col justify-center items-center gap-2">
                <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white">
                  <img
                    src={
                      userData?.profilePic
                        ? `${import.meta.env.VITE_SERVER_URL}/uploads/${
                            userData?.profilePic
                          }`
                        : "/avatar.png"
                    }
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-2xl font-semibold text-zinc-700">
                  {userData.name}
                </p>
              </div>
              {/* Profile Information Grid */}
              <div className="w-full px-4 grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
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
      </div>
    </div>
  );
};

export default ViewProfileUserPage;
