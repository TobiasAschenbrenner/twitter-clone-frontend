import React, { useState } from "react";
import "./Header.scss";

const Header = ({ title, isProfilePage, extendedFeedCb }) => {
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
        <ul>
          {searchResults.map((user) => (
            <li key={user.username}>
              <a href={`/${user.username}`}>{user.username}</a>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <header>
      <div className="container">
        <div className="header-container">
          {isProfilePage ? (
            <nav>
              <div className="username">{title}</div>
            </nav>
          ) : (
            <>
              <nav>
                <button onClick={() => extendedFeedCb(false)}>Following</button>
                <button onClick={() => extendedFeedCb(true)}>
                  Friends are Following
                </button>
                <form className="search-form" onSubmit={handleSearchSubmit}>
                  <input
                    type="text"
                    value={searchValue}
                    onChange={handleSearchChange}
                    placeholder="Search users"
                  />
                  {renderDropdownList()}
                </form>
              </nav>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
