import React, { useState, useEffect, useCallback } from "react";
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

const getUserId = async (username) => {
  try {
    const response = await fetch(`${API_BASE_URL}/v1/user/${username}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      console.log(`User ID for ${username}:`, data.user_id);
      return data.user_id;
    } else {
      console.error(
        `Error fetching user ID for ${username}:`,
        response.status,
        response.statusText
      );
      return null;
    }
  } catch (error) {
    console.error(`Error fetching user ID for ${username}:`, error);
    return null;
  }
};

const Profile = ({ userProfile, updateUserProfile }) => {
  const [editing, setEditing] = useState(false);
  const [updatedBio, setUpdatedBio] = useState(userProfile.bio || "");
  const [updatedDisplayName, setUpdatedDisplayName] = useState(
    userProfile.displayname || ""
  );
  const [updatedUsername, setUpdatedUsername] = useState("");

  useEffect(() => {
    setUpdatedUsername(userProfile.username || "");
  }, [userProfile]);

  const [loggedInUsername, setLoggedInUsername] = useState(null);
  const [following, setFollowing] = useState(false);
  const [hover, setHover] = useState(false);

  useEffect(() => {
    const fetchUsername = async () => {
      const username = await getUsernameFromJWT();
      setLoggedInUsername(username);
    };

    fetchUsername();
  }, []);

  const isCurrentUser = loggedInUsername === userProfile.username;

  const handleFollow = async () => {
    try {
      const ref_id = await getUserId(userProfile.username);

      if (ref_id) {
        const response = await fetch(
          `${API_BASE_URL}/v1/user/${ref_id}/follow`,
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
        console.error("Error: user_id or ref_id is null");
      }
    } catch (error) {
      console.error("Error following/unfollowing user:", error);
    }
  };

  const checkFollowStatus = useCallback(async () => {
    try {
      const ref_id = await getUserId(userProfile.username);

      if (ref_id) {
        const response = await fetch(
          `${API_BASE_URL}/v1/user/${ref_id}/follow`,
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
          setFollowing(data.following);
        } else {
          console.error(
            "Error checking follow status:",
            response.status,
            response.statusText
          );
        }
      } else {
        console.error("Error: user_id or ref_id is null");
      }
    } catch (error) {
      console.error("Error checking follow status:", error);
    }
  }, [userProfile.username]);

  useEffect(() => {
    if (!isCurrentUser) {
      checkFollowStatus();
    }
  }, [loggedInUsername, userProfile, checkFollowStatus, isCurrentUser]);

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
    </div>
  );
};

export default Profile;
