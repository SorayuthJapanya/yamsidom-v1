import React from "react";
import { Link } from "react-router-dom";
import SignupForm from "../../components/auth/SignUpForm";

const SignupPage = () => {
  const isAdmin = localStorage.getItem("userRole") === "ADMIN";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="w-full max-w-xl mx-auto flex flex-col items-center justify-center my-10 px-6">
        <SignupForm />
        <div className="pt-4">
          {!isAdmin && (
            <p className="text-main">
              ฉันมีบัญชีอยู่แล้ว{" "}
              <Link to="/login" className="text-violet-800 cursor-pointer">
                เข้าสู่ระบบ
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
