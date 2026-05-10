import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { AlignLeftIcon, AlignRightIcon, Home, LogOut } from "lucide-react";
import { useAuthUser, useLogoutUser } from "../../api/AuthApi";
import { useQueryClient } from "@tanstack/react-query";

const NavBarAdmin = ({ expanded, setExpanded }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: authUser } = useAuthUser();
  const logoutMutation = useLogoutUser(queryClient, navigate);

  const handleProfileClickOutside = (event) => {
    if (event.defaultPrevented) return;

    setTimeout(() => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }, 300);
  };

  useEffect(() => {
    if (isProfileOpen) {
      document.addEventListener("mousedown", handleProfileClickOutside);
    } else {
      document.removeEventListener("mousedown", handleProfileClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleProfileClickOutside);
    };
  }, [isProfileOpen]);

  return (
    <div className="w-full h-20 flex items-center justify-center sticky sm:flex z-80">
      <div className="w-full h-full bg-white shadow-sm ">
        <div className="relative w-full px-4 mx-auto h-full flex justify-between items-center">
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1.5 rounded-lg hover:bg-gray-100 active:bg-gray-200 text-gray-700 focus:outline-none cursor-pointer"
          >
            {expanded ? <AlignRightIcon /> : <AlignLeftIcon />}
          </button>

          <div className="w-max flex items-center gap-4">
            <Link to="/" className="text-gray-800 hover:text-blue-500 cursor-pointer duration-200 text-sm md:text-base">หน้าหลัก</Link>
            {/* User Info and Logout */}
            {authUser && (
              <div className="flex items-center gap-2 mr-0 sm:mr-8 md:mr-12 ">
                <div
                  onClick={() => {
                    setIsProfileOpen(!isProfileOpen);
                  }}
                  className="p-3 hover:bg-gray-100 rounded-full flex items-center transition-all ease-in-out hover:-translate-y-[1px] duration-300 cursor-pointer relative"
                >
                  <button className="p-[2px] bg-gray-600 rounded-full cursor-pointer group relative mr-4">
                    <img
                      src={
                        authUser.profilePic
                          ? `${import.meta.env.VITE_SERVER_URL}/uploads/${
                              authUser.profilePic
                            }`
                          : "/avatar.png"
                      }
                      alt="profile"
                      className="size-8 object-cover rounded-full"
                    />

                    {/* Dropdown profile menu */}
                    <div className="relative z-100 transform scale-100">
                      <div
                        ref={profileRef}
                        className={`
      absolute right-[-60px] sm:right-[-40px] top-5 z-100 w-52 shadow-[0px_0px_10px_-5px_rgba(0,_0,_0,_0.8)]
      transition-all duration-300 ease-in-out origin-top-right transform
      ${
        isProfileOpen
          ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
          : "opacity-0 scale-0 -translate-y-2 pointer-events-none"
      }
    `}
                      >
                        <div className="bg-white py-2 rounded-md shadow-lg text-sm sm:text-base">
                          <ul className="flex flex-col gap-4 py-2">
                            <li
                              onClick={() => {
                                navigate(`/profile/${authUser._id}`);
                                setIsProfileOpen(false);
                              }}
                              className="hover:bg-gray-100 px-4 py-3 cursor-pointer"
                            >
                              <div className="flex gap-4 items-center">
                                <img
                                  src={
                                    authUser.profilePic
                                      ? `${
                                          import.meta.env.VITE_SERVER_URL
                                        }/uploads/${authUser.profilePic}`
                                      : "/avatar.png"
                                  }
                                  alt="profile"
                                  className="size-8 rounded-full"
                                />
                                <p>ดูโปรไฟล์</p>
                              </div>
                            </li>

                            <li
                              onClick={() => {
                                logoutMutation.mutate();
                                setIsProfileOpen(false);
                              }}
                              className="hover:bg-gray-100 px-4 py-3 cursor-pointer"
                            >
                              <div className="flex items-center gap-4">
                                <LogOut className="size-6 text-gray-500" />
                                <span>ออกจากระบบ</span>
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </button>
                  <p className="font-normal text-base">{authUser.name}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBarAdmin;
