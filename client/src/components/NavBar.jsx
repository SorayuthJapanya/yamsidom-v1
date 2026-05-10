import React, { useEffect, useRef, useState } from "react";
import rmutllogo from "../assets/rmutl_logo.png";
import plantlogo from "../assets/plant_logo.png";
import { Link, useLocation } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { LogOut, MenuIcon } from "lucide-react";
import { userMenu, authMenu } from "../lib/navBarMenu";
import { useAuthUser, useLogoutUser } from "../api/AuthApi";
import { motion } from "framer-motion";

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const menuRef = useRef(null);
  const profileRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  const isAdmin = localStorage.getItem("userRole") === "ADMIN";

  const { data: authUser } = useAuthUser();

  const logoutMutation = useLogoutUser({
    queryClient,
    navigate,
  });

  const fileUrl = {
    ADMIN: `${
      import.meta.env.VITE_MAIN_URL
    }/คู่มือการใช้เว็ปไซต์สำหรับผู้ดูแลระบบ.pdf`,
    USER: `${
      import.meta.env.VITE_MAIN_URL
    }/คู่มือการใช้เว็ปไซต์สำหรับผู้ใช้งาน.pdf`,
  };

  const handleClickDowloadFile = (role) => {
    const url = fileUrl[role];
    window.open(url, "_blank");
  };

  const handleMenuClickOutside = (event) => {
    if (event.defaultPrevented) return;

    setTimeout(() => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }, 300);
  };

  const handleProfileClickOutside = (event) => {
    if (event.defaultPrevented) return;

    setTimeout(() => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }, 300);
  };

  useEffect(() => {
    if (isMenuOpen) {
      document.addEventListener("mousedown", handleMenuClickOutside);
    } else {
      document.removeEventListener("mousedown", handleMenuClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleMenuClickOutside);
    };
  }, [isMenuOpen]);

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
    <motion.nav
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="w-full h-20 flex items-center justify-center relative"
    >
      <div className="w-full h-full shadow-sm z-80">
        {/* container */}
        <div className="lg:max-w-[1280px] px-4 w-full mx-auto h-full flex justify-center items-center lg:justify-between">
          {/* Logo */}
          <Link to="/">
            <div className="flex gap-4">
              <img src={rmutllogo} alt="logo" className="w-9 h-16" />
              <img src={plantlogo} alt="logo" className="w-11 h-16" />
            </div>
          </Link>

          {/* Hambergur Menu for responsive web */}
          <button
            className="group absolute right-8 duration-300 px-2 py-2 rounded-full hover:bg-gray-100 active:bg-gray-200 lg:hidden text-gray-700 focus:outline-none cursor-pointer"
            onClick={() => {
              setIsMenuOpen(!isMenuOpen);
            }}
          >
            <MenuIcon />
          </button>

          {/* Menu */}
          <div
            ref={menuRef}
            className={`
              absolute top-20 right-8 z-50 w-56 md:w-72 bg-white rounded-lg py-4 font-medium text-lg
              transition-all duration-300 ease-in-out transform origin-top-right shadow-md
              ${
                isMenuOpen
                  ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
                  : "opacity-0 scale-0 -translate-y-2 pointer-events-none"
              }
              lg:static lg:flex lg:flex-row lg:items-center lg:justify-center
              lg:bg-transparent lg:shadow-none lg:opacity-100 lg:translate-y-0 lg:scale-100 lg:pointer-events-auto 
              ${authUser && "lg:w-auto"} lg:p-0 
            `}
          >
            {/* Profile (for mobile)*/}
            {authUser && (
              <div className="w-full lg:hidden">
                <div
                  onClick={() => {
                    navigate(`/profile/${authUser._id}`);
                    setIsMenuOpen(false);
                  }}
                  className="flex flex-col gap-2 px-4 items-center justify-center hover:bg-gray-100 py-4 border-b border-gray-500 mb-2 cursor-pointer lg:hidden"
                >
                  <label
                    htmlFor="Profile-info"
                    className="flex flex-col gap-2 "
                  >
                    <button
                      onClick={() => setIsProfileOpen(!isProfileOpen)}
                      className="p-[2px] bg-gray-600 rounded-full cursor-pointer"
                    >
                      <img
                        src={
                          authUser.profilePic
                            ? `${import.meta.env.VITE_SERVER_URL}/uploads/${
                                authUser.profilePic
                              }`
                            : "/avatar.png"
                        }
                        alt="profile"
                        className="size-12 md:size-15 text-base rounded-full"
                      />
                    </button>
                  </label>
                  <div className="flex gap-2 ">
                    <h4 className="font-semibold text-base md:text-lg">
                      {authUser.name}
                    </h4>
                    <span>&gt;</span>
                  </div>
                  <p className="font-normal text-base md:text-lg">
                    {authUser.email}
                  </p>
                </div>
              </div>
            )}

            {/* Menu */}
            <ul className="w-full">
              {authUser ? (
                <div className="w-full">
                  <div className="w-full flex flex-col space-y-2 lg:flex-row lg:space-y-0 lg:space-x-2">
                    {userMenu.map((menu, index) => {
                      // ถ้าเป็น menu แดชบอร์ดและไม่ใช่แอดมิน ให้ข้าม
                      if (menu.adminOnly && !isAdmin) {
                        return null;
                      }

                      return (
                        <li
                          key={index}
                          onClick={() => {
                            setIsMenuOpen(false);
                            navigate(menu.navigate);
                          }}
                          className={`hover:bg-gray-100 lg:hover:bg-transparent lg:hover:text-blue-500 px-4 py-3 lg:px-2 cursor-pointer duration-200 text-sm ${
                            location.pathname === menu.navigate
                              ? "text-blue-500"
                              : "text-gray-800"
                          }`}
                        >
                          {menu.menu}
                        </li>
                      );
                    })}
                    <button
                      onClick={() => handleClickDowloadFile(authUser.role)}
                      className="flex items-center justify-start lg:justify-center hover:bg-gray-100 lg:hover:bg-transparent lg:hover:text-blue-500 px-4 py-3 lg:px-2 cursor-pointer duration-200 text-sm mb-2"
                    >
                      คู่มือ
                    </button>
                  </div>
                </div>
              ) : (
                <div className="w-full">
                  <div className="w-full flex flex-col space-y-2 lg:flex-row lg:space-y-0 lg:space-x-[2rem] lg:justify-end">
                    {authMenu.map((menu, index) => (
                      <li
                        key={index}
                        onClick={() => {
                          setIsMenuOpen(false);
                          navigate(menu.navigate);
                        }}
                        className="w-full lg:w-max px-3 py-2 cursor-pointer duration-300 hover:bg-gray-100 hover:text-gray-800 lg:hover:text-white lg:hover:bg-blue-500 lg:active:bg-blue-700 lg:shadow-md lg:rounded-lg transition-all ease-in-out lg:hover:-translate-y-1 text-sm sm:text-base"
                      >
                        {menu.menu}
                      </li>
                    ))}
                  </div>
                </div>
              )}

              {authUser && (
                <li
                  onClick={() => {
                    logoutMutation.mutate();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full lg:hidden hover:bg-gray-100 px-4 py-3 border-t border-gray-500 cursor-pointer duration-200"
                >
                  <button className="flex items-center gap-4 cursor-pointer text-base md:text-lg">
                    <LogOut className="size-5 text-gray-500" />
                    <span>ออกจากระบบ</span>
                  </button>
                </li>
              )}
            </ul>

            <div className={`hidden lg:block lg:w-max`}>
              {/* User Info and Logout */}
              {authUser && (
                <div className="flex items-center gap-2 mt-4 lg:mt-0">
                  <div
                    onClick={() => {
                      setIsProfileOpen(!isProfileOpen);
                    }}
                    className="p-3 hover:bg-gray-100 rounded-full flex items-center transition-all ease-in-out hover:-translate-y-[1px] duration-300 cursor-pointer relative w-max"
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
                      <div
                        ref={profileRef}
                        className={`
      absolute right-[-40px] top-[60px] z-50 w-52 shadow-[0px_0px_10px_-5px_rgba(0,_0,_0,_0.8)]
      transition-all duration-300 ease-in-out origin-top-right transform
      ${
        isProfileOpen
          ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
          : "opacity-0 scale-0 -translate-y-2 pointer-events-none"
      }
    `}
                      >
                        <div className="bg-white py-2 rounded-md shadow-lg">
                          <ul className="flex flex-col gap-4 py-2 text-sm sm:text-base">
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
                                  className="size-7 rounded-full"
                                />
                                <p>ดูโปรไฟล์</p>
                              </div>
                            </li>

                            <li
                              onClick={() => {
                                logoutMutation.mutate();
                                setIsMenuOpen(false);
                                setIsProfileOpen(false);
                              }}
                              className="hover:bg-gray-100 px-4 py-3 cursor-pointer"
                            >
                              <div className="flex items-center gap-4">
                                <LogOut className="size-5 text-gray-500" />
                                <span>ออกจากระบบ</span>
                              </div>
                            </li>
                          </ul>
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
    </motion.nav>
  );
};

export default NavBar;
