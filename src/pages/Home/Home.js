import React from "react";
import "./Home.css";
import Header from "../../components/Header/Header";
import Sidebar from "../../components/Sidebar/Sidebar";
import Footer from "../../components/Footer/Footer";

function Home() {
  return (
    <div className="Home">
      <Header />
      <Sidebar />
      <Footer />
    </div>
  );
}

export default Home;
