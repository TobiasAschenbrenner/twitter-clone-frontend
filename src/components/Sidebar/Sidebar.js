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
      <h1>Chirp</h1>
      <div className="sidebar-links">
        <Link to="/home">The Forest</Link>
        <Link to="/notifications">Notifications</Link>
        <Link to="/messages">Messages</Link>
        <Link to="/me">Your Nest</Link>
        <Link to="/security/sessions">[Sec] Sessions</Link>
        <Link to="/security/logs">[Sec] Logs</Link>
        <Link to="/more">More</Link>
        <button className="tweet-btn" onClick={handleTweetButtonClick}>
          Write Something
        </button>
      </div>
      {isCreatingTweet && <CreateTweet />}
    </div>
  );
}

export default Sidebar;
