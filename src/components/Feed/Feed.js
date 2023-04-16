import React, { useEffect, useState } from "react";
import "./Feed.scss";
import { useLocation } from "react-router-dom";

const API_BASE_URL = "https://api.thechirp.de";

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

async function fetchAuthorInfo(authorId) {
  try {
    const response = await fetch(`${API_BASE_URL}/v1/user/${authorId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      console.error(
        "Error fetching author info:",
        response.status,
        response.statusText
      );
      return null;
    }
  } catch (error) {
    console.error("Error fetching author info:", error);
    return null;
  }
}

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
        .then(async (data) => {
          console.log(data);

          // Fetch author data for each tweet
          const authorDataPromises = data.map(async (tweet) => {
            const authorInfo = await fetchAuthorInfo(tweet.author_id);
            return { ...tweet, authorInfo };
          });

          const updatedTweets = await Promise.all(authorDataPromises);
          setTweets(updatedTweets);
          setLoading(false);
        })
        .catch((error) => console.error(error));
    };

    fetchTweets();
  }, [extendedFeed, location.pathname]);

  const sortedTweets = tweets.sort((a, b) => {
    return new Date(b.created_at) - new Date(a.created_at);
  });

  return (
    <div className="feed">
      {loading ? (
        <p>Loading tweets...</p>
      ) : (
        <>
          {sortedTweets.length > 0 ? (
            sortedTweets.map((tweet) => (
              <div key={tweet.id} className="tweet">
                <div className="tweet-header">
                    <img
                      src={tweet.authorInfo.profile_image_url}
                      alt={`${tweet.authorInfo.displayname}'s profile`}
                      className="profile-picture"
                    />
                  <div className="author-info">
                    <p>
                      {tweet.authorInfo.displayname}
                    </p>
                    <p>@{tweet.authorInfo.username}</p>
                  </div>
                </div>
                {tweet.media?.length > 0 && (
                  <img
                    src={tweet.media[0].url}
                    alt={tweet.media[0].description}
                    className="media"
                  />
                )}
                <p className="text">{tweet.content}</p>
                <p className="metadata">
                  Posted on {new Date(tweet.created_at).toLocaleString()}
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
