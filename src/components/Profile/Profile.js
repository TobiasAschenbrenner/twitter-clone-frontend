import React, { useState, useEffect } from "react";
import "./Profile.css";

const API_BASE_URL = "https://api.chirp.koenidv.de";

const getUsernameFromJWT = async () => {
  const token = localStorage.getItem("jwt");

  if (token) {
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
  }

  return null;
};

const Profile = ({ userProfile, updateUserProfile }) => {
  const [editing, setEditing] = useState(false);
  const [updatedBio, setUpdatedBio] = useState(userProfile.bio || "");
  const [updatedDisplayName, setUpdatedDisplayName] = useState(
    userProfile.displayname || ""
  );
  const [updatedUsername, setUpdatedUsername] = useState("");
  const [loggedInUsername, setLoggedInUsername] = useState(null);
  const [following, setFollowing] = useState(false);
  const [hover, setHover] = useState(false);
  const [followings, setFollowings] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [showFollowings, setShowFollowings] = useState(false);
  const [showFollowers, setShowFollowers] = useState(false);

  useEffect(() => {
    setUpdatedUsername(userProfile.username || "");
  }, [userProfile]);

  useEffect(() => {
    const fetchUsername = async () => {
      const username = await getUsernameFromJWT();
      setLoggedInUsername(username);
    };

    fetchUsername();
  }, []);

  const isCurrentUser = loggedInUsername === userProfile.username;

  useEffect(() => {
    if (!isCurrentUser) {
      const fetchFollowStatus = async () => {
        if (loggedInUsername && userProfile.username) {
          try {
            const response = await fetch(
              `${API_BASE_URL}/v1/user/${userProfile.username}/follow`,
              {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${localStorage.getItem("jwt")}`,
                },
              }
            );

            if (response.ok) {
              const data = await response.json();
              setFollowing(data);
              console.log(data);
              console.log(userProfile);
            } else {
              console.error(
                "Error checking follow status:",
                response.status,
                response.statusText
              );
            }
          } catch (error) {
            console.error("Error checking follow status:", error);
          }
        } else {
          console.error(
            "Error: userProfile.username or loggedInUsername is null"
          );
        }
      };

      fetchFollowStatus();
    }
  }, [loggedInUsername, userProfile.username, userProfile, isCurrentUser]);

  const handleFollow = async () => {
    try {
      if (userProfile.username) {
        const response = await fetch(
          `${API_BASE_URL}/v1/user/${userProfile.username}/follow`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("jwt")}`,
            },
            body: JSON.stringify({ follow: !following }),
          }
        );

        if (response.ok) {
          console.log("Follow/Unfollow successful");
          setFollowing(!following);
        } else {
          console.error(
            "Error following/unfollowing user:",
            response.status,
            response.statusText
          );
        }
      } else {
        console.error("Error: userProfile.username is null");
      }
    } catch (error) {
      console.error("Error following/unfollowing user:", error);
    }
  };

  const fetchFollowings = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/v1/user/${userProfile.username}/following`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setFollowings(data);
        setShowFollowings(true);
        setShowFollowers(false);
      } else {
        console.error(
          "Error fetching followings:",
          response.status,
          response.statusText
        );
      }
    } catch (error) {
      console.error("Error fetching followings:", error);
    }
  };

  const fetchFollowers = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/v1/user/${userProfile.username}/followers`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setFollowers(data);
        setShowFollowers(true);
        setShowFollowings(false);
      } else {
        console.error(
          "Error fetching followers:",
          response.status,
          response.statusText
        );
      }
    } catch (error) {
      console.error("Error fetching followers:", error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();
    return `${month} ${year}`;
  };

  const handleClose = () => {
    setShowFollowers(false);
    setShowFollowings(false);
  };

  return (
    <div className="profile">
      <img src={userProfile.avatar_url} alt="Profile" />
      {editing ? (
        <>
          <input
            type="text"
            value={updatedDisplayName}
            onChange={(e) => setUpdatedDisplayName(e.target.value)}
          />
          <textarea
            value={updatedBio}
            onChange={(e) => setUpdatedBio(e.target.value)}
          ></textarea>
          <button
            onClick={updateUserProfile(
              updatedUsername,
              updatedDisplayName,
              updatedBio
            )}
          >
            Save
          </button>
        </>
      ) : (
        <>
          <h2>{userProfile.displayname}</h2>
          <p>@{userProfile.username}</p>
          <p>{userProfile.bio}</p>
          {isCurrentUser ? (
            <button onClick={() => setEditing(!editing)}>
              {editing ? "Cancel" : "Edit"}
            </button>
          ) : (
            <button
              onClick={handleFollow}
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
            >
              {following ? (hover ? "Unfollow" : "Following") : "Follow"}
            </button>
          )}
        </>
      )}
      <p>Joined: {formatDate(userProfile.created_at)}</p>
      <div className="profile-buttons">
        <button
          className="following-button follow-stats-button"
          onClick={fetchFollowings}
        >
          {userProfile.count_followings} Following
        </button>
        <button
          className="follower-button follow-stats-button"
          onClick={fetchFollowers}
        >
          {userProfile.count_followers} Followers
        </button>
      </div>
      {showFollowings && (
        <div className="modal">
          <div className="modal-content">
            <button type="button" className="close-btn" onClick={handleClose}>
              &times;
            </button>
            <h3>Following</h3>
            <ul>
              {followings.map((following, index) => (
                <li key={index}>
                  {following.displayname} (@{following.username})
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      {showFollowers && (
        <div className="modal">
          <div className="modal-content">
            <button type="button" className="close-btn" onClick={handleClose}>
              &times;
            </button>
            <h3>Followers</h3>
            <ul>
              {followers.map((follower, index) => (
                <li key={index}>
                  {follower.displayname} (@{follower.username})
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
