import React, { useEffect, useMemo, useRef, useState } from "react";
import { debounce } from "lodash";
import { Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../../lib/axios";
import toast from "react-hot-toast";

const FolderNameSearch = ({
  onLocalNameSelected,
  inputValue,
  setInputValue,
}) => {
  const [debouncedValue, setDebounvedValue] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [folderName, setfolderName] = useState([]);
  const folderNameRef = useRef(null);

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

  const { data: getFolderName, isLoading } = useQuery({
    queryKey: ["searchFolderName", debouncedValue],
    queryFn: async () => {
      const res = await axiosInstance.get("/gallery/folder-speceis", {
        params: {
          folderName: debouncedValue,
        },
      });
      return res.data.folders;
    },
    enabled: (debouncedValue ?? "").length > 0,
    onError: (error) => {
      toast.success(error.response?.data?.message || "ไม่พบชื่อโฟลเดอร์");
    },
  });

  const handleSelectedLocalName = (localName) => {
    setInputValue(localName);
    onLocalNameSelected(localName);
  };

  useEffect(() => {
    if (getFolderName) {
      setfolderName(getFolderName);
    }
  }, [getFolderName]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        folderNameRef.current &&
        !folderNameRef.current.contains(event.target)
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
    <div ref={folderNameRef} className="relative w-36 sm:w-48 md:w-60">
      <input
        type="text"
        value={inputValue}
        placeholder="ตย.มันอ้อน"
        onChange={(e) => {
          setInputValue(e.target.value);
          setIsDropdownOpen(true);
        }}
        className="text-xs sm:text-sm px-2 py-1.5 border border-gray-400 sm:px-3 sm:py-2 rounded-md w-full outline-none text-gray-700"
      />

      {isLoading && (
        <div className="absolute right-3 top-2.5">
          <Loader2 className="animate-spin size-4 sm:size-5 text-gray-500" />
        </div>
      )}

      {debouncedValue && folderName.length > 0 && isDropdownOpen && (
        <ul className="absolute top-12 w-full bg-white shadow rounded-md max-h-48 overflow-y-auto z-10">
          {folderName.map((name) => (
            <li
              key={name.name}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                handleSelectedLocalName(name.name);
                setIsDropdownOpen(false);
              }}
            >
              {name.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FolderNameSearch;
