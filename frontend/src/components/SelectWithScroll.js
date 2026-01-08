import React from "react";
import Select from "react-select";

function SelectWithScroll({ options, value, onChange }) {
  // Chuyển options thành {value,label}
  const formattedOptions = options.map((opt) => ({ value: opt, label: opt }));

  // Tìm option có value trùng
  const selectedOption = formattedOptions.find(opt => opt.value === value) || null;

  return (
    <Select
      options={formattedOptions}
      value={selectedOption}
      onChange={(selected) => onChange(selected ? selected.value : "")}
      placeholder="-- Chọn --"
      isSearchable
      menuPlacement="auto"
      styles={{
        menuList: (provided) => ({
          ...provided,
          maxHeight: 150,
        }),
      }}
    />
  );
}

export default SelectWithScroll;
