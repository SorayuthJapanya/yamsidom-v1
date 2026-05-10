import React, { useEffect, useMemo, useRef, useState } from "react";
import { debounce } from "lodash";
import { Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../../lib/axios";
import toast from "react-hot-toast";

const LocalNameSearch = ({ onLocalNameSelected }) => {
  const [inputValue, setInputValue] = useState("");
  const [debouncedValue, setDebounvedValue] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const localNameRef = useRef(null);

  const debouncedSearch = useMemo(() =>
    debounce((value) => {
      setDebounvedValue(value);
    }, 500)
  );

  useEffect(() => {
    debouncedSearch(inputValue);
    return () => {
      debouncedSearch.cancel();
    };
  }, [inputValue, debouncedSearch]);

  const { data: localNames = [], isLoading } = useQuery({
    queryKey: ["searchLocalName", debouncedValue],
    queryFn: async () => {
      const res = await axiosInstance.get("/species/allbyquery", {
        params: {
          local_Name: debouncedValue,
        },
      });
      return res.data?.species || [];
    },
    enabled: (debouncedValue ?? "").length > 0,
    onError: (error) => {
      toast.error(error.response?.data?.message || "User not found");
    },
  });

  const handleSelectedLocalName = (localName) => {
    setInputValue(localName);
    onLocalNameSelected(localName);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        localNameRef.current &&
        !localNameRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={localNameRef} className="relative w-40 md:w-64">
      <input
        type="text"
        value={inputValue}
        placeholder="ตย.มันอ้อน"
        onChange={(e) => {
          setInputValue(e.target.value);
          setIsDropdownOpen(true);
        }}
        className="text-xs sm:text-sm px-3 py-1.5 border border-gray-400 sm:px-4 sm:py-2 rounded-md w-full outline-none text-gray-700"
      />

      {isLoading && (
        <div className="absolute right-3 top-2.5">
          <Loader2 className="animate-spin size-4 sm:size-5 text-gray-500" />
        </div>
      )}

      {debouncedValue && localNames.length > 0 && isDropdownOpen && (
        <ul className="absolute top-12 w-full bg-white shadow rounded-md max-h-48 overflow-y-auto z-10">
          {localNames.map((local) => (
            <li
              key={local._id}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                handleSelectedLocalName(local.localName);
                setIsDropdownOpen(false);
              }}
            >
              {local.localName}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LocalNameSearch;
