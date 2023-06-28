import React, { useEffect, useState } from "react";
import "./Feed.scss";
import { useLocation } from "react-router-dom";
import CreateComment from "../CreateComment/CreateComment";

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

async function handleLikeOrUnlikeTweet(tweet_id) {
  const token = localStorage.getItem("jwt");

  try {
    const like_status = await fetch(
      `${API_BASE_URL}/v1/tweet/${tweet_id}/like`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    await fetch(`${API_BASE_URL}/v1/tweet/${tweet_id}/like`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: like_status ? false : true,
    });

    const tweetResponse = await fetch(
      `${API_BASE_URL}/v1/tweet/${tweet_id}/like/all`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const updatedTweet = await tweetResponse.json();

    return updatedTweet;
  } catch (error) {
    console.error("Error liking/unliking tweet:", error);
    return null;
  }
}

async function handleCommentOnTweet(tweet_id, comment) {
  const token = localStorage.getItem("jwt");

  try {
    const response = await fetch(
      `${API_BASE_URL}/v1/tweet/${tweet_id}/comment`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: comment,
      }
    );

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      console.error(
        "Error commenting on tweet:",
        response.status,
        response.statusText
      );
      return null;
    }
  } catch (error) {
    console.error("Error commenting on tweet:", error);
    return null;
  }
}

function Feed({ extendedFeed }) {
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const [comment, setComment] = useState(false);

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

  const onLikeClick = async (tweet_id) => {
    console.log("Clicked like/unlike for tweetId: ", tweet_id);
    const updatedTweet = await handleLikeOrUnlikeTweet(tweet_id);

    if (updatedTweet) {
      setTweets((tweets) =>
        tweets.map((tweet) =>
          tweet.tweet_id === tweet_id
            ? { ...tweet, like_count: updatedTweet.like_count }
            : tweet
        )
      );
    }
  };

  const onCommentClick = async (tweet_id) => {
    console.log("Clicked comment for tweetId: ", tweet_id);
    setComment((prevState) => !prevState);
    await handleCommentOnTweet(tweet_id, comment);
  };

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
                  <button
                    onClick={() =>
                      tweet.tweet_id && onLikeClick(tweet.tweet_id)
                    }
                  >
                    {tweet.like_count} likes
                  </button>
                  <button
                    onClick={() =>
                      tweet.tweet_id && onCommentClick(tweet.tweet_id)
                    }
                  >
                    {tweet.comment_count} comments
                  </button>
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
                {comment && <CreateComment />}
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
