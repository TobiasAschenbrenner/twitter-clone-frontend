import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import SignUp from "./pages/SignUp/SignUp";
import ValidateToken from "./utils//auth";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignUp />} />
        <Route
          path="/home"
          element={
            <ValidateToken>
              <Home />
            </ValidateToken>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
