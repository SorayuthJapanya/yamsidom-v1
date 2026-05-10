import { Toaster } from "react-hot-toast";
import { Outlet } from "react-router-dom";
import NavBarAdmin from "../components/admin/NavBarAdmin";
import Footer from "../components/Footer";
import SideBar from "../components/admin/SideBar";
import { useEffect, useState } from "react";

const AdminLayout = () => {
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setExpanded(false);
      } else {
        setExpanded(true);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial check

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <div className="w-full bg-gray-50 flex relation min-h-screen">
        <SideBar expanded={expanded} setExpanded={setExpanded} />
        <div className={"flex-1 overflow-y-auto"}>
          <NavBarAdmin expanded={expanded} setExpanded={setExpanded} />
          <Outlet />
        </div>
        <Toaster />
      </div>
      <Footer />
    </>
  );
};

export default AdminLayout;
