import React from "react";
import { Link } from "react-router-dom";
import LogInForm from "../../components/auth/LogInForm";

const LoginPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
      <LogInForm />
      <p className="pt-4">
        ยังไม่มีบัญชีใช่ไหม?{" "}
        <Link to="/signup" className="text-violet-800 cursor-pointer">
          ลงชื่อเข้าใช้
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;
