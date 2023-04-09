import React from "react";
import "./Home.scss";
import Header from "../../components/Header/Header";
import Sidebar from "../../components/Sidebar/Sidebar";
import Footer from "../../components/Footer/Footer";
import Feed from "../../components/Feed/Feed";
import { useState } from "react";

function Home() {
  let [extendedFeed, setExtendedFeed] = useState(false);

  return (
    <div className="Home">
      <Header
        isProfilePage={false}
        extendedFeedCb={(it) => setExtendedFeed(it)}
      />
      <div className="content">
        <Sidebar />
        <Feed extendedFeed={extendedFeed} />
      </div>
      <Footer />
    </div>
  );
}

export default Home;
