import React, { useState } from "react";
import "./CreateComment.scss";

const API_BASE_URL = "https://api.thechirp.de";

const CreateComment = () => {
  const [commentContent, setCommentContent] = useState("");
  const [show, setShow] = useState(true);

  const handleNewComment = async (commentContent) => {
    // Call the API to create a new tweet with the tweetContent
    const response = await fetch(
      `${API_BASE_URL}/v1/tweet${tweet_id}/comment`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
        body: JSON.stringify({ content: commentContent }),
      }
    );

    if (response.ok) {
      const commendId = await response.text();
      console.log("New tweet created with ID:", commendId);
      // Refresh the tweets list or perform any other action needed after a successful tweet creation
    } else {
      console.error("Error creating the tweet");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleNewComment(commentContent);
    setCommentContent("");
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
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
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

export default CreateComment;
