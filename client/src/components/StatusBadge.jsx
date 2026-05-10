const StatusBadge = ({ status }) => {
  const statusStyles = {
    PENDING: "text-yellow-600 bg-yellow-100 border-yellow-400",
    POOR: "text-red-600 bg-red-100 border-red-400",
    FAIR: "text-orange-600 bg-orange-100 border-orange-400",
    GOOD: "text-green-600 bg-green-100 border-green-400",
    EXCELLECT: "text-blue-600 bg-blue-100 border-blue-400",
  };

  const statusLabels = {
    PENDING: "รอดำเนินการประเมินความถูกต้อง",
    POOR: "แย่",
    FAIR: "พอใช้",
    GOOD: "ดี",
    EXCELLECT: "ดีเยี่ยม",
  };
  return (
    <span
      className={`px-3 py-1.5 text-sm font-medium rounded-lg border ${
        statusStyles[status] || ""
      }`}
    >
      {statusLabels[status] || "ไม่ทราบสถานะ"}
    </span>
  );
};

export default StatusBadge;
