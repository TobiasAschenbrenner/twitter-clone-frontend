import { useState } from "react";
import "./UserSearch.scss";
import UserSearchResults from "./UserSearchResults";

const UserSearch = () => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("jwt");

    if (searchValue.trim() !== "") {
      const API_BASE_URL = "https://api.chirp.koenidv.de";
      const response = await fetch(
        `${API_BASE_URL}/v1/search/users/${searchValue}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();

      if (data) {
        setSearchResults(data);
        setDropdownVisible(true);
      } else {
        setSearchResults([]);
        setDropdownVisible(false);
      }
    } else {
      setSearchResults([]);
      setDropdownVisible(false);
    }
  };

  return (
    <form className="search-form" onSubmit={handleSearchSubmit}>
      <input
        type="text"
        value={searchValue}
        onChange={handleSearchChange}
        placeholder="Search users"
      />
      <UserSearchResults
        visible={dropdownVisible}
        items={searchResults}
      />
    </form>
  );
};

export default UserSearch;
