import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Sidebar.scss";
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
      <h1>Chirp</h1>
      <div className="sidebar-links">
        <Link to="/home">The Forest</Link>
        <Link to="/notifications">Notifications</Link>
        <Link to="/messages">Messages</Link>
        <Link to="/profile">Your Nest</Link>
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
