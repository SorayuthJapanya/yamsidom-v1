import { Link } from "react-router-dom";
import UserSearch from "../../components/search/UserSearch";
import Title from "../../components/admin/Title";
import { useSelectUser } from "../../api/admin/UserDataApi";
import { useEffect, useState } from "react";
import TableManageUser from "../../components/admin/table/TableManageUser";

const ManageAdmin = () => {
  const [selectedUser, setSelectedUser] = useState("");
  const [isSearch, setIsSearch] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: usersData,
    error,
    refetch: refetchSelectUser,
  } = useSelectUser({ selectedUser, currentPage });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  return (
    <div className="min-h-screen px-6 py-4 sm:px-12 sm:py-8">
      <header className="flex flex-col justify-center items-start mb-4 md:mb-8">
        <Title
          title="ระบบจัดการผู้ใช้งาน"
          subTitle="ดูและจัดการบัญชีผู้ดูแลระบบและผู้ใช้งานทั่วไป รวมถึงสิทธิ์การเข้าถึง"
        />
      </header>

      {/* Menu */}
      <div className="flex flex-col justify-start items-center w-full">
        {error ? (
          <p className="text-red-500">{error}</p>
        ) : usersData?.length === 0 ? (
          <p className="text-gray-600">ไม่พบข้อมูลผู้ใช้งาน</p>
        ) : (
          <div className="w-full">
            <nav className="flex  flex-col sm:flex-row gap-4 justify-end items-start mb-4">
              {/* Search User */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-center gap-2">
                <UserSearch
                  onUserSelected={(name) => {
                    setSelectedUser(name);
                    setIsSearch(true);
                  }}
                />
                <div className="flex gap-2 mt-2 sm:mt-0">
                  {isSearch && (
                    <button
                      onClick={() => setSelectedUser("")}
                      className="text-sm sm:text-base px-3 py-2 sm:px-4 sm:py-2 bg-green-500 text-white rounded-md hover:bg-green-700 cursor-pointer active:bg-green-900 duration-200"
                    >
                      รีเซ็ท
                    </button>
                  )}
                  <Link to={"/admin/add-user"}>
                    <button
                      type="button"
                      className="text-sm sm:text-base px-3 py-2 sm:px-4 sm:py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 cursor-pointer active:bg-blue-900 duration-300 transitaion-all ease-in-out hover:-translate-y-1"
                    >
                      เพิ่มผู้ใช้งาน
                    </button>
                  </Link>
                </div>
              </div>
            </nav>

            <TableManageUser
              usersData={usersData}
              setCurrentPage={setCurrentPage}
              refetchSelectUser={refetchSelectUser}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageAdmin;
