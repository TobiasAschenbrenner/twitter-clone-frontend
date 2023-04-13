import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css";
import CreateTweet from "../CreateTweet/CreateTweet";

function Sidebar() {
  const [isCreatingTweet, setIsCreatingTweet] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const token = localStorage.getItem("jwt");
        const response = await fetch("https://api.thechirp.de/v1/user/me", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setUsername(data.username);
      } catch (error) {
        console.error("Error fetching username: ", error);
      }
    };

    fetchUsername();
  }, []);

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
            <Link to={`/${username}`}>Profile</Link>
          </li>
          <li className="sidebar-link">
            <Link to="/more">More</Link>
          </li>
          <li>
            <button className="tweet-btn" onClick={handleTweetButtonClick}>
              Tweet
            </button>
          </li>
        </ul>
      </div>
      {isCreatingTweet && <CreateTweet />}
    </div>
  );
}

export default Sidebar;
