import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SignUp.scss";

const API_BASE_URL = "https://api.chirp.koenidv.de";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [displayname, setDisplayname] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoginForm, setIsLoginForm] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    if (isLoginForm) {
      loginUser(email, password);
    } else {
      if (password === confirmPassword) {
        registerUser(email, password, username, displayname);
      } else {
        alert("Passwords do not match.");
      }
    }
  };

  const registerUser = async (email, password, username, displayname) => {
    try {
      const responseOne = await fetch(`${API_BASE_URL}/v1/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!responseOne.ok) {
        throw new Error(`HTTP error! Status: ${responseOne.status}`);
      }

      const loggedIn = await loginUser(email, password);
      if (!loggedIn) {
        throw new Error("Error logging in user after registration");
      }

      const jwt = localStorage.getItem("jwt");

      const responseTwo = await fetch(`${API_BASE_URL}/v1/user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({ username, displayname }),
      });

      if (!responseTwo.ok) {
        throw new Error(`HTTP error! Status: ${responseTwo.status}`);
      }

      console.log("User registered successfully");
      navigate("/home");
    } catch (error) {
      console.error("Error registering user:", error);
    }
  };

  const loginUser = async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/v1/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.status === 200) {
      const { jwt } = await response.json();
      localStorage.setItem("jwt", jwt);
      navigate("/home");
      return true;
    } else {
      console.error("Error logging in user: Invalid email or password");
      return false;
    }
  };

  const toggleForm = () => {
    setIsLoginForm(!isLoginForm);
  };

  return (
    <div className="signup">
      <div className="header">
        <h1>{isLoginForm ? "Log In" : "Build your Nest"}</h1>
        {!isLoginForm && <p>Create an Account.</p>}
      </div>
      <form onSubmit={handleSubmit} className="signup-form">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {!isLoginForm && (
          <>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Display Name"
              value={displayname}
              onChange={(e) => setDisplayname(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </>
        )}
        {isLoginForm && (
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        )}
        <button type="submit">{isLoginForm ? "Log In" : "Sign Up"}</button>
      </form>
      <div className="toggleForm">
        <p>
          {isLoginForm
            ? "Don't have an account yet?"
            : "Already have an account?"}
        </p>
        <button onClick={toggleForm}>
          {isLoginForm ? "Register now" : "Go to login"}
        </button>
      </div>
      {isLoginForm && <a href="/resetpassword">Forgot your password?</a>}
    </div>
  );
};

export default SignUp;
