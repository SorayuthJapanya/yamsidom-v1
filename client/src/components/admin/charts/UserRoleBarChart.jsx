import React from "react";
import {
  BarChart,
  Bar,
  LabelList,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useGetAllUserData } from "../../../api/admin/UserDataApi";

const UserRoleBarChart = () => {
  const { data: usersData } = useGetAllUserData();
  const userRoleData = [
    {
      name: "ผู้ใช้ทั่วไป",
      value: usersData?.totalRoleUser,
    },
    {
      name: "ผู้ดูแลระบบ",
      value: usersData?.totalRoleAdmin,
    },
  ];

  const COLORS = {
    ผู้ใช้ทั่วไป: "#6366f1",
    ผู้ดูแลระบบ: "#f59e0b",
  };
  return (
    <div className="bg-white border border-gray-200 rounded-lg px-6 py-4 mb-8 min-w-full">
      <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-4">
        สัดส่วนประเภทผู้ใช้งาน
      </h3>
      <div className="h-96 md:h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={userRoleData}
            margin={{ top: 10, right: 10, left: 10, bottom: 30 }}
            layout="vertical"
            className="md:!m-5" // เพิ่ม margin สำหรับ desktop
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#e5e7eb"
              horizontal={true}
              vertical={false}
            />

            <XAxis
              type="number"
              stroke="#6b7280"
              tick={{ fill: "#6b7280", fontSize: 10 }}
              axisLine={{ stroke: "#d1d5db" }}
              tickLine={{ stroke: "#d1d5db" }}
              className="md:text-xs" // เพิ่มขนาด font สำหรับ desktop
            />

            <YAxis
              dataKey="name"
              type="category"
              stroke="#6b7280"
              tick={{ fill: "#6b7280", fontSize: 10 }}
              axisLine={{ stroke: "#d1d5db" }}
              tickLine={{ stroke: "#d1d5db" }}
              width={60}
              className="md:w-20 md:text-xs"
            />

            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                border: "none",
                borderRadius: "8px",
                boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
                fontSize: "11px",
                fontWeight: 500,
                maxWidth: "200px",
              }}
              cursor={{ fill: "rgba(79, 70, 229, 0.1)" }}
              formatter={(value) => [`${value}`, "จำนวน:"]}
            />

            {/* Legend จะซ่อนในมือถือ */}
            <Legend
              wrapperStyle={{
                paddingTop: "20px",
                fontSize: "13px",
                display: window.innerWidth < 768 ? "none" : "block",
              }}
              iconType="circle"
              iconSize={10}
              formatter={(value) => (
                <span style={{ color: "#4b5563", marginLeft: "4px" }}>
                  {value}
                </span>
              )}
            />

            <Bar
              dataKey="value"
              name="จำนวนผู้ใช้งาน"
              radius={[6, 6, 0, 0]}
              animationDuration={1500}
              animationEasing="ease-out"
            >
              {userRoleData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[entry.name] || "#4f46e5"}
                  stroke="#ffffff"
                  strokeWidth={1}
                />
              ))}
            </Bar>

            <LabelList
              dataKey="value"
              position="right"
              formatter={(value) => `${value}`}
              style={{
                fill: "#6b7280",
                fontSize: "10px",
                fontWeight: 500,
              }}
              className="md:text-xs"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default UserRoleBarChart;
