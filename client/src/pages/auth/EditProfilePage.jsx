import UpdateUserForm from "../../components/auth/UpdateUserForm";

const EditProfilePage = () => {
  return (
    <div className="w-full min-h-160 bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-3xl mx-auto p-4 py-8">
        <UpdateUserForm />
      </div>
    </div>
  );
};

export default EditProfilePage;
