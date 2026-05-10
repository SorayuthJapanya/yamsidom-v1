import FolderCard from "@/components/admin/card/FolderCard";
import Title from "@/components/admin/Title";

const ManageGalleryPage = () => {
  return (
    <div className="min-h-screen px-6 py-4 sm:px-12 sm:py-8">
      <header className="flex flex-col justify-center items-start mb-4 md:mb-8">
        <Title
          title="ระบบจัดการคลังรูปภาพ"
          subTitle="จัดการโฟลเดอร์และรูปภาพสายพันธุ์มันพื้นบ้านลงในระบบ"
        />
      </header>

      <div className="w-full max-w-md sm:max-w-xl md:max-w-4xl lg:max-w-5xl pt-4">
        <FolderCard />
      </div>
    </div>
  );
};

export default ManageGalleryPage;
