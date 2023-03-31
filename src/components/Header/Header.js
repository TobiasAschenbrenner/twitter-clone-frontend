import React from "react";
import "./Header.css";

function Header() {
  return (
    <header>
      <div className="container">
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
      </div>
    </header>
  );
}

export default Header;
