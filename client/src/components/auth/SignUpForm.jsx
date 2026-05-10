import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { Eye, EyeOff, Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSignupUser } from "../../api/AuthApi.js";

const SignupForm = () => {
  // set all fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  //   call backend useMutation ( POST, PUT, DELETE )
  const { mutate: signUpMutation, isLoading } = useSignupUser({ navigate });

  //   when click submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) return toast.error("รหัสผ่านไม่ตรงกัน");
    signUpMutation({ name, email, password, confirmPassword });
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
        สมัครสมาชิก
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium text-gray-700">
            ชื่อ-สกุล
          </label>
          <input
            type="text"
            placeholder="กรุณากรอกชื่อ-สกุล"
            value={name}
            id="name"
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 outline-none"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-gray-700">
            อีเมล
          </label>
          <input
            type="email"
            placeholder="example@gmail.com"
            value={email}
            id="email"
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 outline-none"
            required
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="password"
            className="text-sm font-medium text-gray-700"
          >
            รหัสผ่าน
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="กรุณากรอกรหัสผ่าน"
              value={password}
              id="password"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 outline-none"
              required
            />
            <div
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer hover:bg-gray-100 p-1 rounded-full transition-all duration-200"
            >
              {!showPassword ? (
                <Eye className="size-5 text-gray-500" />
              ) : (
                <EyeOff className="size-5 text-gray-500" />
              )}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="confirmPassword"
            className="text-sm font-medium text-gray-700"
          >
            ยืนยันรหัสผ่าน
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="กรุณายืนยันรหัสผ่าน"
              value={confirmPassword}
              id="confirmPassword"
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 outline-none"
              required
            />
            <div
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer hover:bg-gray-100 p-1 rounded-full transition-all duration-200"
            >
              {!showConfirmPassword ? (
                <Eye className="size-5 text-gray-500" />
              ) : (
                <EyeOff className="size-5 text-gray-500" />
              )}
            </div>
          </div>
        </div>

        <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
          <p className="text-blue-800 text-sm">
            <span className="font-medium">หมายเหตุ:</span>{" "}
            รหัสผ่านต้องมีตัวอักษรพิมพ์ใหญ่และตัวเลขอย่างน้อยอย่างละหนึ่งตัว
          </p>
          <p className="text-blue-800 text-sm mt-2">
            <span className="font-medium">ตัวอย่าง:</span>{" "}
            Example123
          </p>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition duration-200 flex items-center justify-center space-x-2 mt-4 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader className="size-5 animate-spin" />
          ) : (
            "สมัครสมาชิก"
          )}
        </button>
      </form>
    </div>
  );
};

export default SignupForm;
