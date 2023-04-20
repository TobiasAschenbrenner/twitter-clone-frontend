import React, { useState } from "react";
import "./Header.css";

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

      if (data && data.users) {
        setSearchResults(data.users);
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
            <li key={user.id}>
              {/* Replace the Link with the user's profile link */}
              <a href={`/profile/${user.id}`}>{user.username}</a>
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
                <ul>
                  <li>
                    <button onClick={() => extendedFeedCb(false)}>
                      Following
                    </button>
                  </li>
                  <li>
                    <button onClick={() => extendedFeedCb(true)}>
                      Friends are Following
                    </button>
                  </li>
                </ul>
              </nav>
              {/* Add search form */}
              <form className="search-form" onSubmit={handleSearchSubmit}>
                <input
                  type="text"
                  value={searchValue}
                  onChange={handleSearchChange}
                  placeholder="Search users"
                />
              </form>
            </>
          )}
        </div>
      </div>
      {/* Render the dropdown list */}
      {renderDropdownList()}
    </header>
  );
};

export default Header;
