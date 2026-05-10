import AdminSignUpForm from "../../components/admin/auth/AdminSignUpForm";
import Title from "../../components/admin/Title";

const AddUserPage = () => {
  return (
    <div className="min-h-screen px-6 py-4 sm:px-12 sm:py-8">
      <header className="flex flex-col justify-center items-start mb-4 md:mb-8">
        <Title
          title="เพิ่มผู้ใช้งานใหม่"
          subTitle="กรุณากรอกแบบฟอร์มด้านล่างเพื่อเพิ่มข้อมูลผู้ใช้งานลงในระบบ"
        />
      </header>

      <AdminSignUpForm />
    </div>
  );
};

export default AddUserPage;
