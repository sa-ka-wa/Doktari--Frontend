import React from "react";

const Input = ({
  label,
  type = "text",
  name, // Add this line
  value,
  onChange,
  placeholder,
}) => {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="font-semibold text-sm">{label}</label>}
      <input
        type={type}
        name={name} // Add this line
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
};

export default Input;
