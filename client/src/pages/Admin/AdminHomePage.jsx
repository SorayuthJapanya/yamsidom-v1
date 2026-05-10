import Title from "../../components/admin/Title";
import StatCard from "../../components/admin/card/StatCard";
import UserRoleBarChart from "../../components/admin/charts/UserRoleBarChart";
import ClassificationLineChart from "../../components/admin/charts/ClassificationLineChart";
import AdminActive from "../../components/admin/AdminActive";
import ValidationCard from "@/components/admin/card/ValidationCard";

const AdminHomePage = () => {
  return (
    <div className="min-h-screen px-6 py-4 sm:px-12 sm:py-8">
      {/* Page Header */}
      <div className="flex flex-col justify-center items-start mb-4 md:mb-8">
        <Title
          title="แดชบอร์ดผู้ดูแลระบบ"
          subTitle="จัดการผู้ใช้งาน ข้อมูลพันธุ์ และดูการวิเคราะห์จากแดชบอร์ด"
        />
      </div>

      {/* Dashboard Analysis */}
      <div className="max-w-5xl w-full">
        {/* Stats Cards */}
        <StatCard />

        {/* Validation Cards */}
        {/* <ValidationCard /> */}

        {/* User Role Distribution Bar Chart */}
        <UserRoleBarChart />

        {/* Statistics Classifier Line Chart */}
        <ClassificationLineChart />

        {/* Admin Actions */}
        <AdminActive />
      </div>
    </div>
  );
};

export default AdminHomePage;
