import React from "react";
import "./Home.css";
import Header from "../../components/Header/Header";
import Sidebar from "../../components/Sidebar/Sidebar";
import Footer from "../../components/Footer/Footer";
import Feed from "../../components/Feed/Feed";

function Home() {
  return (
    <div className="Home">
      <Header isProfilePage={false} />
      <div className="content">
        <Sidebar />
        <Feed />
      </div>
      <Footer />
    </div>
  );
}

export default Home;
