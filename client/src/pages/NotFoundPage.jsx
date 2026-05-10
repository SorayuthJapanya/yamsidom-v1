import { Link, useNavigate } from "react-router-dom";
import { useAuthUser } from "../api/AuthApi";

const NotFoundPage = () => {
  const navigate = useNavigate();

  const { data: authUser } = useAuthUser();

  if (!authUser) return navigate("/login");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-16">
      <h1 className="text-6xl font-bold text-blue-500 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">
        ไม่พบหน้าที่คุณต้องการ
      </h2>
      <p className="text-gray-600 mb-6 text-center">
        ขออภัย ไม่พบหน้าที่คุณต้องการ หรือหน้านั้นอาจถูกย้ายไปแล้ว
      </p>

      <Link
        to="/"
        className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition duration-200"
      >
        หน้าหลัก
      </Link>
    </div>
  );
};

export default NotFoundPage;
