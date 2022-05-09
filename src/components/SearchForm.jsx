import "../css/SearchForm.css";
import React, { useState } from "react";

const SearchForm = (props) => {
  const [searchValue, setSearchValue] = useState("");

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchValue) {
      if (props.onMultiSearch) {
        props.onMultiSearch(searchValue);
      }
      if (props.onMovieSearch) {
        props.onMovieSearch(searchValue);
      }
      if (props.onTVSearch) {
        props.onTVSearch(searchValue);
      }
      setSearchValue("");
    }
  };

  return (
    <form id="search-form" onSubmit={handleSubmit}>
      <input
        type="text"
        className="search-form-search-bar"
        placeholder="Search..."
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
      />
      <div className="button-container">
        <button className="btn">Search</button>
      </div>
    </form>
  );
};

export default SearchForm;
