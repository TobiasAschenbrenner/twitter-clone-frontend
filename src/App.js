import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import SignUp from "./pages/SignUp/SignUp";
import Profile from "./pages/Profile/Profile";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import ResetPassword from "./pages/SignUp/resetpassword/resetpassword";
import "./App.scss";
import LogsPage from "./pages/Security/Logs/Logs";
import SessionsPage from "./pages/Security/Sessions/Sessions";

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/:username"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/:username"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<SignUp />} />
        <Route
          path="/resetpassword"
          element={<ResetPassword />}
        />
        <Route
          path="/security/logs"
          element={<LogsPage />}
        />
        <Route
          path="/security/sessions"
          element={<SessionsPage />}
        />
      </Routes>
    </Router>
  );
}

export default App;
