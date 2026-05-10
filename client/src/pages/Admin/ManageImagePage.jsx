import SpeciesImageCard from "@/components/admin/card/SpeciesImageCard";
import Title from "@/components/admin/Title";
import { useParams } from "react-router-dom";

const ManageImagePage = () => {
  const { id } = useParams();
  return (
    <div className="min-h-screen px-6 py-4 sm:px-12 sm:py-8">
      <header className="flex flex-col justify-center items-start mb-4 md:mb-8">
        <Title
          title={`คลังรูปภาพ ${id}`}
          subTitle="ดูและจัดการบัญชีผู้ดูแลระบบและผู้ใช้งานทั่วไป รวมถึงสิทธิ์การเข้าถึง"
        />
      </header>

      <div className="w-full max-w-md sm:max-w-xl md:max-w-4xl lg:max-w-5xl">
        <SpeciesImageCard />
      </div>
    </div>
  );
};

export default ManageImagePage;
