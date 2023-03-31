import React from "react";
import "./Home.css";
import Header from "../../components/Header/Header";
import Sidebar from "../../components/Sidebar/Sidebar";
import Footer from "../../components/Footer/Footer";
import Feed from "../../components/Feed/Feed";

function Home() {
  return (
    <div className="Home">
      <Header />
      <Sidebar />
      <Feed />
      <Footer />
    </div>
  );
}

export default Home;
