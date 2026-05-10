import React, { useEffect, useMemo, useRef, useState } from "react";
import debounce from "lodash/debounce";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../../lib/axios";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const UserSearch = ({ onUserSelected, value }) => {
  const [inputValue, setInputValue] = useState(value || "");
  const [debouncedValue, setDebouncedValue] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const userRef = useRef(null);

  const debouncedSearch = useMemo(() =>
    debounce((value) => {
      setDebouncedValue(value);
    }, 500)
  );

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["searchUsers", debouncedValue],
    queryFn: async () => {
      const res = await axiosInstance.get("/auth/allclient", {
        params: { name: debouncedValue },
      });
      return res.data?.users || [];
    },
    enabled: (debouncedValue ?? "").length > 0,
    onError: (error) => {
      toast.error(error.response?.data?.message || "User not found");
    },
  });

  const handleSelectedUser = (user) => {
    setInputValue(user);
    onUserSelected(user);
  };

  useEffect(() => {
    debouncedSearch(inputValue);
    return () => {
      debouncedSearch.cancel();
    };
  }, [inputValue, debouncedSearch]);

  useEffect(() => {
    setInputValue(value || "");
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userRef.current && !userRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <div ref={userRef} className="w-40 sm:w-64 mt-6 sm:mt-0 relative z-50">
      <div className="relative">
        <input
          type="text"
          value={inputValue}
          placeholder="ตย.สรยุทธ"
          onChange={(e) => {
            setInputValue(e.target.value);
            setIsDropdownOpen(true);
          }}
          className="border border-gray-400 outline-none px-2 py-1 sm:py-2 sm:px-3 rounded-md w-full"
        />

        {isLoading && (
          <div className="absolute right-3 top-2.5">
            <Loader2 className="animate-spin w-5 h-5 text-gray-500" />
          </div>
        )}

        {debouncedValue && users.length > 0 && isDropdownOpen && (
          <ul className="absolute top-12 w-full bg-white shadow rounded-md max-h-48 overflow-y-auto z-[9999] border border-gray-200">
            {users.map((user) => (
              <li
                key={user._id}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  handleSelectedUser(user.name);
                  setIsDropdownOpen(false);
                }}
              >
                {user.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default UserSearch;
