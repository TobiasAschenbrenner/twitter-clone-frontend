import { useState } from "react";

// fixme this SHOULD be in a config file
const API_BASE_URL = "https://api.chirp.koenidv.de";

const PasswordForm = (token) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const result = await fetch(`${API_BASE_URL}/v1/auth/resetpassword`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({ newpassword: password }),
    });

    if (result.status === 200) {
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <div className="signup">
        <div class="header">
          <h1>All Done!</h1>
          <p>You can now login with your new password.</p>
          <a href="/">Go to Login</a>
        </div>
      </div>
    );
  } else {
    return (
      <div className="signup">
        <div class="header">
          <h1>Almost there!</h1>
          <p>
            Enter a new password
          </p>
        </div>
        <form onSubmit={handleSubmit} className="reset-form">
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
          <button type="submit">Reset Password</button>
        </form>
      </div>
    );
  }
};

export default PasswordForm;
