import React, { useState, useEffect } from "react";
import "./Profile.css";
import Header from "../../components/Header/Header";
import Profile from "../../components/Profile/Profile";
import Sidebar from "../../components/Sidebar/Sidebar";
import Footer from "../../components/Footer/Footer";
import Feed from "../../components/Feed/Feed";
import { useNavigate, useParams } from "react-router-dom";
import { API_BASE_URL } from "../../config";
import { Authentication } from "../../utils/Authentication";

function ProfilePage() {
  const [userProfile, setUserProfile] = useState({});
  const { username } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile(username);
  }, [username]);

  const fetchProfile = async (username) => {
    const jwt = await Authentication.getInstance().getJwt();
    if (!jwt) navigate("/");

    try {
      const response = await fetch(`${API_BASE_URL}/v1/user/${username}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const profileData = await response.json();
      setUserProfile(profileData);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const updateProfile = async (updatedProfile) => {
    const jwt = await Authentication.getInstance().getJwt();
    if (!jwt) navigate("/");

    try {
      const response = await fetch(`${API_BASE_URL}/v1/user`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify(updatedProfile),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const profileData = await response.json();
      setUserProfile(profileData);
    } catch (error) {
      console.error("Error updating user profile:", error);
    }
  };

  return (
    <div className="ProfilePage">
      <Header title={userProfile.displayname} isProfilePage={true} />
      <Sidebar />
      <Profile
        userProfile={userProfile}
        updateUserProfile={updateProfile}
        isCurrentUser={userProfile.username === username}
      />
      <Feed />
      <Footer />
    </div>
  );
}

export default ProfilePage;
