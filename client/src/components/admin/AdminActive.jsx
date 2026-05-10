import { Link } from "react-router-dom";
import { ArrowRightCircle, Leaf, Shapes, User } from "lucide-react";

const AdminActive = () => {
  const adminActive = [
    {
      title: "ระบบจัดการผู้ใช้",
      subTitle: "ดู แก้ไข หรือลบข้อมูลบัญชีผู้ใช้งาน",
      navigate: "/admin/manage-user",
      icon: <User className="size-4 sm:size-5" />,
    },
    {
      title: "ประวัติการจำแนก",
      subTitle: "ดูและส่งออกข้อมูลการจำแนกชนิดพืช",
      navigate: "/admin/history",
      icon: <Shapes className="size-4 sm:size-5" />,
    },
    {
      title: "ระบบจัดการสายพันธุ์",
      subTitle: "เพิ่ม แก้ไข หรือลบข้อมูลชนิดพืช",
      navigate: "/admin/manage-species",
      icon: <Leaf className="size-4 sm:size-5" />,
    },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {adminActive.map((item, index) => (
        <div
          key={index}
          className="bg-white border border-gray-200 rounded-lg px-6 py-4"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg md:text-xl font-semibold text-blue-700 mb-2">
              {item.title}
            </h2>
            <div className="p-1.5 rounded-full bg-blue-100 text-blue-500">
              <p>{item.icon}</p>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-gray-500 mb-6">
            {item.subTitle}
          </p>
          <Link
            to={item.navigate}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-all w-full text-center transform hover:-translate-y-1 duration-200 ease-in-out flex items-center justify-center"
          >
            <ArrowRightCircle className="size-4 sm:size-5 mr-2" /> {item.title}
          </Link>
        </div>
      ))}
    </div>
  );
};

export default AdminActive;
