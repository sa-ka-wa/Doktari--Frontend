import React, { useState } from "react";
import "./SearchBar.css";

const SearchBar = ({ onSearch, placeholder = "Search..." }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  const clearSearch = () => {
    setSearchTerm("");
    onSearch("");
  };

  return (
    <div className="search-bar">
      <div className="search-icon">🔍</div>
      <input
        type="text"
        value={searchTerm}
        onChange={handleChange}
        placeholder={placeholder}
        className="search-input"
      />
      {searchTerm && (
        <button className="clear-search" onClick={clearSearch}>
          ✕
        </button>
      )}
    </div>
  );
};

export default SearchBar;
