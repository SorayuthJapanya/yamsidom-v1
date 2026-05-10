import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { useGetHistoryStat } from "../../../api/admin/HistoryApi";

const ClassificationLineChart = () => {
  const [selectedRange, setSelectedRange] = useState("week");
  const { data: historyStatData } = useGetHistoryStat({ selectedRange });

  const rangeOptions = [
    { label: "วัน", value: "day" },
    { label: "สัปดาห์", value: "week" },
    { label: "เดือน", value: "month" },
    { label: "ปี", value: "year" },
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-lg px-6 py-4 mb-8">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-4">
        <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-4">
          จำนวนการจำแนกเชิงสถิติ
        </h3>
        <div className="flex space-x-2 mb-4">
          {rangeOptions.map((range) => (
            <button
              key={range.value}
              onClick={() => setSelectedRange(range.value)}
              className={`px-3 py-2 sm:px-4 rounded text-xs sm:text-sm ${
                selectedRange === range.value
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 cursor-pointer transition-all duration-200 ease-in-out hover:-translate-y-1 hover:bg-gray-400"
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>
      <div className="h-85">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={historyStatData?.data?.map((state) => ({
              date: new Date(state.updatedAt).toISOString(),
              classification: state.totalHistories,
            }))}
            margin={{ top: 25, right: 30, left: 30, bottom: 60 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#e5e7eb"
              vertical={false}
            />
            <XAxis
              dataKey="date"
              tick={{ fill: "#6b7280", fontSize: 12 }}
              tickFormatter={(date) =>
                new Date(date).toLocaleDateString("th-TH", {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              }
              label={{
                value: "ช่วงเวลา",
                position: "insideBottom",
                offset: -10,
                fill: "#6b7280",
                fontSize: 13,
                fontWeight: 500,
              }}
              axisLine={{ stroke: "#d1d5db" }}
            />

            <YAxis
              tick={{ fill: "#6b7280", fontSize: 12 }}
              label={{
                value: "จำนวนการจำแนกพันธุ์",
                angle: -90,
                position: "insideLeft",
                fill: "#6b7280",
                fontSize: 13,
                fontWeight: 500,
              }}
              axisLine={{ stroke: "#d1d5db" }}
              domain={[0, (dataMax) => dataMax * 2]}
            />

            <Tooltip
              labelFormatter={(date) =>
                new Date(date).toLocaleDateString("th-TH", {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              }
              formatter={(value) => [`${value} การจำแนก`, "ทั้งหมด"]}
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                backgroundColor: "white",
              }}
            />

            <Line
              type="monotone"
              dataKey="classification"
              stroke="#4f46e5"
              strokeWidth={2}
              dot={{ fill: "#4f46e5", strokeWidth: 1 }}
              activeDot={{
                fill: "#ffffff",
                stroke: "#4f46e5",
                strokeWidth: 1,
                r: 6,
              }}
              animationDuration={500}
            />

            <ReferenceLine y={0} stroke="#e5e7eb" />

            <Legend
              wrapperStyle={{ paddingTop: "20px" }}
              formatter={() => (
                <span style={{ color: "#4b5563", fontSize: "14px" }}>{"ความสัมพันธ์ระหว่างจำนวนการจำแนกพันธุ์กับช่วงเวลา"}</span>
              )}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ClassificationLineChart;
