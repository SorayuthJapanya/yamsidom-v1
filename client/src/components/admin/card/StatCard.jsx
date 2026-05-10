import { Filter, Leaf, User, UserCog } from "lucide-react";
import { useGetAllHistoryData } from "../../../api/admin/HistoryApi";
import { useGetAllSpeciesData } from "../../../api/admin/SpeciesApi";
import { useGetAllUserData } from "../../../api/admin/UserDataApi";

const StatCard = () => {
  const { data: usersData } = useGetAllUserData();
  const { data: speciesData } = useGetAllSpeciesData({
    selectedLocalName: null,
    currentPage: null,
    role: null,
  });
  const { data: historyData } = useGetAllHistoryData();

  const cardInfo = [
    {
      title: "ผู้ใช้งานทั้งหมด",
      value: usersData?.totalRoleUser,
      icon: <User className="size-4 sm:size-5" />,
    },
    {
      title: "ผู้ดูแลทั้งหมด",
      value: usersData?.totalRoleAdmin,
      icon: <UserCog className="size-4 sm:size-5" />,
    },
    {
      title: "สายพันธุ์ทั้งหมด",
      value: speciesData?.totalSpecies,
      icon: <Leaf className="size-4 sm:size-5" />,
    },
    {
      title: "จำแนกเสร็จสิ้น",
      value: historyData?.totalHistories,
      icon: <Filter className="size-4 sm:size-5" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cardInfo.map((info, index) => (
        <div
          key={index}
          className="bg-white border border-gray-200 rounded-lg px-6 py-4"
        >
          <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-2">
            {info.title}
          </h3>
          <div className="flex items-center justify-between">
            <p className="text-2xl sm:text-3xl font-semibold text-blue-700">
              {info.value}
            </p>
            <div className="p-2 rounded-full bg-blue-100 text-blue-500">
              {info.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatCard;
