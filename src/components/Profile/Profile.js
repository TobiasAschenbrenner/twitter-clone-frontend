import React, { useState } from "react";
import "./Profile.css";

const Profile = ({ userProfile, updateUserProfile }) => {
  const [editing, setEditing] = useState(false);
  const [updatedBio, setUpdatedBio] = useState("");

  const handleEdit = () => {
    setEditing(true);
    setUpdatedBio(userProfile.bio);
  };

  const handleSave = async () => {
    updateUserProfile({
      ...userProfile,
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
        {editing ? (
          <>
            <label htmlFor="updatedDisplayName">Display Name:</label>
            <input
              type="text"
              id="updatedDisplayName"
              value={userProfile.displayname}
              readOnly
            />
            <label htmlFor="updatedUsername">Username:</label>
            <input
              type="text"
              id="updatedUsername"
              value={userProfile.username}
              readOnly
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
            <button onClick={handleEdit}>Edit Profile</button>
          </>
        )}
        <p>Joined: {formatDate(userProfile.created_at)}</p>
      </div>
    </div>
  );
};

export default Profile;
