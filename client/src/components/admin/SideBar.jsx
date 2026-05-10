import { Link, NavLink, useLocation } from "react-router-dom";
import { useAuthUser } from "../../api/AuthApi";
import { adminMenu } from "../../lib/navBarMenu";
import { ChevronsRightIcon } from "lucide-react";
import rmutllogo from "../../assets/rmutl_logo.png";
import plantlogo from "../../assets/plant_logo.png";

const SideBar = ({ expanded, setExpanded }) => {
  const { data: authUser } = useAuthUser();
  const location = useLocation();
  return (
    <div
      className={`min-h-screen flex-col items-center border-r border-gray-400 text-sm bg-white transition-all duration-300 ease-in-out ${
        expanded ? "w-44 sm:w-60 flex" : "hidden sm:block w-20"
      }`}
    >
      <div className="group relative w-full">
        <div className="flex items-center justify-center gap-2 py-2 shadow-sm">
          <Link to="/">
            <div
              className={`flex gap-2 items-center ${
                expanded ? "flex" : "hidden sm:block"
              }
              }`}
            >
              <img src={rmutllogo} alt="logo" className="w-9 h-16" />
              {expanded && (
                <img src={plantlogo} alt="logo" className="w-11 h-16" />
              )}
            </div>
          </Link>
        </div>

        <label
          className={`my-4 flex flex-col gap-2 items-center ${
            expanded ? "w-full" : "hidden"
          } transition-all duration-300 ease-in-out`}
        >
          <button className="p-[2px] bg-gray-600 rounded-full cursor-pointer">
            <img
              src={
                authUser?.profilePic
                  ? `${import.meta.env.VITE_SERVER_URL}/uploads/${
                      authUser?.profilePic
                    }`
                  : "/avatar.png"
              }
              alt="profile"
              className="size-8 md:size-12 text-base rounded-full object-cover"
            />
          </button>
          <p className="text-sm sm:text-base">{authUser?.name}</p>
        </label>

        <div className={`${expanded ? "w-full" : "hidden sm:block sm:w-20"} `}>
          {adminMenu.map((menu, index) => {
            const isActive = location.pathname === menu.navigate;
            return (
              <NavLink
                key={index}
                to={menu.navigate}
                className={`relative flex items-center justify-center gap-2 w-full py-3 ${
                  expanded ? "first:mt-6 pl-4" : "first:mt-0"
                } ${
                  isActive ? "bg-blue-700/10 text-blue-700" : "text-gray-600 "
                }`}
                onClick={() => {
                  if (window.innerWidth < 768) {
                    setExpanded(false);
                  } else {
                    setExpanded(true);
                  }
                }}
              >
                <ChevronsRightIcon
                  className={`size-5 ${
                    isActive ? "text-blue-700" : "text-gray-600"
                  }`}
                />
                <span
                  className={`flex gap-2 items-center ${
                    expanded ? "w-full block" : "hidden"
                  }`}
                >
                  {menu.menu}
                </span>
                <div
                  className={`${
                    isActive ? "bg-blue-700" : ""
                  } w-1.5 h-8 rounded-lg right-0 absolute ${
                    expanded ? "block" : "hidden"
                  }`}
                ></div>
              </NavLink>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SideBar;
