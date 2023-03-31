import React, { useEffect, useState } from "react";
import "./Feed.css";

function Feed() {
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://pstwitter.deno.dev/mock/tweets")
      .then((response) => response.json())
      .then((data) => {
        console.log(data); // Log data to the console
        setTweets(data?.tweets || []);
        setLoading(false);
      })
      .catch((error) => console.error(error));
  }, []);

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
                <p className="text">{tweet.text}</p>
                <p className="metadata">
                  Posted by: {tweet.author_id} on{" "}
                  {new Date(tweet.timestamp).toLocaleString()}
                </p>
                <div className="actions">
                  <span className="likes">{tweet.likes} likes</span>
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
