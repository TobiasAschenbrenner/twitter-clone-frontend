import React from "react";
import "./Header.scss";
import UserSearch from "../UserSearch/UserSearch";

const Header = ({ title, isProfilePage, extendedFeedCb }) => {
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
                <UserSearch />
              </nav>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
