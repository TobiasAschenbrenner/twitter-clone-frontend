import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Sidebar.scss";
import CreateTweet from "../CreateTweet/CreateTweet";

function Sidebar() {
  const [isCreatingTweet, setIsCreatingTweet] = useState(false);

  const handleTweetButtonClick = (e) => {
    e.preventDefault();
    setIsCreatingTweet((prevState) => !prevState);
  };

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
          <li>
            <button className="tweet-btn" onClick={handleTweetButtonClick}>
              Write Something
            </button>
          </li>
        </ul>
      </div>
      {isCreatingTweet && <CreateTweet />}
    </div>
  );
}

export default Sidebar;
