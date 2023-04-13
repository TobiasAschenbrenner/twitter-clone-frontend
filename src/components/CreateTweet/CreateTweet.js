import React, { useState } from "react";
import "./CreateTweet.css";

const API_BASE_URL = "https://api.thechirp.de";

const CreateTweet = () => {
  const [tweetContent, setTweetContent] = useState("");
  const [show, setShow] = useState(true);

  const handleNewTweet = async (tweetContent) => {
    // Call the API to create a new tweet with the tweetContent
    const response = await fetch(`${API_BASE_URL}/v1/tweet`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
      body: JSON.stringify({ content: tweetContent, mentions: [] }), // Assuming no mentions for now
    });

    if (response.ok) {
      const tweetId = await response.text();
      console.log("New tweet created with ID:", tweetId);
      // Refresh the tweets list or perform any other action needed after a successful tweet creation
    } else {
      console.error("Error creating the tweet");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleNewTweet(tweetContent);
    setTweetContent("");
  };

  const handleClose = () => {
    setShow(false);
  };

  return (
    show && (
      <div className="create-tweet-container">
        <form className="create-tweet-form" onSubmit={handleSubmit}>
          <button type="button" className="close-btn" onClick={handleClose}>
            &times;
          </button>
          <textarea
            value={tweetContent}
            onChange={(e) => setTweetContent(e.target.value)}
            placeholder="What's happening?"
          ></textarea>
          <button className="submit-btn" type="submit">
            Post
          </button>
        </form>
      </div>
    )
  );
};

export default CreateTweet;
