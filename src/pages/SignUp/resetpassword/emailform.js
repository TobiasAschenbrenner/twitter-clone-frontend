import { useState } from "react";

// fixme this SHOULD be in a config file
const API_BASE_URL = "https://api.thechirp.de";

const EmailForm = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await fetch(`${API_BASE_URL}/v1/auth/resetpassword`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (result.status === 200) {
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <div className="signup">
        <div className="header">
          <h1>We're flying!</h1>
          <p>Check your emails to continue.</p>
        </div>
      </div>
    );
  } else {
    return (
      <div className="signup">
        <div className="header">
          <h1>Being a bit forgetful?</h1>
          <p>No worries. Everyone forgets their passwords. </p>
          <p>Use your email to get back to your nest.</p>
        </div>
        <form onSubmit={handleSubmit} className="reset-form">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit">Get a Reset Link</button>
        </form>
      </div>
    );
  }
};

export default EmailForm;
