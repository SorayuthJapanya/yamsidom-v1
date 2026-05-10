
import AddSpeciesForm from "../../components/species/AddSpeciesForm";
import Title from "../../components/admin/Title";

const AddSpeciePage = () => {
  return (
    <div className="min-h-screen px-6 py-4 sm:px-12 sm:py-8">
      <header className="flex flex-col justify-center items-start mb-4 md:mb-8">
        <Title
          title="เพิ่มข้อมูลสายพันธุ์ใหม่"
          subTitle="กรุณากรอกแบบฟอร์มด้านล่างเพื่อเพิ่มข้อมูลพันธุ์มันพื้นบ้านลงในระบบ"
        />
      </header>

      <AddSpeciesForm />
    </div>
  );
};

export default AddSpeciePage;
