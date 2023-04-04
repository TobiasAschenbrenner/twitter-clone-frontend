import React from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebar-links">
        <ul>
          <li className="sidebar-link">
            <Link to="/home">Home</Link>
          </li>
          <li className="sidebar-link">
            <Link to="/notifications">Notifications</Link>
          </li>
          <li className="sidebar-link">
            <Link to="/messages">Messages</Link>
          </li>
          <li className="sidebar-link">
            <Link to="/profile">Profile</Link>
          </li>
          <li className="sidebar-link">
            <Link to="/more">More</Link>
          </li>
          <li className="tweet-btn">
            <Link to="/tweet">Tweet</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;
