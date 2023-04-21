import { useMemo, useState } from "react";
import debounce from "lodash.debounce";
import "./UserSearch.scss";
import UserSearchResults from "./UserSearchResults";

const UserSearch = () => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  const handleSearchQueryChanged = useMemo(
    () => debounce((e) => commitSearch(e), 300),
    []
  );

  const commitSearch = async (e) => {
    console.log(e)
    const token = localStorage.getItem("jwt");

    if (e.target.value.trim() !== "") {
      const API_BASE_URL = "https://api.chirp.koenidv.de";
      const response = await fetch(
        `${API_BASE_URL}/v1/search/users/${e.target.value}`,
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
    <div className="search-form">
      <input
        type="text"
        onChange={handleSearchQueryChanged}
        placeholder="Search users"
      />
      <UserSearchResults visible={dropdownVisible} items={searchResults} />
    </div>
  );
};

export default UserSearch;
