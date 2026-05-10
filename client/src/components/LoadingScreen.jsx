import { Loader2 } from "lucide-react";
import { memo, useMemo } from "react";

const LoadingScreen = memo(({ completedCount, totalCount }) => {
  const percentage = useMemo(
    () => Math.round((completedCount / totalCount) * 100),
    [completedCount, totalCount]
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-160 space-y-6">
      <div className="flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
      </div>

      <div className="w-80 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-2 bg-blue-500 transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="text-center space-y-2">
        <div className="text-xl font-semibold text-gray-800">
          กำลังประมวลผลภาพทั้งหมด...
        </div>
        <div className="text-sm text-gray-600">
          ประมวลผลเสร็จสิ้น {completedCount} จาก {totalCount} ภาพ
        </div>
        <div className="text-lg font-medium text-blue-600">
          {percentage}% เสร็จสิ้น
        </div>
      </div>
    </div>
  );
});

export default LoadingScreen;
