import React from "react";
import { Navigate } from "react-router-dom";
import { Authentication } from "../../utils/Authentication";
import { useState } from "react";
import { useEffect } from "react";

const ProtectedRoute = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(true);
  
  useEffect(() => {
    Authentication.getInstance().getJwt().then((jwt) => {
      if (!jwt) setLoggedIn(false);
    });
  }, []);

  if (loggedIn) {
    return children;
  } else {
    return <Navigate to="/" />;
  }
};

export default ProtectedRoute;
