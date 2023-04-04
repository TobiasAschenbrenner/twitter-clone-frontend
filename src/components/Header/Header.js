import React from "react";
import "./Header.css";

const Header = ({ title, isProfilePage }) => {
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
                    <a href="./index.js">Following</a>
                  </li>
                  <li>
                    <a href="./index.js">Friends are Following</a>
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
