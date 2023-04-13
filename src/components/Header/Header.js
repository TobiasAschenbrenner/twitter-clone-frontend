import React from "react";
import "./Header.scss";

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
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
