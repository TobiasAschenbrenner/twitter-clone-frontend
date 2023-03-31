import React from "react";
import "./Sidebar.css";

function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebar-links">
        <ul>
          <li className="sidebar-link">
            <a href="./index.js">Home</a>
          </li>
          <li className="sidebar-link">
            <a href="./index.js">Notifications</a>
          </li>
          <li className="sidebar-link">
            <a href="./index.js">Messages</a>
          </li>
          <li className="sidebar-link">
            <a href="./index.js">Profile</a>
          </li>
          <li className="sidebar-link">
            <a href="./index.js">More</a>
          </li>
          <li className="tweet-btn">
            <a href="./index.js">Tweet</a>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;
