import React from "react";

const PredictedFilter = ({
  predicted,
  filterPredicted,
  setFilterPredicted,
}) => {
  const handleCheckboxChange = (value) => {
    if (filterPredicted.includes(value)) {
      setFilterPredicted(filterPredicted.filter((item) => item !== value));
    } else {
      setFilterPredicted([...filterPredicted, value]);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {predicted.map((species) => {
        const checked = filterPredicted.includes(species);
        return (
          <div
            key={species}
            onClick={() => handleCheckboxChange(species)}
            className="flex items-center py-1 px-1 hover:bg-gray-100 cursor-pointer select-none"
          >
            <label
              className="flex items-center gap-2 w-full cursor-pointer"
              onClick={(e) => e.stopPropagation()} // ป้องกันไม่ให้ event ซ้อน
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => handleCheckboxChange(species)}
                className="w-4 h-4 accent-blue-600"
              />
              <span className="text-gray-700">{species}</span>
            </label>
          </div>
        );
      })}
    </div>
  );
};

export default PredictedFilter;
