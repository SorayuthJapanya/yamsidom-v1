import React from "react";
import EditSpeciesForm from "../../components/species/EditSpeciesForm";
import Title from "@/components/admin/Title";

const EditSpeciesPage = () => {
  return (
    <div className="min-h-screen px-6 py-4 sm:px-12 sm:py-8">
      <header className="flex flex-col justify-center items-start mb-4 md:mb-8">
        <Title
          title="แก้ไขข้อมูลสายพันธุ์"
          subTitle="กรอกแบบฟอร์มด้านล่างเพื่อแก้ไขข้อมูลชนิดพันธุ์"
        />
      </header>

      <EditSpeciesForm />
    </div>
  );
};

export default EditSpeciesPage;
