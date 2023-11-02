import React, { useEffect, useState } from "react";
import "./Feed.scss";
import { useLocation } from "react-router-dom";
import { API_BASE_URL } from "../../config";

const getUsernameFromJWT = async () => {
  const token = localStorage.getItem("jwt");

  try {
    const response = await fetch(`${API_BASE_URL}/v1/user/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data.username;
    } else {
      console.error(
        "Error fetching username:",
        response.status,
        response.statusText
      );
      return null;
    }
  } catch (error) {
    console.error("Error fetching username:", error);
    return null;
  }
};

function Feed({ extendedFeed }) {
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const username = location.pathname.split("/")[1];

    const fetchTweets = async () => {
      const currentUser = username === "me" ? await getUsernameFromJWT() : null;

      const fetchUrl =
        username === "home"
          ? `${API_BASE_URL}/v1/tweet${extendedFeed ? "/extend" : ""}`
          : `${API_BASE_URL}/v1/user/${
              username === "me" ? currentUser : username
            }/tweets`;

      fetch(fetchUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          setTweets(data || []);
          setLoading(false);
        })
        .catch((error) => console.error(error));
    };

    fetchTweets();
  }, [extendedFeed, location.pathname]);

  return (
    <div className="feed">
      {loading ? (
        <p>Loading tweets...</p>
      ) : (
        <>
          {tweets.length > 0 ? (
            tweets.map((tweet) => (
              <div key={tweet.id} className="tweet">
                {tweet.media?.length > 0 && (
                  <img
                    src={tweet.media[0].url}
                    alt={tweet.media[0].description}
                    className="media"
                  />
                )}
                <p className="text">{tweet.content}</p>
                <p className="metadata">
                  Posted by: {tweet.author_id} on{" "}
                  {new Date(tweet.created_at).toLocaleString()}
                </p>
                <div className="actions">
                  <span className="likes">{tweet.like_count} likes</span>
                  <span className="comments">
                    {tweet.comment_count} comments
                  </span>
                  {tweet.mentions?.length > 0 && (
                    <ul className="mentions">
                      {tweet.mentions.map((mention) => (
                        <li key={mention.id} className="mention">
                          {mention.name}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p>No tweets to display.</p>
          )}
        </>
      )}
    </div>
  );
}

export default Feed;
