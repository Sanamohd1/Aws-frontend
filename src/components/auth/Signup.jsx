import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../../authContext";
import { useNavigate, Link } from "react-router-dom";

import { PageHeader, Button } from "@primer/react";
import "./auth.css";
import logo from "../../assets/github-mark-white.svg";
import Alert from "../../Alert";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // ✅ FIX

  const { setCurrentUser } = useAuth();
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setErrorMessage("");

    const res = await axios.post(
  "http://52.91.90.194:3002/signup",
  {
    email,
    password,
    username,
  }
);


      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.userId);

      setCurrentUser(res.data.userId);

      navigate("/dashboard");
    } catch (err) {
      console.error(err);

      const message =
        err.response?.data?.message ||
        err.message ||
        "Signup failed";

      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-logo-container">
        <img className="logo-login" src={logo} alt="Logo" />
      </div>

      <div className="login-box-wrapper">
        {/* ✅ ERROR ALERT (CORRECT LOCATION) */}
        {errorMessage && (
          <div style={{ marginBottom: "15px" }}>
            <Alert message={errorMessage} type="error" />
          </div>
        )}

        <div className="login-heading">
          <PageHeader>
            <PageHeader.TitleArea variant="large">
              <PageHeader.Title>Sign Up</PageHeader.Title>
            </PageHeader.TitleArea>
          </PageHeader>
        </div>

        <div className="login-box">
          <div>
            <label className="label">Username</label>
            <input
              className="input"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <label className="label">Email address</label>
            <input
              className="input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="label">Password</label>
            <input
              className="input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button
            variant="primary"
            className="login-btn"
            disabled={loading}
            onClick={handleSignup}
          >
            {loading ? "Loading..." : "Signup"}
          </Button>
        </div>

        <div className="pass-box">
          <p>
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
