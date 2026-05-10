import React, { useState } from "react";
import { Eye, EyeOff, Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLoginUser } from "../../api/AuthApi";

const LogInForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const { mutate: loginMutation, isLoading } = useLoginUser({ navigate });

  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation({ email, password });
  };

  return (
    <div className="min-w-xs sm:min-w-[440px] mx-auto bg-white p-8 rounded-xl shadow-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
        เข้าสู่ระบบ
      </h2>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col space-y-6 my-12 w-full"
      >
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

        {/* Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition duration-200 flex items-center justify-center space-x-2 mt-4 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader className="size-5 animate-spin " />
          ) : (
            "เข้าสู่ระบบ"
          )}
        </button>
      </form>
    </div>
  );
};

export default LogInForm;
