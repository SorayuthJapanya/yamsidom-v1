import { useDeleteUser } from "../../../api/admin/UserDataApi";
import { useNavigate } from "react-router-dom";
import { th } from "date-fns/locale";
import { format } from "date-fns";
import { Edit, Trash2 } from "lucide-react";
import Pagination from "../../../components/Pagination";
import Swal from "sweetalert2";

const TableManageUser = ({ usersData, refetchSelectUser, setCurrentPage }) => {
  const navigate = useNavigate();

  const { mutate: deleteUser } = useDeleteUser({
    refetchSelectUser: refetchSelectUser,
  });

  const handleEdit = (userId) => {
    navigate(`/admin/profile-user/${userId}`);
  };

  const handleDelete = async (userId) => {
    const result = await Swal.fire({
      title: "คุณแน่ใจหรือไม่?",
      text: "คุณต้องการลบผู้ใช้นี้หรือไม่?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "ใช่, ฉันต้องการ!",
      cancelButtonText: "ยกเลิก",
    });
    if (result.isConfirmed) {
      await deleteUser({ userId: userId });
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg px-6 py-4 w-full min-w-[700px] mr-6">
      {/* Table */}
      <div className="w-full">
        <table className="w-full text-sm sm:text-base">
          <thead>
            <tr className="hover:bg-gray-100 border-b-2 font-medium text-gray-700 border-gray-300">
              <td className="px-4 py-2">#</td>
              <td className="px-4 py-2">ชื่อ</td>
              <td className=" px-4 py-2">อีเมลล์</td>
              <td className=" px-4 py-2">วันที่สมัคร</td>
              <td className=" px-4 py-2">สิทธิ์การใช้งาน</td>
              <td className="text-center px-4 py-2">การดำเนินการ</td>
            </tr>
          </thead>
          <tbody>
            {usersData?.users
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .map((user, index) => (
                <tr
                  key={user._id}
                  className={`hover:bg-gray-100 text-gray-600 ${
                    index !== usersData.length - 1
                      ? "border-b border-gray-300"
                      : ""
                  }`}
                >
                  <td className="px-2 sm:px-4">{index + 1}</td>
                  <td className="px-2 sm:px-4 ">{user.name}</td>
                  <td className="px-2 sm:px-4 ">{user.email}</td>
                  <td className="px-2 sm:px-4 ">
                    {(() => {
                      const date = new Date(user.createdAt);
                      const thaiYear = date.getFullYear() + 543;
                      return `${format(date, "dd MMM", {
                        locale: th,
                      })} ${thaiYear}`;
                    })()}
                  </td>
                  <td className="px-2 sm:px-4">
                    {user.role === "ADMIN" ? "ผู้ควบคุมระบบ" : "ผู้ใช้งาน"}
                  </td>
                  <td className="px-2 sm:px-4 py-4 sm:py-6 flex items-center justify-center gap-4">
                    <button
                      onClick={() => handleEdit(user._id)}
                      className="bg-blue-500 text-white p-1.5 rounded-full hover:bg-blue-700 cursor-pointer duration-300 transitaion-all ease-in-out hover:-translate-y-0.5"
                    >
                      <Edit className="size-4 sm:size-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="bg-red-500 text-white p-1.5 rounded-full hover:bg-red-700 cursor-pointer duration-300 transitaion-all ease-in-out hover:-translate-y-0.5"
                    >
                      <Trash2 className="size-4 sm:size-5" />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <footer>
        <div className="flex justify-between items-center mt-4 text-xs sm:text-sm">
          <div>
            <p className="text-gray-600">
              Showing{" "}
              <span className="font-medium">{usersData?.users?.length}</span>{" "}
              out of{" "}
              <span className="font-medium">{usersData?.totalUsers}</span>{" "}
              entries
            </p>
          </div>
          <div className="flex gap-2">
            <Pagination
              totalPages={usersData?.totalPages}
              currentPage={usersData?.currentPage}
              handlePageChange={handlePageChange}
            />
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TableManageUser;
