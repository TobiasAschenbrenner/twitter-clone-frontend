import { useState } from "react";
import "./UserSearch.scss";

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

  const renderDropdownList = () => {
    if (!dropdownVisible) {
      return null;
    }

    return (
      <div className="search-dropdown">
        {searchResults.map((user) => (
          <a
            href={`/${user.username}`}
            className="search-result"
            key={user.username}
          >
            <div>
              <img src={user.profile_image_url} alt="avatar" />
            </div>
            <div>
              <h4 className="displayname">{user.displayname}</h4>
              <p className="username">@{user.username}</p>
            </div>
          </a>
        ))}
      </div>
    );
  };

  return (
    <form className="search-form" onSubmit={handleSearchSubmit}>
      <input
        type="text"
        value={searchValue}
        onChange={handleSearchChange}
        placeholder="Search users"
      />
      {renderDropdownList()}
    </form>
  );
};

export default UserSearch;
