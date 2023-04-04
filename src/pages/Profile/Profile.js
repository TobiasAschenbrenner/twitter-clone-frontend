import React, { useState, useEffect } from "react";
import "./Profile.css";
import Header from "../../components/Header/Header";
import Profile from "../../components/Profile/Profile";
import Sidebar from "../../components/Sidebar/Sidebar";
import Footer from "../../components/Footer/Footer";
import Feed from "../../components/Feed/Feed";

const API_BASE_URL = "https://api.chirp.koenidv.de";

function ProfilePage() {
  const [userProfile, setUserProfile] = useState({});

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const token = localStorage.getItem("jwt");

    try {
      const response = await fetch(`${API_BASE_URL}/v1/user/me`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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

  return (
    <div className="ProfilePage">
      <Header title={userProfile.displayname} isProfilePage={true} />
      <Sidebar />
      <Profile userProfile={userProfile} setUserProfile={setUserProfile} />
      <Feed />
      <Footer />
    </div>
  );
}

export default ProfilePage;
