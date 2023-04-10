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
  const [updatedUsername, setUpdatedUsername] = useState(
    userProfile.username || ""
  );
  const [loggedInUsername, setLoggedInUsername] = useState(null);

  useEffect(() => {
    const fetchUsername = async () => {
      const username = await getUsernameFromJWT();
      setLoggedInUsername(username);
    };

    fetchUsername();
  }, []);

  const isCurrentUser = loggedInUsername === userProfile.username;

  const handleEdit = () => {
    setEditing(true);
  };

  const handleSave = async () => {
    updateUserProfile({
      ...userProfile,
      displayname: updatedDisplayName,
      username: updatedUsername,
      bio: updatedBio,
    });
    setEditing(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();
    return `${month} ${year}`;
  };

  return (
    <div className="profile">
      <div>
        {editing && isCurrentUser ? (
          <>
            <label htmlFor="updatedDisplayName">Display Name:</label>
            <input
              type="text"
              id="updatedDisplayName"
              value={updatedDisplayName}
              onChange={(e) => setUpdatedDisplayName(e.target.value)}
            />
            <label htmlFor="updatedUsername">Username:</label>
            <input
              type="text"
              id="updatedUsername"
              value={updatedUsername}
              onChange={(e) => setUpdatedUsername(e.target.value)}
            />
            <label htmlFor="updatedBio">Bio:</label>
            <textarea
              id="updatedBio"
              value={updatedBio}
              onChange={(e) => setUpdatedBio(e.target.value)}
            />
            <button onClick={handleSave}>Save Changes</button>
          </>
        ) : (
          <>
            <img src={userProfile.profile_image_url} alt="Profile" />
            <h2>{userProfile.displayname}</h2>
            <p>@{userProfile.username}</p>
            <p>{userProfile.bio}</p>
            {isCurrentUser ? (
              <button onClick={handleEdit}>Edit Profile</button>
            ) : (
              <button>Follow</button>
            )}
          </>
        )}
        <p>Joined: {formatDate(userProfile.created_at)}</p>
      </div>
    </div>
  );
};

export default Profile;
